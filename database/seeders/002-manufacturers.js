'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const manufacturers = [
            {
                name: 'Рот Фронт',
                country: 'Россия',
                website: 'https://rotfront.ru',
                description: 'Одна из старейших российских кондитерских фабрик, основанная в 1826 году',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Красный Октябрь',
                country: 'Россия',
                website: 'https://ko-conf.ru',
                description: 'Легендарная российская кондитерская фабрика, известная своими конфетами и шоколадом',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Бабаевский',
                country: 'Россия',
                website: 'https://babaevsky.ru',
                description: 'Российский производитель элитного шоколада и кондитерских изделий',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Milka',
                country: 'Германия',
                website: 'https://milka.com',
                description: 'Известный европейский бренд молочного шоколада',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Lindt',
                country: 'Швейцария',
                website: 'https://lindt.com',
                description: 'Швейцарский производитель премиального шоколада',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Ferrero',
                country: 'Италия',
                website: 'https://ferrero.com',
                description: 'Итальянская компания, производитель Nutella, Ferrero Rocher и других известных брендов',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Haribo',
                country: 'Германия',
                website: 'https://haribo.com',
                description: 'Немецкий производитель желейных конфет и мармелада',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Коркунов',
                country: 'Россия',
                website: 'https://korkunov.ru',
                description: 'Российский производитель элитных шоколадных конфет',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        await queryInterface.bulkInsert('Manufacturers', manufacturers, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Manufacturers', null, {});
    }
};