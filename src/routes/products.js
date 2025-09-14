const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

/**
 * @route   GET /api/products
 * @desc    Получение списка товаров с фильтрацией и пагинацией
 * @params  page - номер страницы (по умолчанию 1)
 * @params  limit - количество товаров на странице (по умолчанию 20, максимум 100)
 * @params  categoryId - ID категории для фильтрации (опционально)
 * @params  manufacturerId - ID производителя для фильтрации (опционально)
 * @params  search - поиск по названию товара (опционально)
 * @params  sortBy - поле для сортировки (name, createdAt, updatedAt, sortOrder)
 * @params  sortOrder - направление сортировки (ASC, DESC)
 * @access  Public
 */
router.get('/', productsController.getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Получение товара по ID
 * @params  id - ID товара
 * @access  Public
 */
router.get('/:id', productsController.getProductById);

module.exports = router;