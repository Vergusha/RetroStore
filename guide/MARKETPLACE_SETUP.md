# Настройка Appwrite для Marketplace функциональности

Данная документация описывает все необходимые шаги для настройки Appwrite для работы платформы б/у товаров (Marketplace).

## Содержание

1. [Переменные окружения](#переменные-окружения)
2. [Создание коллекций](#создание-коллекций)
3. [Настройка атрибутов](#настройка-атрибутов)
4. [Настройка индексов](#настройка-индексов)
5. [Настройка прав доступа](#настройка-прав-доступа)
6. [Настройка Storage](#настройка-storage)

---

## Переменные окружения

Добавьте следующие переменные в ваш `.env` файл:

```env
# Существующие переменные
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=retro_store_db
VITE_APPWRITE_PRODUCTS_COLLECTION_ID=products
VITE_APPWRITE_STORAGE_BUCKET_ID=product_images
VITE_APPWRITE_ORDERS_COLLECTION_ID=orders
VITE_APPWRITE_ORDER_ITEMS_COLLECTION_ID=order_items

# Новые переменные для Marketplace
VITE_APPWRITE_SELLER_REQUESTS_COLLECTION_ID=seller_requests
VITE_APPWRITE_SELLER_PROFILES_COLLECTION_ID=seller_profiles
VITE_APPWRITE_USED_PRODUCTS_COLLECTION_ID=used_products
VITE_APPWRITE_MARKETPLACE_ORDERS_COLLECTION_ID=marketplace_orders
VITE_APPWRITE_SELLER_REVIEWS_COLLECTION_ID=seller_reviews
VITE_APPWRITE_SELLER_TRANSACTIONS_COLLECTION_ID=seller_transactions

# Админы (emails через запятую)
VITE_ADMIN_EMAILS=admin@example.com,admin2@example.com
```

---

## Создание коллекций

В Appwrite Console перейдите в **Databases** → ваша база данных и создайте следующие коллекции:

### 1. Seller Requests (seller_requests)

Коллекция для хранения заявок на верификацию продавца.

**Атрибуты:**

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| userId | String | 36 | Yes | - | No |
| userEmail | String | 254 | Yes | - | No |
| userName | String | 128 | Yes | - | No |
| fullName | String | 256 | Yes | - | No |
| phone | String | 32 | Yes | - | No |
| address | String | 512 | Yes | - | No |
| city | String | 128 | Yes | - | No |
| country | String | 128 | Yes | - | No |
| idDocumentUrl | URL | 2048 | Yes | - | No |
| idDocumentType | Enum | - | Yes | - | No |
| reason | String | 2048 | Yes | - | No |
| status | Enum | - | Yes | pending | No |
| adminNote | String | 1024 | No | - | No |

**Enum значения:**
- `idDocumentType`: `passport`, `drivers_license`, `national_id`
- `status`: `pending`, `approved`, `rejected`

**Индексы:**
- `userId_index` - Key: userId (ASC) - для быстрого поиска по пользователю
- `status_index` - Key: status (ASC) - для фильтрации по статусу

---

### 2. Seller Profiles (seller_profiles)

Профили верифицированных продавцов.

**Атрибуты:**

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| userId | String | 36 | Yes | - | No |
| userEmail | String | 254 | Yes | - | No |
| userName | String | 128 | Yes | - | No |
| displayName | String | 256 | Yes | - | No |
| bio | String | 1024 | No | - | No |
| avatarUrl | URL | 2048 | No | - | No |
| phone | String | 32 | Yes | - | No |
| address | String | 512 | Yes | - | No |
| city | String | 128 | Yes | - | No |
| country | String | 128 | Yes | - | No |
| balance | Float | - | Yes | 0 | No |
| pendingBalance | Float | - | Yes | 0 | No |
| totalSales | Integer | - | Yes | 0 | No |
| totalEarnings | Float | - | Yes | 0 | No |
| rating | Float | - | Yes | 0 | No |
| reviewCount | Integer | - | Yes | 0 | No |
| isActive | Boolean | - | Yes | true | No |

**Индексы:**
- `userId_index` - Key: userId (ASC) - уникальный индекс
- `isActive_index` - Key: isActive (ASC)

---

### 3. Used Products (used_products)

Товары, выставленные продавцами на маркетплейсе.

**Атрибуты:**

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| sellerId | String | 36 | Yes | - | No |
| sellerName | String | 256 | Yes | - | No |
| sellerEmail | String | 254 | Yes | - | No |
| name | String | 256 | Yes | - | No |
| description | String | 4096 | Yes | - | No |
| condition | Enum | - | Yes | - | No |
| price | Float | - | Yes | - | No |
| category | String | 128 | Yes | - | No |
| images | String | 2048 | Yes | - | Yes (Array) |
| status | Enum | - | Yes | pending | No |
| adminNote | String | 1024 | No | - | No |
| viewCount | Integer | - | No | 0 | No |

**Enum значения:**
- `condition`: `new`, `like_new`, `good`, `fair`, `poor`
- `status`: `pending`, `approved`, `rejected`, `sold`

**Индексы:**
- `sellerId_index` - Key: sellerId (ASC)
- `status_index` - Key: status (ASC)
- `category_index` - Key: category (ASC)
- `status_createdAt_index` - Key: status (ASC), $createdAt (DESC) - для списка активных товаров

---

### 4. Marketplace Orders (marketplace_orders)

Заказы товаров с маркетплейса.

**Атрибуты:**

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| productId | String | 36 | Yes | - | No |
| productName | String | 256 | Yes | - | No |
| productImage | URL | 2048 | Yes | - | No |
| productPrice | Float | - | Yes | - | No |
| sellerId | String | 36 | Yes | - | No |
| sellerName | String | 256 | Yes | - | No |
| buyerId | String | 36 | Yes | - | No |
| buyerName | String | 128 | Yes | - | No |
| buyerEmail | String | 254 | Yes | - | No |
| shippingAddress | String | 512 | Yes | - | No |
| shippingCity | String | 128 | Yes | - | No |
| shippingZip | String | 20 | Yes | - | No |
| shippingCountry | String | 128 | Yes | - | No |
| status | Enum | - | Yes | pending | No |
| paymentMethod | String | 50 | Yes | - | No |
| paymentIntentId | String | 256 | No | - | No |
| trackingNumber | String | 128 | No | - | No |
| deliveryConfirmedAt | Datetime | - | No | - | No |
| disputeReason | String | 1024 | No | - | No |

**Enum значения:**
- `status`: `pending`, `paid`, `shipped`, `delivered`, `confirmed`, `disputed`, `refunded`

**Индексы:**
- `buyerId_index` - Key: buyerId (ASC)
- `sellerId_index` - Key: sellerId (ASC)
- `status_index` - Key: status (ASC)
- `productId_index` - Key: productId (ASC)

---

### 5. Seller Reviews (seller_reviews)

Отзывы о продавцах.

**Атрибуты:**

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| orderId | String | 36 | Yes | - | No |
| sellerId | String | 36 | Yes | - | No |
| buyerId | String | 36 | Yes | - | No |
| buyerName | String | 128 | Yes | - | No |
| rating | Integer | - | Yes | - | No |
| comment | String | 2048 | Yes | - | No |

**Индексы:**
- `sellerId_index` - Key: sellerId (ASC)
- `orderId_index` - Key: orderId (ASC)
- `buyerId_index` - Key: buyerId (ASC)

---

### 6. Seller Transactions (seller_transactions)

История транзакций продавцов.

**Атрибуты:**

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| sellerId | String | 36 | Yes | - | No |
| orderId | String | 36 | No | - | No |
| type | Enum | - | Yes | - | No |
| amount | Float | - | Yes | - | No |
| description | String | 512 | Yes | - | No |
| balanceBefore | Float | - | Yes | - | No |
| balanceAfter | Float | - | Yes | - | No |

**Enum значения:**
- `type`: `sale`, `withdrawal`, `refund`

**Индексы:**
- `sellerId_index` - Key: sellerId (ASC)
- `type_index` - Key: type (ASC)

---

## Настройка прав доступа (Permissions)

### Seller Requests

```
Read: Users (role:member)
Create: Users (role:member)
Update: Users (role:member) - только для своих записей
Delete: - (никто)
```

**Важно:** Для production рекомендуется использовать Document Security и устанавливать права на уровне документов.

### Seller Profiles

```
Read: Any (role:all) - профили публичные
Create: Users (role:member)
Update: Users (role:member) - только для своих записей
Delete: - (никто, только через API ключ)
```

### Used Products

```
Read: Any (role:all) - товары публичные
Create: Users (role:member)
Update: Users (role:member) - только для своих записей
Delete: Users (role:member) - только для своих записей
```

### Marketplace Orders

```
Read: Users (role:member)
Create: Users (role:member)
Update: Users (role:member)
Delete: - (никто)
```

### Seller Reviews

```
Read: Any (role:all) - отзывы публичные
Create: Users (role:member)
Update: - (никто, отзывы неизменяемы)
Delete: - (никто)
```

### Seller Transactions

```
Read: Users (role:member) - только свои
Create: Users (role:member)
Update: - (никто)
Delete: - (никто)
```

---

## Настройка Storage

### Product Images Bucket (product_images)

Убедитесь, что бакет настроен для хранения изображений:

**Permissions:**
```
Read: Any (role:all) - изображения публичные
Create: Users (role:member)
Update: Users (role:member)
Delete: Users (role:member)
```

**File Security:**
- Maximum file size: 5MB
- Allowed file extensions: jpg, jpeg, png, gif, webp, pdf
- Enabled: Antivirus scanning (если доступно)

---

## Рекомендации по безопасности

### 1. Document Security

Для production окружения включите **Document Security** на уровне коллекций и устанавливайте права при создании документов:

```typescript
// При создании документа
await databases.createDocument(
    DATABASE_ID,
    COLLECTION_ID,
    ID.unique(),
    data,
    [
        Permission.read(Role.any()),           // Все могут читать
        Permission.update(Role.user(userId)),  // Только владелец обновляет
        Permission.delete(Role.user(userId))   // Только владелец удаляет
    ]
)
```

### 2. Серверные функции (Appwrite Functions)

Для критических операций (обновление баланса, подтверждение платежей) рекомендуется создать серверные функции с API ключом:

```javascript
// Пример функции для обновления баланса
const { Client, Databases } = require('node-appwrite');

module.exports = async function(req, res) {
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    // Безопасное обновление баланса
    // ...
};
```

### 3. Валидация на стороне сервера

Создайте Appwrite Function для валидации:
- Проверка статуса продавца перед созданием товара
- Проверка доступности товара перед покупкой
- Валидация суммы при выводе средств

---

## Скрипт для быстрого создания структуры

Используйте Appwrite CLI для автоматического создания структуры:

```bash
# Установка Appwrite CLI
npm install -g appwrite-cli

# Логин
appwrite login

# Создание коллекций из конфигурации
appwrite deploy collection

# Или создание через SDK
node scripts/setup-collections.js
```

### Пример setup-collections.js

```javascript
const { Client, Databases, ID } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = 'retro_store_db';

async function createCollections() {
    // Создание seller_requests
    await databases.createCollection(
        DATABASE_ID,
        'seller_requests',
        'Seller Requests'
    );

    // Добавление атрибутов
    await databases.createStringAttribute(
        DATABASE_ID,
        'seller_requests',
        'userId',
        36,
        true
    );
    // ... остальные атрибуты

    console.log('Collections created successfully!');
}

createCollections().catch(console.error);
```

---

## Проверка работоспособности

После настройки проверьте:

1. ✅ Пользователь может подать заявку на статус продавца
2. ✅ Админ видит заявки в Admin Panel
3. ✅ После одобрения создается профиль продавца
4. ✅ Продавец может создавать товары
5. ✅ Товары появляются после одобрения админом
6. ✅ Покупатель может оформить заказ
7. ✅ После подтверждения получения баланс обновляется
8. ✅ Отзывы сохраняются и влияют на рейтинг

---

## Устранение неполадок

### Ошибка "Collection not found"
- Проверьте правильность ID коллекции в .env файле
- Убедитесь, что коллекция создана в нужной базе данных

### Ошибка "Permission denied"
- Проверьте настройки прав доступа коллекции
- Убедитесь, что пользователь авторизован

### Изображения не загружаются
- Проверьте права на бакет storage
- Убедитесь, что размер файла не превышает лимит

### Ошибка при создании атрибута
- Некоторые атрибуты требуют уникальных имен
- Проверьте типы данных
