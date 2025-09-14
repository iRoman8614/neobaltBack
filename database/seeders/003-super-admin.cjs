'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Хешируем пароли
        const saltRounds = 12;

        const admins = [
            {
                email: 'admin@confectionery.com',
                password: await bcrypt.hash('SuperAdmin123!', saltRounds),
                name: 'Супер Администратор',
                role: 'super_admin',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'manager@confectionery.com',
                password: await bcrypt.hash('Manager123!', saltRounds),
                name: 'Менеджер Каталога',
                role: 'admin',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await queryInterface.bulkInsert('Admins', admins, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Admins', null, {});
    }
};