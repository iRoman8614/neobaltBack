'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING(500),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            previewImage: {
                type: Sequelize.STRING(1000),
                allowNull: true,
                comment: 'URL превью изображения для каталога'
            },
            image1: {
                type: Sequelize.STRING(1000),
                allowNull: true,
                comment: 'URL первого дополнительного изображения'
            },
            image2: {
                type: Sequelize.STRING(1000),
                allowNull: true,
                comment: 'URL второго дополнительного изображения'
            },
            image3: {
                type: Sequelize.STRING(1000),
                allowNull: true,
                comment: 'URL третьего дополнительного изображения'
            },
            image4: {
                type: Sequelize.STRING(1000),
                allowNull: true,
                comment: 'URL четвертого дополнительного изображения'
            },
            categoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Categories',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            manufacturerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Manufacturers',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                comment: 'Активен ли товар для показа в каталоге'
            },
            sortOrder: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: 'Порядок сортировки'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        // Add indexes for better performance
        await queryInterface.addIndex('Products', ['categoryId']);
        await queryInterface.addIndex('Products', ['manufacturerId']);
        await queryInterface.addIndex('Products', ['isActive']);
        await queryInterface.addIndex('Products', ['sortOrder']);
        await queryInterface.addIndex('Products', ['name']);

        // Composite index for common filtering
        await queryInterface.addIndex('Products', ['categoryId', 'manufacturerId', 'isActive']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Products');
    }
};