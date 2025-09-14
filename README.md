# Каталог кондитерских изделий - Backend

Backend для каталога кондитерских изделий на Node.js + Express.js + AdminJS + PostgreSQL.

## Технологический стек

- **Runtime**: Node.js ≥18
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Admin Panel**: AdminJS
- **Validation**: Joi
- **Security**: Helmet, CORS

## Структура проекта

```
├── config/
│   └── database.js          # Конфигурация БД для разных сред
├── database/
│   ├── migrations/          # Миграции базы данных
│   │   ├── 001-create-categories.js
│   │   ├── 002-create-manufacturers.js
│   │   └── 003-create-products.js
│   └── seeders/             # Начальные данные
│       ├── 001-categories.js
│       └── 002-manufacturers.js
├── src/
│   ├── config/
│   │   └── admin.js         # Конфигурация AdminJS
│   ├── controllers/
│   │   └── productsController.js
│   ├── middleware/
│   │   └── validation.js    # Middleware для валидации и безопасности
│   ├── models/
│   │   ├── index.js
│   │   ├── Category.js
│   │   ├── Manufacturer.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── index.js
│   │   └── products.js
│   └── server.js            # Главный файл сервера
├── .env.example             # Пример переменных окружения
├── .sequelizerc             # Конфигурация Sequelize CLI
├── package.json
└── README.md
```

## База данных

### Структура таблиц

#### Categories (Категории)
- `id` - Primary Key
- `name` - Название категории (уникальное)
- `createdAt`, `updatedAt` - Временные метки

#### Manufacturers (Производители)
- `id` - Primary Key
- `name` - Название производителя (уникальное)
- `country` - Страна
- `website` - Веб-сайт
- `description` - Описание
- `createdAt`, `updatedAt` - Временные метки

#### Products (Товары)
- `id` - Primary Key
- `name` - Название товара
- `description` - Описание товара
- `previewImage` - URL превью изображения для каталога
- `image1`, `image2`, `image3`, `image4` - URLs дополнительных изображений
- `categoryId` - Foreign Key на Categories
- `manufacturerId` - Foreign Key на Manufacturers
- `isActive` - Активность товара (boolean)
- `sortOrder` - Порядок сортировки
- `createdAt`, `updatedAt` - Временные метки

## Установка и запуск

### 1. Клонирование и установка зависимостей

```bash
git clone <repository-url>
cd confectionery-catalog-backend
npm install
```

### 2. Настройка переменных окружения

Скопируйте `.env.example` в `.env` и настройте значения:

```bash
cp .env.example .env
```

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=confectionery_catalog
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Session Secret
SESSION_SECRET=your_super_secret_key_here_min_32_chars

# AdminJS Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
```

### 3. Настройка базы данных

```bash
# Создание базы данных
npm run db:create

# Запуск миграций
npm run migrate

# Заполнение тестовыми данными (опционально)
npm run seed
```

### 4. Запуск приложения

```bash
# Production
npm start

# Development
npm run dev
```

## API Endpoints

### Публичные endpoints

#### GET /api/products
Получение списка товаров с фильтрацией и пагинацией

**Query Parameters:**
- `page` (number, default: 1) - Номер страницы
- `limit` (number, default: 20, max: 100) - Количество товаров на странице
- `categoryId` (number, optional) - ID категории для фильтрации
- `manufacturerId` (number, optional) - ID производителя для фильтрации
- `search` (string, optional) - Поиск по названию товара
- `sortBy` (string, default: 'sortOrder') - Поле для сортировки (name, createdAt, updatedAt, sortOrder)
- `sortOrder` (string, default: 'ASC') - Направление сортировки (ASC, DESC)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalCount": 200,
      "limit": 20,
      "hasNextPage": true,
      "hasPrevPage": false,
      "nextPage": 2,
      "prevPage": null
    },
    "filters": {
      "categoryId": null,
      "manufacturerId": null,
      "search": null,
      "sortBy": "sortOrder",
      "sortOrder": "ASC"
    }
  }
}
```

