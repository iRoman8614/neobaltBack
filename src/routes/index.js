import express from 'express';
import productsRoutes from './products.js';

const router = express.Router();

// API routes
router.use('/products', productsRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API работает корректно',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// API info endpoint
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Confectionery Catalog API',
        version: '1.0.0',
        endpoints: {
            products: {
                list: 'GET /api/products',
                single: 'GET /api/products/:id'
            },
            health: 'GET /api/health'
        }
    });
});

export default router;