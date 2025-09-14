import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import db from '../models/index.js';

const { Category, Manufacturer, Product, Admin } = db;

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
        },
        {
            resource: Admin,
            options: {
                parent: {
                    name: 'Администрирование',
                    icon: 'User'
                },
                properties: {
                    id: {
                        isVisible: { list: true, filter: true, show: true, edit: false }
                    },
                    email: {
                        isTitle: true,
                        type: 'string',
                        isRequired: true
                    },
                    password: {
                        type: 'password',
                        isVisible: { list: false, filter: false, show: false, edit: true }
                    },
                    name: {
                        type: 'string',
                        isRequired: true
                    },
                    role: {
                        type: 'select',
                        availableValues: [
                            { value: 'super_admin', label: 'Супер Администратор' },
                            { value: 'admin', label: 'Администратор' },
                            { value: 'moderator', label: 'Модератор' }
                        ]
                    },
                    isActive: {
                        type: 'boolean'
                    },
                    lastLoginAt: {
                        isVisible: { list: true, filter: false, show: true, edit: false }
                    },
                    createdAt: {
                        isVisible: { list: true, filter: false, show: true, edit: false }
                    },
                    updatedAt: {
                        isVisible: { list: false, filter: false, show: true, edit: false }
                    }
                },
                listProperties: ['id', 'email', 'name', 'role', 'isActive', 'lastLoginAt', 'createdAt'],
                filterProperties: ['email', 'role', 'isActive'],
                showProperties: ['id', 'email', 'name', 'role', 'isActive', 'lastLoginAt', 'createdAt', 'updatedAt'],
                editProperties: ['email', 'password', 'name', 'role', 'isActive']
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

// Конфигурация аутентификации с проверкой в базе данных
const authenticate = async (email, password) => {
    try {
        // Ищем админа в базе данных
        const admin = await Admin.findOne({
            where: {
                email: email,
                isActive: true
            }
        });

        if (!admin) {
            return null;
        }

        // Проверяем пароль
        const isValidPassword = await admin.checkPassword(password);
        if (!isValidPassword) {
            return null;
        }

        // Обновляем время последнего входа
        admin.lastLoginAt = new Date();
        await admin.save();

        return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role
        };

    } catch (error) {
        console.error('Ошибка аутентификации админа:', error);
        return null;
    }
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

export { adminJs, adminRouter };