#### GET /api/products/:id
Получение товара по ID

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "name": "Торт Наполеон",
      "description": "Классический торт...",
      "previewImage": "https://example.com/preview.jpg",
      "images": ["https://example.com/1.jpg", "..."],
      "additionalImages": ["https://example.com/2.jpg", "..."],
      "category": {
        "id": 1,
        "name": "Торты"
      },
      "manufacturer": {
        "id": 1,
        "name": "Рот Фронт",
        "country": "Россия"
      },
      "isActive": true,
      "sortOrder": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Служебные endpoints

#### GET /api/health
Проверка работоспособности API

#### GET /api
Информация об API и доступных endpoints

## Админ-панель

AdminJS доступна по адресу: `/admin`

**Возможности:**
- Управление категориями
- Управление производителями
- Управление товарами
- Загрузка изображений через URL
- Фильтрация и поиск
- Активация/деактивация товаров
- Настройка порядка сортировки

**Аутентификация:**
Используйте данные из переменных окружения `ADMIN_EMAIL` и `ADMIN_PASSWORD`

## Безопасность

- Helmet.js для базовой безопасности
- CORS настроен для конкретных доменов в продакшене
- Валидация всех входящих данных
- Обработка SQL инъекций через Sequelize ORM
- Session-based аутентификация для админки
- Rate limiting (рекомендуется настроить на уровне reverse proxy)

## Производительность

- Индексы на часто используемые поля
- Connection pooling для БД
- Compression middleware
- Graceful shutdown
- Pagination для больших выборок
- Eager loading для связанных данных

## Миграции

```bash
# Применить все миграции
npm run migrate

# Откатить последнюю миграцию
npm run migrate:undo

# Создать новую миграцию
npx sequelize-cli migration:generate --name migration-name
```

## Логирование

- Morgan для HTTP логов
- Console логи для развития
- Structured логи в продакшене
- Логирование ошибок с stack trace в development

## Переменные окружения

| Переменная | Обязательная | Описание |
|-----------|-------------|-----------|
| PORT | Нет | Порт сервера (default: 3000) |
| NODE_ENV | Нет | Окружение (development/production) |
| DB_HOST | Да | Хост базы данных |
| DB_PORT | Нет | Порт БД (default: 5432) |
| DB_NAME | Да | Имя базы данных |
| DB_USER | Да | Пользователь БД |
| DB_PASSWORD | Да | Пароль БД |
| DB_SSL | Нет | Использовать SSL для БД (true/false) |
| SESSION_SECRET | Да | Секретный ключ для сессий |
| ADMIN_EMAIL | Да | Email админа |
| ADMIN_PASSWORD | Да | Пароль админа |

## Деплой в продакшн

### Docker (рекомендуется)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Настройки для продакшена

1. **Reverse Proxy (Nginx/Apache)**
    - Настройте SSL терминацию
    - Gzip компрессию
    - Rate limiting
    - Static file serving

2. **База данных**
    - Настройте connection pooling
    - Регулярные бэкапы
    - Мониторинг производительности

3. **Мониторинг**
    - PM2 для управления процессами
    - Логи в файлы/external service
    - Health checks
    - Metrics collection

## Разработка

### Добавление новых endpoints

1. Создайте контроллер в `src/controllers/`
2. Добавьте роуты в `src/routes/`
3. Подключите роуты в `src/routes/index.js`
4. Добавьте валидацию с помощью Joi

### Добавление новых моделей

1. Создайте миграцию: `npx sequelize-cli migration:generate --name create-model-name`
2. Создайте модель в `src/models/`
3. Настройте ассоциации в методе `associate`
4. Добавьте в AdminJS конфиг при необходимости

## Поддержка

При возникновении вопросов или проблем создайте issue в репозитории проекта.