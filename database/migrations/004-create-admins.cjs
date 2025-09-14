'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Admins', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: 'Хешированный пароль'
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            role: {
                type: Sequelize.ENUM('super_admin', 'admin', 'moderator'),
                allowNull: false,
                defaultValue: 'admin'
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            lastLoginAt: {
                type: Sequelize.DATE,
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

        // Индексы
        await queryInterface.addIndex('Admins', ['email']);
        await queryInterface.addIndex('Admins', ['role']);
        await queryInterface.addIndex('Admins', ['isActive']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Admins');
    }
};