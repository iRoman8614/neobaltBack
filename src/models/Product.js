
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            // Связь многие к одному с категорией
            Product.belongsTo(models.Category, {
                foreignKey: 'categoryId',
                as: 'category',
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE'
            });

            // Связь многие к одному с производителем
            Product.belongsTo(models.Manufacturer, {
                foreignKey: 'manufacturerId',
                as: 'manufacturer',
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE'
            });
        }

        // Метод для получения всех изображений товара
        getImages() {
            const images = [];

            if (this.previewImage) images.push(this.previewImage);
            if (this.image1) images.push(this.image1);
            if (this.image2) images.push(this.image2);
            if (this.image3) images.push(this.image3);
            if (this.image4) images.push(this.image4);

            return images;
        }

        // Метод для получения дополнительных изображений (без превью)
        getAdditionalImages() {
            const images = [];

            if (this.image1) images.push(this.image1);
            if (this.image2) images.push(this.image2);
            if (this.image3) images.push(this.image3);
            if (this.image4) images.push(this.image4);

            return images;
        }

        // Виртуальное поле для JSON представления
        toJSON() {
            const values = Object.assign({}, this.get());

            values.images = this.getImages();
            values.additionalImages = this.getAdditionalImages();

            return values;
        }
    }

    Product.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Название товара не может быть пустым'
                },
                len: {
                    args: [1, 500],
                    msg: 'Название товара должно быть от 1 до 500 символов'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        previewImage: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            comment: 'URL превью изображения для каталога',
            validate: {
                isUrl: {
                    msg: 'Некорректный URL превью изображения'
                },
                len: {
                    args: [0, 1000],
                    msg: 'URL превью изображения не должен превышать 1000 символов'
                }
            }
        },
        image1: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            comment: 'URL первого дополнительного изображения',
            validate: {
                isUrl: {
                    msg: 'Некорректный URL первого изображения'
                },
                len: {
                    args: [0, 1000],
                    msg: 'URL первого изображения не должен превышать 1000 символов'
                }
            }
        },
        image2: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            comment: 'URL второго дополнительного изображения',
            validate: {
                isUrl: {
                    msg: 'Некорректный URL второго изображения'
                },
                len: {
                    args: [0, 1000],
                    msg: 'URL второго изображения не должен превышать 1000 символов'
                }
            }
        },
        image3: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            comment: 'URL третьего дополнительного изображения',
            validate: {
                isUrl: {
                    msg: 'Некорректный URL третьего изображения'
                },
                len: {
                    args: [0, 1000],
                    msg: 'URL третьего изображения не должен превышать 1000 символов'
                }
            }
        },
        image4: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            comment: 'URL четвертого дополнительного изображения',
            validate: {
                isUrl: {
                    msg: 'Некорректный URL четвертого изображения'
                },
                len: {
                    args: [0, 1000],
                    msg: 'URL четвертого изображения не должен превышать 1000 символов'
                }
            }
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Категория товара обязательна'
                },
                isInt: {
                    msg: 'ID категории должен быть числом'
                }
            }
        },
        manufacturerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Производитель товара обязателен'
                },
                isInt: {
                    msg: 'ID производителя должен быть числом'
                }
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Активен ли товар для показа в каталоге'
        },
        sortOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Порядок сортировки',
            validate: {
                isInt: {
                    msg: 'Порядок сортировки должен быть числом'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'Product',
        tableName: 'Products',
        timestamps: true,
        indexes: [
            {
                fields: ['categoryId']
            },
            {
                fields: ['manufacturerId']
            },
            {
                fields: ['isActive']
            },
            {
                fields: ['sortOrder']
            },
            {
                fields: ['name']
            },
            {
                fields: ['categoryId', 'manufacturerId', 'isActive']
            }
        ]
    });

    return Product;
};