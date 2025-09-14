'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Manufacturers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            },
            country: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            website: {
                type: Sequelize.STRING(500),
                allowNull: true,
                validate: {
                    isUrl: true
                }
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
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
        await queryInterface.addIndex('Manufacturers', ['name']);
        await queryInterface.addIndex('Manufacturers', ['country']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Manufacturers');
    }
};