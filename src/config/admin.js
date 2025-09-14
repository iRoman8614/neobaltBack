const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSSequelize = require('@adminjs/sequelize');
const { Category, Manufacturer, Product } = require('../models');

// Регистрируем адаптер Sequelize
AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
});

// Конфигурация ресурсов
const adminOptions = {
    resources: [
        {
            resource: Category,
            options: {
                parent: {
                    name: 'Каталог',
                    icon: 'Folder'
                },
                properties: {
                    id: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    name: {
                        isTitle: true,
                        type: 'string',
                        isRequired: true
                    },
                    createdAt: {
                        isVisible: { list: true, filter: false, show: true, edit: false }
                    },
                    updatedAt: {
                        isVisible: { list: false, filter: false, show: true, edit: false }
                    }
                }
            }
        },
        {
            resource: Manufacturer,
            options: {
                parent: {
                    name: 'Каталог',
                    icon: 'Folder'
                },
                properties: {
                    id: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    name: {
                        isTitle: true,
                        type: 'string',
                        isRequired: true
                    },
                    country: {
                        type: 'string'
                    },
                    website: {
                        type: 'string'
                    },
                    description: {
                        type: 'textarea'
                    },
                    createdAt: {
                        isVisible: { list: true, filter: false, show: true, edit: false }
                    },
                    updatedAt: {
                        isVisible: { list: false, filter: false, show: true, edit: false }
                    }
                }
            }
        },
        {
            resource: Product,
            options: {
                parent: {
                    name: 'Каталог',
                    icon: 'Folder'
                },
                properties: {
                    id: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    name: {
                        isTitle: true,
                        type: 'string',
                        isRequired: true
                    },
                    description: {
                        type: 'textarea'
                    },
                    previewImage: {
                        type: 'string'
                    },
                    image1: {
                        type: 'string'
                    },
                    image2: {
                        type: 'string'
                    },
                    image3: {
                        type: 'string'
                    },
                    image4: {
                        type: 'string'
                    },
                    categoryId: {
                        type: 'reference',
                        reference: 'Category',
                        isRequired: true
                    },
                    manufacturerId: {
                        type: 'reference',
                        reference: 'Manufacturer',
                        isRequired: true
                    },
                    isActive: {
                        type: 'boolean'
                    },
                    sortOrder: {
                        type: 'number'
                    },
                    createdAt: {
                        isVisible: { list: true, filter: false, show: true, edit: false }
                    },
                    updatedAt: {
                        isVisible: { list: false, filter: false, show: true, edit: false }
                    }
                },
                listProperties: ['id', 'name', 'category', 'manufacturer', 'isActive', 'sortOrder', 'createdAt'],
                filterProperties: ['name', 'categoryId', 'manufacturerId', 'isActive'],
                showProperties: ['id', 'name', 'description', 'previewImage', 'image1', 'image2', 'image3', 'image4', 'category', 'manufacturer', 'isActive', 'sortOrder', 'createdAt', 'updatedAt'],
                editProperties: ['name', 'description', 'previewImage', 'image1', 'image2', 'image3', 'image4', 'categoryId', 'manufacturerId', 'isActive', 'sortOrder']
            }
        }
    ],
    rootPath: '/admin',
    branding: {
        companyName: 'Каталог кондитерских изделий',
        logo: false,
        softwareBrothers: false,
        withMadeWithLove: false
    }
};

// Создаем AdminJS инстанс
const adminJs = new AdminJS(adminOptions);

// Конфигурация аутентификации
const authenticate = async (email, password) => {
    const expectedEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'password';

    if (email === expectedEmail && password === expectedPassword) {
        return { email, role: 'admin' };
    }
    return null;
};

// Создаем роутер AdminJS с аутентификацией
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate,
    cookiePassword: process.env.SESSION_SECRET || 'some-secret-password-used-to-secure-cookie',
    cookieName: 'adminjs'
}, null, {
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || 'some-secret-password-used-to-secure-cookie'
});

module.exports = { adminJs, adminRouter };