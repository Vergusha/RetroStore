import { Databases, ID, Query } from 'appwrite'
import { client, account } from './appwrite'
import { DATABASE_ID } from './products'
import type { Product } from './products'

export const databases = new Databases(client)

// Collection IDs
export const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID || 'orders'
export const ORDER_ITEMS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDER_ITEMS_COLLECTION_ID || 'order_items'

// Order statuses
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
    $id?: string
    orderId: string
    productId: string
    productName: string
    productImage: string
    price: number
    quantity: number
    $createdAt?: string
}

export interface Order {
    $id?: string
    userId: string
    userEmail: string
    userName: string
    status: OrderStatus
    totalAmount: number
    shippingAddress: string
    shippingCity: string
    shippingZip: string
    shippingCountry: string
    paymentMethod: string
    items?: OrderItem[]
    $createdAt?: string
    $updatedAt?: string
}

export interface CartItem {
    product: Product
    quantity: number
}

export const orderService = {
    // Create new order
    async createOrder(
        cartItems: CartItem[],
        shippingInfo: {
            address: string
            city: string
            zip: string
            country: string
        },
        paymentMethod: string
    ): Promise<Order> {
        try {
            // Get current user
            const user = await account.get()

            // Calculate total
            const totalAmount = cartItems.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
            )

            // Create order
            const order = await databases.createDocument(
                DATABASE_ID,
                ORDERS_COLLECTION_ID,
                ID.unique(),
                {
                    userId: user.$id,
                    userEmail: user.email,
                    userName: user.name,
                    status: 'pending' as OrderStatus,
                    totalAmount,
                    shippingAddress: shippingInfo.address,
                    shippingCity: shippingInfo.city,
                    shippingZip: shippingInfo.zip,
                    shippingCountry: shippingInfo.country,
                    paymentMethod
                }
            )

            // Create order items
            const orderItems: OrderItem[] = []
            for (const item of cartItems) {
                const orderItem = await databases.createDocument(
                    DATABASE_ID,
                    ORDER_ITEMS_COLLECTION_ID,
                    ID.unique(),
                    {
                        orderId: order.$id,
                        productId: item.product.$id,
                        productName: item.product.name,
                        productImage: item.product.image,
                        price: item.product.price,
                        quantity: item.quantity
                    }
                )
                orderItems.push(orderItem as unknown as OrderItem)
            }

            // Send email receipt (using Appwrite Functions - you'll need to set this up)
            try {
                await this.sendEmailReceipt(order.$id)
            } catch (emailError) {
                console.error('Failed to send email receipt:', emailError)
                // Don't fail the order if email fails
            }

            return { ...order, items: orderItems } as unknown as Order
        } catch (error) {
            console.error('Error creating order:', error)
            throw error
        }
    },

    // Get user's orders
    async getUserOrders(): Promise<Order[]> {
        try {
            const user = await account.get()

            const response = await databases.listDocuments(
                DATABASE_ID,
                ORDERS_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id),
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]
            )

            // Get items for each order
            const ordersWithItems = await Promise.all(
                response.documents.map(async (order) => {
                    const items = await this.getOrderItems(order.$id)
                    return { ...order, items } as unknown as Order
                })
            )

            return ordersWithItems
        } catch (error) {
            console.error('Error fetching user orders:', error)
            throw error
        }
    },

    // Get single order
    async getOrder(orderId: string): Promise<Order> {
        try {
            const order = await databases.getDocument(
                DATABASE_ID,
                ORDERS_COLLECTION_ID,
                orderId
            )

            const items = await this.getOrderItems(orderId)
            return { ...order, items } as unknown as Order
        } catch (error) {
            console.error('Error fetching order:', error)
            throw error
        }
    },

    // Get order items
    async getOrderItems(orderId: string): Promise<OrderItem[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                ORDER_ITEMS_COLLECTION_ID,
                [Query.equal('orderId', orderId)]
            )
            return response.documents as unknown as OrderItem[]
        } catch (error) {
            console.error('Error fetching order items:', error)
            throw error
        }
    },

    // Update order status (admin only)
    async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
        try {
            const order = await databases.updateDocument(
                DATABASE_ID,
                ORDERS_COLLECTION_ID,
                orderId,
                { status }
            )
            return order as unknown as Order
        } catch (error) {
            console.error('Error updating order status:', error)
            throw error
        }
    },

    // Send email receipt
    async sendEmailReceipt(orderId: string): Promise<void> {
        // This would typically call an Appwrite Function that sends emails
        // For now, we'll just log it
        console.log(`Email receipt would be sent for order: ${orderId}`)

        // In a real implementation, you would:
        // 1. Create an Appwrite Function that uses an email service (SendGrid, Resend, etc.)
        // 2. Call it here using the Functions API
        // Example:
        // const functions = new Functions(client)
        // await functions.createExecution('send-receipt', JSON.stringify({ orderId }))
    },

    // Get all orders (admin only)
    async getAllOrders(): Promise<Order[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                ORDERS_COLLECTION_ID,
                [Query.orderDesc('$createdAt'), Query.limit(100)]
            )

            const ordersWithItems = await Promise.all(
                response.documents.map(async (order) => {
                    const items = await this.getOrderItems(order.$id)
                    return { ...order, items } as unknown as Order
                })
            )

            return ordersWithItems
        } catch (error) {
            console.error('Error fetching all orders:', error)
            throw error
        }
    },

    // Generate receipt HTML
    generateReceiptHTML(order: Order): string {
        const itemsHTML = order.items?.map(item => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <img src="${item.productImage}" alt="${item.productName}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.productName}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('') || ''

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Receipt - RETROSTORE</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background-color: white; border-radius: 8px; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #7c3aed; margin: 0;">🎮 RETROSTORE</h1>
            <p style="color: #666; margin-top: 8px;">Order Confirmation</p>
        </div>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
            <p style="color: #16a34a; font-weight: 600; margin: 0;">✓ Thank you for your order!</p>
        </div>

        <div style="margin-bottom: 24px;">
            <h2 style="font-size: 16px; color: #333; margin-bottom: 12px;">Order Details</h2>
            <p style="margin: 4px 0; color: #666;"><strong>Order ID:</strong> ${order.$id}</p>
            <p style="margin: 4px 0; color: #666;"><strong>Date:</strong> ${new Date(order.$createdAt || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <p style="margin: 4px 0; color: #666;"><strong>Status:</strong> <span style="color: #f59e0b; font-weight: 600;">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></p>
        </div>

        <div style="margin-bottom: 24px;">
            <h2 style="font-size: 16px; color: #333; margin-bottom: 12px;">Shipping Address</h2>
            <p style="margin: 4px 0; color: #666;">${order.userName}</p>
            <p style="margin: 4px 0; color: #666;">${order.shippingAddress}</p>
            <p style="margin: 4px 0; color: #666;">${order.shippingCity}, ${order.shippingZip}</p>
            <p style="margin: 4px 0; color: #666;">${order.shippingCountry}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
                <tr style="background-color: #f8fafc;">
                    <th style="padding: 12px; text-align: left; font-weight: 600; color: #333;">Image</th>
                    <th style="padding: 12px; text-align: left; font-weight: 600; color: #333;">Product</th>
                    <th style="padding: 12px; text-align: center; font-weight: 600; color: #333;">Qty</th>
                    <th style="padding: 12px; text-align: right; font-weight: 600; color: #333;">Price</th>
                    <th style="padding: 12px; text-align: right; font-weight: 600; color: #333;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" style="padding: 16px; text-align: right; font-weight: 600; font-size: 18px;">Total:</td>
                    <td style="padding: 16px; text-align: right; font-weight: 700; font-size: 18px; color: #7c3aed;">$${order.totalAmount.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>

        <div style="margin-bottom: 24px;">
            <h2 style="font-size: 16px; color: #333; margin-bottom: 12px;">Payment Method</h2>
            <p style="margin: 4px 0; color: #666;">${order.paymentMethod}</p>
        </div>

        <div style="text-align: center; padding-top: 24px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">Thank you for shopping with us!</p>
            <p style="color: #999; font-size: 12px;">If you have any questions, please contact support@retrostore.com</p>
        </div>
    </div>
</body>
</html>
        `
    }
}
