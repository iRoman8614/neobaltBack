'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            // Связь один ко многим с товарами
            Category.hasMany(models.Product, {
                foreignKey: 'categoryId',
                as: 'products',
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE'
            });
        }
    }

    Category.init({
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
                    msg: 'Название категории не может быть пустым'
                },
                len: {
                    args: [1, 255],
                    msg: 'Название категории должно быть от 1 до 255 символов'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'Category',
        tableName: 'Categories',
        timestamps: true,
        indexes: [
            {
                fields: ['name']
            }
        ]
    });

    return Category;
};