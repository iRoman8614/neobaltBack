'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const categories = [
            {
                name: 'Торты',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Пирожные',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Печенье',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Конфеты',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Шоколад',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Мармелад',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Зефир и пастила',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Вафли',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await queryInterface.bulkInsert('Categories', categories, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Categories', null, {});
    }
};