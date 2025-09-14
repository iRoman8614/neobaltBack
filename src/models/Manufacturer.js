'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Manufacturer extends Model {
        static associate(models) {
            // Связь один ко многим с товарами
            Manufacturer.hasMany(models.Product, {
                foreignKey: 'manufacturerId',
                as: 'products',
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE'
            });
        }
    }

    Manufacturer.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: 'Название производителя не может быть пустым'
                },
                len: {
                    args: [1, 255],
                    msg: 'Название производителя должно быть от 1 до 255 символов'
                }
            }
        },
        country: {
            type: DataTypes.STRING(100),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 100],
                    msg: 'Название страны не должно превышать 100 символов'
                }
            }
        },
        website: {
            type: DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isUrl: {
                    msg: 'Некорректный URL сайта'
                },
                len: {
                    args: [0, 500],
                    msg: 'URL сайта не должен превышать 500 символов'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Manufacturer',
        tableName: 'Manufacturers',
        timestamps: true,
        indexes: [
            {
                fields: ['name']
            },
            {
                fields: ['country']
            }
        ]
    });

    return Manufacturer;
};