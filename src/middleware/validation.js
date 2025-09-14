/**
 * Middleware для обработки ошибок валидации Sequelize
 */
exports.handleValidationErrors = (error, req, res, next) => {
    if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => ({
            field: err.path,
            message: err.message,
            value: err.value
        }));

        return res.status(400).json({
            success: false,
            message: 'Ошибка валидации данных',
            errors: validationErrors
        });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
        const uniqueErrors = error.errors.map(err => ({
            field: err.path,
            message: `Значение '${err.value}' уже существует`,
            value: err.value
        }));

        return res.status(409).json({
            success: false,
            message: 'Конфликт уникальности данных',
            errors: uniqueErrors
        });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            success: false,
            message: 'Ошибка связи с внешней таблицей',
            error: 'Указанный ID не существует в связанной таблице'
        });
    }

    next(error);
};

/**
 * Middleware для логирования запросов в development режиме
 */
exports.requestLogger = (req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, {
            query: req.query,
            body: Object.keys(req.body).length ? req.body : undefined
        });
    }
    next();
};

/**
 * Middleware для установки заголовков безопасности
 */
exports.securityHeaders = (req, res, next) => {
    // Предотвращение XSS атак
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Предотвращение утечки реферера
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    next();
};