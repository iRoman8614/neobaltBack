import { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

export default (sequelize, DataTypes) => {
    class Admin extends Model {
        static associate(models) {
            // Пока нет связей, но можно добавить логи действий админа
        }

        // Метод для проверки пароля
        async checkPassword(password) {
            return await bcrypt.compare(password, this.password);
        }

        // Виртуальное поле для безопасного JSON
        toJSON() {
            const values = Object.assign({}, this.get());
            delete values.password; // Никогда не отдаем пароль
            return values;
        }
    }

    Admin.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'Некорректный email'
                },
                notEmpty: {
                    msg: 'Email не может быть пустым'
                }
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'Хешированный пароль',
            validate: {
                notEmpty: {
                    msg: 'Пароль не может быть пустым'
                },
                len: {
                    args: [60, 60],
                    msg: 'Пароль должен быть захеширован'
                }
            },
            set(value) {
                // Хешируем пароль перед сохранением
                if (value && value.length < 60) { // Если это не хеш
                    const saltRounds = 12;
                    const hashedPassword = bcrypt.hashSync(value, saltRounds);
                    this.setDataValue('password', hashedPassword);
                } else {
                    this.setDataValue('password', value);
                }
            }
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Имя не может быть пустым'
                },
                len: {
                    args: [1, 255],
                    msg: 'Имя должно быть от 1 до 255 символов'
                }
            }
        },
        role: {
            type: DataTypes.ENUM('super_admin', 'admin', 'moderator'),
            allowNull: false,
            defaultValue: 'admin',
            validate: {
                isIn: {
                    args: [['super_admin', 'admin', 'moderator']],
                    msg: 'Некорректная роль'
                }
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Admin',
        tableName: 'Admins',
        timestamps: true,
        indexes: [
            {
                fields: ['email']
            },
            {
                fields: ['role']
            },
            {
                fields: ['isActive']
            }
        ],
        hooks: {
            beforeCreate: (admin) => {
                // Дополнительные проверки перед созданием
                if (!admin.password) {
                    throw new Error('Пароль обязателен');
                }
            }
        }
    });

    return Admin;
};