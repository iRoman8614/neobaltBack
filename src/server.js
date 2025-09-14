require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const session = require('express-session');

// Import models and admin configuration
const { sequelize } = require('./models');
const { adminRouter } = require('./config/admin');
const apiRoutes = require('./routes');
const { handleValidationErrors, requestLogger, securityHeaders } = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy для корректной работы за reverse proxy (nginx, cloudflare, etc.)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Отключаем CSP для AdminJS
    hsts: process.env.NODE_ENV === 'production'
}));
app.use(securityHeaders);

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com', 'https://www.yourdomain.com']
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration для AdminJS
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 часа
    }
}));

// AdminJS routes
app.use('/admin', adminRouter);

// API routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Confectionery Catalog API',
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        endpoints: {
            admin: '/admin',
            api: '/api',
            health: '/api/health'
        }
    });
});

// 404 handler
app.all('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.originalUrl
    });
});

// Error handling middleware
app.use(handleValidationErrors);

// Global error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);

    res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера',
        ...(process.env.NODE_ENV === 'development' && {
            error: error.message,
            stack: error.stack
        })
    });
});

// Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown(signal) {
    console.log(`Получен сигнал ${signal}. Начинаем graceful shutdown...`);

    server.close((err) => {
        if (err) {
            console.error('Ошибка при закрытии сервера:', err);
            process.exit(1);
        }

        // Закрываем соединение с базой данных
        sequelize.close().then(() => {
            console.log('Соединения с базой данных закрыты');
            process.exit(0);
        }).catch((err) => {
            console.error('Ошибка при закрытии соединения с БД:', err);
            process.exit(1);
        });
    });
}

// Start server
async function startServer() {
    try {
        // Проверяем соединение с базой данных
        await sequelize.authenticate();
        console.log('✅ Соединение с базой данных установлено');

        // Запускаем сервер
        const server = app.listen(PORT, () => {
            console.log(`🚀 Сервер запущен на порту ${PORT}`);
            console.log(`🔧 Режим: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📝 AdminJS доступен по адресу: http://localhost:${PORT}/admin`);
            console.log(`🌐 API доступно по адресу: http://localhost:${PORT}/api`);
        });

        // Сохраняем ссылку на сервер для graceful shutdown
        global.server = server;

    } catch (error) {
        console.error('❌ Ошибка при запуске сервера:', error);
        process.exit(1);
    }
}

// Проверяем настройки перед запуском
if (!process.env.SESSION_SECRET) {
    console.warn('⚠️  SESSION_SECRET не установлен в переменных окружения');
}

if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    console.error('❌ Не все настройки базы данных установлены');
    console.error('Убедитесь, что установлены: DB_NAME, DB_USER, DB_PASSWORD');
    process.exit(1);
}

startServer();