import db from '../models/index.js';
import { Op } from 'sequelize';
import Joi from 'joi';

const { Product, Category, Manufacturer } = db;

// Схема валидации для получения списка товаров
const getProductsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    categoryId: Joi.number().integer().min(1),
    manufacturerId: Joi.number().integer().min(1),
    search: Joi.string().trim().max(255),
    sortBy: Joi.string().valid('name', 'createdAt', 'updatedAt', 'sortOrder').default('sortOrder'),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC')
});

// Схема валидации для получения товара по ID
const getProductByIdSchema = Joi.object({
    id: Joi.number().integer().min(1).required()
});

/**
 * Получение списка товаров с фильтрацией и пагинацией
 * GET /api/products
 */
export const getProducts = async (req, res) => {
    try {
        // Валидация параметров запроса
        const { error, value: validatedQuery } = getProductsSchema.validate(req.query);

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Ошибка валидации параметров',
                errors: error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }))
            });
        }

        const {
            page,
            limit,
            categoryId,
            manufacturerId,
            search,
            sortBy,
            sortOrder
        } = validatedQuery;

        // Построение условий фильтрации
        const whereConditions = {
            isActive: true
        };

        // Фильтр по категории
        if (categoryId) {
            whereConditions.categoryId = categoryId;
        }

        // Фильтр по производителю
        if (manufacturerId) {
            whereConditions.manufacturerId = manufacturerId;
        }

        // Поиск по названию товара
        if (search) {
            whereConditions.name = {
                [Op.iLike]: `%${search}%`
            };
        }

        // Вычисление offset для пагинации
        const offset = (page - 1) * limit;

        // Определение сортировки
        const orderClause = [[sortBy, sortOrder]];

        // Если сортировка не по sortOrder, добавляем её как вторичную
        if (sortBy !== 'sortOrder') {
            orderClause.push(['sortOrder', 'ASC']);
        }

        // Добавляем ID как финальную сортировку для стабильности
        orderClause.push(['id', 'ASC']);

        // Запрос к базе данных
        const { rows: products, count: totalCount } = await Product.findAndCountAll({
            where: whereConditions,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: Manufacturer,
                    as: 'manufacturer',
                    attributes: ['id', 'name', 'country']
                }
            ],
            limit,
            offset,
            order: orderClause,
            distinct: true // Важно для корректного подсчета с JOIN
        });

        // Вычисление метаданных пагинации
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        // Формирование ответа
        const response = {
            success: true,
            data: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    limit,
                    hasNextPage,
                    hasPrevPage,
                    nextPage: hasNextPage ? page + 1 : null,
                    prevPage: hasPrevPage ? page - 1 : null
                },
                filters: {
                    categoryId: categoryId || null,
                    manufacturerId: manufacturerId || null,
                    search: search || null,
                    sortBy,
                    sortOrder
                }
            }
        };

        res.json(response);

    } catch (error) {
        console.error('Ошибка при получении списка товаров:', error);

        res.status(500).json({
            success: false,
            message: 'Внутренняя ошибка сервера',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
};

/**
 * Получение товара по ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
    try {
        // Валидация параметра ID
        const { error, value: validatedParams } = getProductByIdSchema.validate(req.params);

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Некорректный ID товара',
                errors: error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }))
            });
        }

        const { id } = validatedParams;

        // Поиск товара в базе данных
        const product = await Product.findOne({
            where: {
                id,
                isActive: true
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: Manufacturer,
                    as: 'manufacturer',
                    attributes: ['id', 'name', 'country', 'website', 'description']
                }
            ]
        });

        // Проверка существования товара
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Товар не найден или неактивен'
            });
        }

        // Формирование ответа
        const response = {
            success: true,
            data: {
                product
            }
        };

        res.json(response);

    } catch (error) {
        console.error('Ошибка при получении товара по ID:', error);

        res.status(500).json({
            success: false,
            message: 'Внутренняя ошибка сервера',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
};