# Admin Panel Setup Guide

## 🛠️ Appwrite Configuration

### 1. Create Database
1. Go to your Appwrite Console: https://fra.cloud.appwrite.io/console
2. Navigate to **Databases** → **Create Database**
3. Name it: `retro_store_db`
4. Copy the Database ID and update `.env` file

### 2. Create Products Table
1. In your database, click **Create table**
2. Name it: `products`
3. Set permissions:
   - **Read Access**: `Any`
   - **Create/Update/Delete**: `Users` (authenticated users can manage via code)

### 3. Add Table Attributes
Add the following attributes to the `products` table:

| Attribute | Type | Size | Required | Default |
|-----------|------|------|----------|---------|
| name | String | 255 | Yes | - |
| description | String | 1000 | Yes | - |
| price | Float | - | Yes | - |
| oldPrice | Float | - | No | - |
| category | String | 100 | Yes | - |
| image | String | 500 | Yes | - |
| stock | Integer | - | Yes | 0 |
| featured | Boolean | - | Yes | false |
| rating | Float | - | No | 4.5 |

### 4. Create Storage Bucket
1. Navigate to **Storage** → **Create Bucket**
2. Name it: `product_images`
3. Set permissions:
   - **Read**: `Role: All`
   - **Create**: `Role: Users` (logged in users)
4. File size limit: `10MB` (recommended)
5. Allowed extensions: `jpg, jpeg, png, gif, webp`

### 5. Update Admin Email
Open `src/lib/admin.ts` and add your email:

```typescript
const ADMIN_EMAILS = ['your-email@example.com']
```

## 🔐 Admin Access

Once configured:
1. Register with your admin email
2. Login to the site
3. Click on your profile icon in header
4. You'll see "Admin Panel" option
5. Access at: `/admin`

## 📝 Features

### Product Management
- ✅ Add new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ Upload product images
- ✅ Set featured products
- ✅ Manage stock and pricing

### Security
- ✅ Only admin emails can access
- ✅ Protected routes
- ✅ Secure database operations

## 🚀 Usage

### Adding a Product
1. Go to `/admin`
2. Click "Add Product"
3. Fill in the form:
   - Product name
   - Description
   - Price (and optional old price for discount)
   - Category
   - Stock quantity
   - Upload image or paste URL
   - Mark as featured (optional)
4. Click "Create"

### Editing a Product
1. Find the product in the table
2. Click the pencil icon
3. Update the fields
4. Click "Update"

### Deleting a Product
1. Find the product in the table
2. Click the trash icon
3. Confirm deletion

## 🎯 Categories

Current categories:
- Retro Consoles
- Modern Consoles
- Handhelds
- Accessories
- Limited Edition
- Mobile Gaming

To add more categories, edit `src/components/ProductFormDialog.tsx` and update the `CATEGORIES` array.

## 🔗 API Reference

All product operations are in `src/lib/products.ts`:
- `getProducts()` - Get all products
- `getFeaturedProducts()` - Get featured products
- `createProduct()` - Add new product
- `updateProduct()` - Update product
- `deleteProduct()` - Delete product
- `uploadImage()` - Upload product image
