# Orders & Cart Setup Guide

## 🛒 Overview

This guide explains how to set up the shopping cart, checkout, and order management system.

## 🗄️ Appwrite Database Collections

### 1. Create Orders Collection

1. Go to your Appwrite Console
2. Navigate to **Databases** → Your database (`retro_store_db`)
3. Click **Create collection**
4. Name it: `orders`
5. Copy the Collection ID to your `.env` file as `VITE_APPWRITE_ORDERS_COLLECTION_ID`

#### Orders Collection Attributes

Add these attributes:

| Attribute | Type | Size | Required | Default |
|-----------|------|------|----------|---------|
| userId | String | 50 | Yes | - |
| userEmail | String | 255 | Yes | - |
| userName | String | 255 | Yes | - |
| status | String | 20 | Yes | pending |
| totalAmount | Float | - | Yes | - |
| shippingAddress | String | 500 | Yes | - |
| shippingCity | String | 100 | Yes | - |
| shippingZip | String | 20 | Yes | - |
| shippingCountry | String | 100 | Yes | - |
| paymentMethod | String | 50 | Yes | - |

#### Orders Collection Indexes

Create an index for faster queries:
- **Key**: `userId`
- **Type**: Key
- **Attributes**: `userId`
- **Order**: ASC

#### Orders Collection Permissions

Set permissions:
- **Read**: `users` (authenticated users can read their own)
- **Create**: `users`
- **Update**: `users` (for admin to update status)
- **Delete**: No (orders should not be deleted)

**Document Security** (recommended):
```
Read: user:{userId}
Update: role:admin
```

### 2. Create Order Items Collection

1. Click **Create collection** in your database
2. Name it: `order_items`
3. Copy the Collection ID to your `.env` file as `VITE_APPWRITE_ORDER_ITEMS_COLLECTION_ID`

#### Order Items Collection Attributes

| Attribute | Type | Size | Required | Default |
|-----------|------|------|----------|---------|
| orderId | String | 50 | Yes | - |
| productId | String | 50 | Yes | - |
| productName | String | 255 | Yes | - |
| productImage | String | 500 | Yes | - |
| price | Float | - | Yes | - |
| quantity | Integer | - | Yes | - |

#### Order Items Collection Indexes

Create an index:
- **Key**: `orderId`
- **Type**: Key
- **Attributes**: `orderId`
- **Order**: ASC

#### Order Items Collection Permissions

- **Read**: `users`
- **Create**: `users`
- **Update**: No
- **Delete**: No

## 📧 Email Receipts Setup (Optional)

To send email receipts to customers, you need to create an Appwrite Function.

### Option 1: Using Resend

1. Create an account at [Resend](https://resend.com)
2. Get your API key
3. Create an Appwrite Function:

#### Function Code (Node.js)

Create a new function called `send-receipt`:

```javascript
// src/main.js
const { Resend } = require('resend');

module.exports = async ({ req, res, log }) => {
    const { orderId, orderData, receiptHTML } = JSON.parse(req.body);
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
        await resend.emails.send({
            from: 'RETROSTORE <orders@yourdomain.com>',
            to: orderData.userEmail,
            subject: `Order Confirmation #${orderId.slice(-8).toUpperCase()}`,
            html: receiptHTML
        });
        
        log('Email sent successfully');
        return res.json({ success: true });
    } catch (error) {
        log('Error sending email: ' + error.message);
        return res.json({ success: false, error: error.message });
    }
};
```

#### package.json

```json
{
    "name": "send-receipt",
    "version": "1.0.0",
    "main": "src/main.js",
    "dependencies": {
        "resend": "^2.0.0"
    }
}
```

4. Set environment variable in function settings:
   - `RESEND_API_KEY`: Your Resend API key

5. Update the `sendEmailReceipt` function in `src/lib/orders.ts`:

```typescript
async sendEmailReceipt(orderId: string): Promise<void> {
    const functions = new Functions(client);
    const order = await this.getOrder(orderId);
    const receiptHTML = this.generateReceiptHTML(order);
    
    await functions.createExecution(
        'send-receipt',
        JSON.stringify({
            orderId,
            orderData: order,
            receiptHTML
        })
    );
}
```

### Option 2: Using SendGrid

Similar setup, but use SendGrid's API:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ... send email using sgMail.send()
```

## 🔒 Environment Variables

Add these to your `.env` file:

```env
# Orders Collections
VITE_APPWRITE_ORDERS_COLLECTION_ID=orders
VITE_APPWRITE_ORDER_ITEMS_COLLECTION_ID=order_items

# Optional: Email Service
# (These are for Appwrite Functions, not frontend)
RESEND_API_KEY=your_resend_api_key
```

## 🛍️ Features Summary

### Shopping Cart
- ✅ Add products to cart
- ✅ Update quantities
- ✅ Remove items
- ✅ Persistent cart (localStorage)
- ✅ Cart sidebar/sheet
- ✅ Full cart page

### Checkout
- ✅ Shipping information form
- ✅ Multiple payment methods (UI only)
- ✅ Order summary
- ✅ Order confirmation

### User Profile
- ✅ View profile information
- ✅ Edit name
- ✅ View recent orders
- ✅ Quick actions

### Order History
- ✅ View all orders
- ✅ Expandable order details
- ✅ Order status tracking
- ✅ View receipts
- ✅ Download receipts as HTML
- ✅ Order progress visualization

### Receipts
- ✅ Professional HTML receipt template
- ✅ View in-app
- ✅ Download as file
- ✅ Email delivery (with Function setup)

## 📱 Pages & Routes

| Route | Description |
|-------|-------------|
| `/cart` | Full shopping cart page |
| `/checkout` | Checkout process |
| `/profile` | User profile page |
| `/orders` | Order history |

## 🎨 UI Components Created

- `CartSheet.tsx` - Sliding cart panel
- `sheet.tsx` - Radix UI Sheet component
- `collapsible.tsx` - Radix UI Collapsible component

## 🚀 Quick Start

1. Create the database collections as described above
2. Update your `.env` file with collection IDs
3. Run the development server
4. Add products to cart
5. Proceed to checkout
6. View orders in profile

## ⚠️ Important Notes

1. **Payment Integration**: The current implementation doesn't process real payments. For production, integrate with Stripe, PayPal, or another payment processor.

2. **Email Function**: Email sending requires setting up an Appwrite Function. Without it, emails won't be sent but orders will still be created.

3. **Stock Management**: Currently, stock isn't automatically decremented on purchase. Add this in `orderService.createOrder()` if needed.

4. **Security**: For production, add proper document-level security rules in Appwrite.
