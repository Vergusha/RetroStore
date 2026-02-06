import { Databases, ID, Query } from 'appwrite'
import { client, account } from './appwrite'
import { DATABASE_ID, STORAGE_BUCKET_ID, storage } from './products'

export const databases = new Databases(client)

// Collection IDs
export const SELLER_REQUESTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SELLER_REQUESTS_COLLECTION_ID || 'seller_requests'
export const SELLER_PROFILES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SELLER_PROFILES_COLLECTION_ID || 'seller_profiles'
export const USED_PRODUCTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USED_PRODUCTS_COLLECTION_ID || 'used_products'
export const MARKETPLACE_ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_MARKETPLACE_ORDERS_COLLECTION_ID || 'marketplace_orders'
export const SELLER_REVIEWS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SELLER_REVIEWS_COLLECTION_ID || 'seller_reviews'
export const SELLER_TRANSACTIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SELLER_TRANSACTIONS_COLLECTION_ID || 'seller_transactions'

// Status types
export type SellerRequestStatus = 'pending' | 'approved' | 'rejected'
export type UsedProductStatus = 'pending' | 'approved' | 'rejected' | 'sold'
export type MarketplaceOrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'confirmed' | 'disputed' | 'refunded'
export type TransactionType = 'sale' | 'withdrawal' | 'refund'

// Interfaces
export interface SellerRequest {
    $id?: string
    userId: string
    userEmail: string
    userName: string
    fullName: string
    phone: string
    address: string
    city: string
    country: string
    idDocumentUrl: string
    idDocumentType: string
    reason: string
    status: SellerRequestStatus
    adminNote?: string
    $createdAt?: string
    $updatedAt?: string
}

export interface SellerProfile {
    $id?: string
    userId: string
    userEmail: string
    userName: string
    displayName: string
    bio?: string
    avatarUrl?: string
    phone: string
    address: string
    city: string
    country: string
    balance: number
    pendingBalance: number
    totalSales: number
    totalEarnings: number
    rating: number
    reviewCount: number
    isActive: boolean
    $createdAt?: string
    $updatedAt?: string
}

export interface UsedProduct {
    $id?: string
    sellerId: string
    sellerName: string
    sellerEmail: string
    name: string
    description: string
    condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
    price: number
    category: string
    images: string[]
    status: UsedProductStatus
    adminNote?: string
    viewCount?: number
    $createdAt?: string
    $updatedAt?: string
}

export interface MarketplaceOrder {
    $id?: string
    productId: string
    productName: string
    productImage: string
    productPrice: number
    sellerId: string
    sellerName: string
    buyerId: string
    buyerName: string
    buyerEmail: string
    shippingAddress: string
    shippingCity: string
    shippingZip: string
    shippingCountry: string
    status: MarketplaceOrderStatus
    paymentMethod: string
    paymentIntentId?: string
    trackingNumber?: string
    deliveryConfirmedAt?: string
    disputeReason?: string
    $createdAt?: string
    $updatedAt?: string
}

export interface SellerReview {
    $id?: string
    orderId: string
    sellerId: string
    buyerId: string
    buyerName: string
    rating: number
    comment: string
    $createdAt?: string
}

export interface SellerTransaction {
    $id?: string
    sellerId: string
    orderId?: string
    type: TransactionType
    amount: number
    description: string
    balanceBefore: number
    balanceAfter: number
    $createdAt?: string
}

// Seller Request Service
export const sellerRequestService = {
    // Submit seller verification request
    async submitRequest(data: {
        fullName: string
        phone: string
        address: string
        city: string
        country: string
        idDocumentFile: File
        idDocumentType: string
        reason: string
    }): Promise<SellerRequest> {
        try {
            const user = await account.get()

            // Check if user already has a pending request
            const existingRequest = await this.getUserRequest()
            if (existingRequest && existingRequest.status === 'pending') {
                throw new Error('You already have a pending seller request')
            }

            // Upload ID document
            const uploadedFile = await storage.createFile(
                STORAGE_BUCKET_ID,
                ID.unique(),
                data.idDocumentFile
            )
            const idDocumentUrl = storage.getFileView(STORAGE_BUCKET_ID, uploadedFile.$id).toString()

            // Create request
            const request = await databases.createDocument(
                DATABASE_ID,
                SELLER_REQUESTS_COLLECTION_ID,
                ID.unique(),
                {
                    userId: user.$id,
                    userEmail: user.email,
                    userName: user.name,
                    fullName: data.fullName,
                    phone: data.phone,
                    address: data.address,
                    city: data.city,
                    country: data.country,
                    idDocumentUrl,
                    idDocumentType: data.idDocumentType,
                    reason: data.reason,
                    status: 'pending' as SellerRequestStatus
                }
            )

            return request as unknown as SellerRequest
        } catch (error) {
            console.error('Error submitting seller request:', error)
            throw error
        }
    },

    // Get current user's seller request
    async getUserRequest(): Promise<SellerRequest | null> {
        try {
            const user = await account.get()
            const response = await databases.listDocuments(
                DATABASE_ID,
                SELLER_REQUESTS_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id),
                    Query.orderDesc('$createdAt'),
                    Query.limit(1)
                ]
            )
            return response.documents[0] as unknown as SellerRequest || null
        } catch (error) {
            console.error('Error getting user seller request:', error)
            return null
        }
    },

    // Get all pending requests (admin)
    async getPendingRequests(): Promise<SellerRequest[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                SELLER_REQUESTS_COLLECTION_ID,
                [
                    Query.equal('status', 'pending'),
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]
            )
            return response.documents as unknown as SellerRequest[]
        } catch (error) {
            console.error('Error getting pending requests:', error)
            throw error
        }
    },

    // Get all requests (admin)
    async getAllRequests(): Promise<SellerRequest[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                SELLER_REQUESTS_COLLECTION_ID,
                [
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]
            )
            return response.documents as unknown as SellerRequest[]
        } catch (error) {
            console.error('Error getting all requests:', error)
            throw error
        }
    },

    // Approve seller request (admin)
    async approveRequest(requestId: string, adminNote?: string): Promise<void> {
        try {
            const request = await databases.getDocument(
                DATABASE_ID,
                SELLER_REQUESTS_COLLECTION_ID,
                requestId
            ) as unknown as SellerRequest

            // Update request status
            await databases.updateDocument(
                DATABASE_ID,
                SELLER_REQUESTS_COLLECTION_ID,
                requestId,
                {
                    status: 'approved' as SellerRequestStatus,
                    adminNote: adminNote || 'Your seller request has been approved!'
                }
            )

            // Create seller profile
            await databases.createDocument(
                DATABASE_ID,
                SELLER_PROFILES_COLLECTION_ID,
                ID.unique(),
                {
                    userId: request.userId,
                    userEmail: request.userEmail,
                    userName: request.userName,
                    displayName: request.fullName,
                    phone: request.phone,
                    address: request.address,
                    city: request.city,
                    country: request.country,
                    balance: 0,
                    pendingBalance: 0,
                    totalSales: 0,
                    totalEarnings: 0,
                    rating: 0,
                    reviewCount: 0,
                    isActive: true
                }
            )
        } catch (error) {
            console.error('Error approving seller request:', error)
            throw error
        }
    },

    // Reject seller request (admin)
    async rejectRequest(requestId: string, adminNote: string): Promise<void> {
        try {
            await databases.updateDocument(
                DATABASE_ID,
                SELLER_REQUESTS_COLLECTION_ID,
                requestId,
                {
                    status: 'rejected' as SellerRequestStatus,
                    adminNote
                }
            )
        } catch (error) {
            console.error('Error rejecting seller request:', error)
            throw error
        }
    }
}

// Seller Profile Service
export const sellerProfileService = {
    // Get current user's seller profile
    async getMyProfile(): Promise<SellerProfile | null> {
        try {
            const user = await account.get()
            const response = await databases.listDocuments(
                DATABASE_ID,
                SELLER_PROFILES_COLLECTION_ID,
                [Query.equal('userId', user.$id)]
            )
            return response.documents[0] as unknown as SellerProfile || null
        } catch (error) {
            console.error('Error getting seller profile:', error)
            return null
        }
    },

    // Get seller profile by user ID
    async getProfileByUserId(userId: string): Promise<SellerProfile | null> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                SELLER_PROFILES_COLLECTION_ID,
                [Query.equal('userId', userId)]
            )
            return response.documents[0] as unknown as SellerProfile || null
        } catch (error) {
            console.error('Error getting seller profile:', error)
            return null
        }
    },

    // Get seller profile by ID
    async getProfile(profileId: string): Promise<SellerProfile | null> {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                SELLER_PROFILES_COLLECTION_ID,
                profileId
            )
            return response as unknown as SellerProfile
        } catch (error) {
            console.error('Error getting seller profile:', error)
            return null
        }
    },

    // Update seller profile
    async updateProfile(profileId: string, data: Partial<SellerProfile>): Promise<SellerProfile> {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                SELLER_PROFILES_COLLECTION_ID,
                profileId,
                data
            )
            return response as unknown as SellerProfile
        } catch (error) {
            console.error('Error updating seller profile:', error)
            throw error
        }
    },

    // Get all seller profiles (admin)
    async getAllProfiles(): Promise<SellerProfile[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                SELLER_PROFILES_COLLECTION_ID,
                [Query.orderDesc('$createdAt'), Query.limit(100)]
            )
            return response.documents as unknown as SellerProfile[]
        } catch (error) {
            console.error('Error getting seller profiles:', error)
            throw error
        }
    },

    // Check if current user is a seller
    async isSeller(): Promise<boolean> {
        try {
            const profile = await this.getMyProfile()
            return profile !== null && profile.isActive
        } catch {
            return false
        }
    }
}

// Used Products Service
export const usedProductService = {
    // Create a new used product listing
    async createProduct(data: {
        name: string
        description: string
        condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
        price: number
        category: string
        imageFiles: File[]
    }): Promise<UsedProduct> {
        try {
            const user = await account.get()
            const sellerProfile = await sellerProfileService.getMyProfile()

            if (!sellerProfile) {
                throw new Error('You need to be a verified seller to list products')
            }

            // Upload images
            const imageUrls: string[] = []
            for (const file of data.imageFiles) {
                const uploadedFile = await storage.createFile(
                    STORAGE_BUCKET_ID,
                    ID.unique(),
                    file
                )
                imageUrls.push(storage.getFileView(STORAGE_BUCKET_ID, uploadedFile.$id).toString())
            }

            // Create product
            const product = await databases.createDocument(
                DATABASE_ID,
                USED_PRODUCTS_COLLECTION_ID,
                ID.unique(),
                {
                    sellerId: user.$id,
                    sellerName: sellerProfile.displayName,
                    sellerEmail: user.email,
                    name: data.name,
                    description: data.description,
                    condition: data.condition,
                    price: data.price,
                    category: data.category,
                    images: imageUrls,
                    status: 'pending' as UsedProductStatus,
                    viewCount: 0
                }
            )

            return product as unknown as UsedProduct
        } catch (error) {
            console.error('Error creating used product:', error)
            throw error
        }
    },

    // Get all approved used products (marketplace)
    async getApprovedProducts(limit = 50): Promise<UsedProduct[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                USED_PRODUCTS_COLLECTION_ID,
                [
                    Query.equal('status', 'approved'),
                    Query.orderDesc('$createdAt'),
                    Query.limit(limit)
                ]
            )
            return response.documents as unknown as UsedProduct[]
        } catch (error) {
            console.error('Error getting approved products:', error)
            throw error
        }
    },

    // Get products by category
    async getProductsByCategory(category: string): Promise<UsedProduct[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                USED_PRODUCTS_COLLECTION_ID,
                [
                    Query.equal('status', 'approved'),
                    Query.equal('category', category),
                    Query.orderDesc('$createdAt'),
                    Query.limit(50)
                ]
            )
            return response.documents as unknown as UsedProduct[]
        } catch (error) {
            console.error('Error getting products by category:', error)
            throw error
        }
    },

    // Get seller's products
    async getMyProducts(): Promise<UsedProduct[]> {
        try {
            const user = await account.get()
            const response = await databases.listDocuments(
                DATABASE_ID,
                USED_PRODUCTS_COLLECTION_ID,
                [
                    Query.equal('sellerId', user.$id),
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]
            )
            return response.documents as unknown as UsedProduct[]
        } catch (error) {
            console.error('Error getting my products:', error)
            throw error
        }
    },

    // Get product by ID
    async getProduct(productId: string): Promise<UsedProduct | null> {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                USED_PRODUCTS_COLLECTION_ID,
                productId
            )
            return response as unknown as UsedProduct
        } catch (error) {
            console.error('Error getting used product:', error)
            return null
        }
    },

    // Update product
    async updateProduct(productId: string, data: Partial<UsedProduct>): Promise<UsedProduct> {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                USED_PRODUCTS_COLLECTION_ID,
                productId,
                data
            )
            return response as unknown as UsedProduct
        } catch (error) {
            console.error('Error updating used product:', error)
            throw error
        }
    },

    // Delete product
    async deleteProduct(productId: string): Promise<void> {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                USED_PRODUCTS_COLLECTION_ID,
                productId
            )
        } catch (error) {
            console.error('Error deleting used product:', error)
            throw error
        }
    },

    // Get pending products for approval (admin)
    async getPendingProducts(): Promise<UsedProduct[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                USED_PRODUCTS_COLLECTION_ID,
                [
                    Query.equal('status', 'pending'),
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]
            )
            return response.documents as unknown as UsedProduct[]
        } catch (error) {
            console.error('Error getting pending products:', error)
            throw error
        }
    },

    // Get all products (admin)
    async getAllProducts(): Promise<UsedProduct[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                USED_PRODUCTS_COLLECTION_ID,
                [
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]
            )
            return response.documents as unknown as UsedProduct[]
        } catch (error) {
            console.error('Error getting all products:', error)
            throw error
        }
    },

    // Approve product (admin)
    async approveProduct(productId: string): Promise<void> {
        try {
            await databases.updateDocument(
                DATABASE_ID,
                USED_PRODUCTS_COLLECTION_ID,
                productId,
                {
                    status: 'approved' as UsedProductStatus
                }
            )
        } catch (error) {
            console.error('Error approving product:', error)
            throw error
        }
    },

    // Reject product (admin)
    async rejectProduct(productId: string, adminNote: string): Promise<void> {
        try {
            await databases.updateDocument(
                DATABASE_ID,
                USED_PRODUCTS_COLLECTION_ID,
                productId,
                {
                    status: 'rejected' as UsedProductStatus,
                    adminNote
                }
            )
        } catch (error) {
            console.error('Error rejecting product:', error)
            throw error
        }
    },

    // Increment view count
    async incrementViewCount(productId: string): Promise<void> {
        try {
            const product = await this.getProduct(productId)
            if (product) {
                await databases.updateDocument(
                    DATABASE_ID,
                    USED_PRODUCTS_COLLECTION_ID,
                    productId,
                    {
                        viewCount: (product.viewCount || 0) + 1
                    }
                )
            }
        } catch (error) {
            console.error('Error incrementing view count:', error)
        }
    }
}

// Marketplace Order Service
export const marketplaceOrderService = {
    // Create marketplace order
    async createOrder(data: {
        productId: string
        shippingAddress: string
        shippingCity: string
        shippingZip: string
        shippingCountry: string
        paymentMethod: string
    }): Promise<MarketplaceOrder> {
        try {
            const user = await account.get()
            const product = await usedProductService.getProduct(data.productId)

            if (!product) {
                throw new Error('Product not found')
            }

            if (product.status !== 'approved') {
                throw new Error('Product is not available')
            }

            const order = await databases.createDocument(
                DATABASE_ID,
                MARKETPLACE_ORDERS_COLLECTION_ID,
                ID.unique(),
                {
                    productId: product.$id,
                    productName: product.name,
                    productImage: product.images[0],
                    productPrice: product.price,
                    sellerId: product.sellerId,
                    sellerName: product.sellerName,
                    buyerId: user.$id,
                    buyerName: user.name,
                    buyerEmail: user.email,
                    shippingAddress: data.shippingAddress,
                    shippingCity: data.shippingCity,
                    shippingZip: data.shippingZip,
                    shippingCountry: data.shippingCountry,
                    status: 'pending' as MarketplaceOrderStatus,
                    paymentMethod: data.paymentMethod
                }
            )

            // Mark product as sold
            await usedProductService.updateProduct(product.$id!, { status: 'sold' })

            return order as unknown as MarketplaceOrder
        } catch (error) {
            console.error('Error creating marketplace order:', error)
            throw error
        }
    },

    // Process payment (simulated)
    async processPayment(orderId: string, paymentIntentId: string): Promise<void> {
        try {
            const order = await databases.getDocument(
                DATABASE_ID,
                MARKETPLACE_ORDERS_COLLECTION_ID,
                orderId
            ) as unknown as MarketplaceOrder

            // Update order status to paid
            await databases.updateDocument(
                DATABASE_ID,
                MARKETPLACE_ORDERS_COLLECTION_ID,
                orderId,
                {
                    status: 'paid' as MarketplaceOrderStatus,
                    paymentIntentId
                }
            )

            // Add to seller's pending balance
            const sellerProfile = await sellerProfileService.getProfileByUserId(order.sellerId)
            if (sellerProfile && sellerProfile.$id) {
                await sellerProfileService.updateProfile(sellerProfile.$id, {
                    pendingBalance: sellerProfile.pendingBalance + order.productPrice
                })
            }
        } catch (error) {
            console.error('Error processing payment:', error)
            throw error
        }
    },

    // Update order status (seller can update to shipped)
    async updateOrderStatus(orderId: string, status: MarketplaceOrderStatus, trackingNumber?: string): Promise<void> {
        try {
            const updateData: any = { status }
            if (trackingNumber) {
                updateData.trackingNumber = trackingNumber
            }
            await databases.updateDocument(
                DATABASE_ID,
                MARKETPLACE_ORDERS_COLLECTION_ID,
                orderId,
                updateData
            )
        } catch (error) {
            console.error('Error updating order status:', error)
            throw error
        }
    },

    // Confirm delivery (buyer)
    async confirmDelivery(orderId: string): Promise<void> {
        try {
            const order = await databases.getDocument(
                DATABASE_ID,
                MARKETPLACE_ORDERS_COLLECTION_ID,
                orderId
            ) as unknown as MarketplaceOrder

            // Update order status
            await databases.updateDocument(
                DATABASE_ID,
                MARKETPLACE_ORDERS_COLLECTION_ID,
                orderId,
                {
                    status: 'confirmed' as MarketplaceOrderStatus,
                    deliveryConfirmedAt: new Date().toISOString()
                }
            )

            // Move pending balance to available balance
            const sellerProfile = await sellerProfileService.getProfileByUserId(order.sellerId)
            if (sellerProfile && sellerProfile.$id) {
                const newPendingBalance = sellerProfile.pendingBalance - order.productPrice
                const newBalance = sellerProfile.balance + order.productPrice
                const newTotalEarnings = sellerProfile.totalEarnings + order.productPrice
                const newTotalSales = sellerProfile.totalSales + 1

                await sellerProfileService.updateProfile(sellerProfile.$id, {
                    pendingBalance: newPendingBalance,
                    balance: newBalance,
                    totalEarnings: newTotalEarnings,
                    totalSales: newTotalSales
                })

                // Create transaction record
                await databases.createDocument(
                    DATABASE_ID,
                    SELLER_TRANSACTIONS_COLLECTION_ID,
                    ID.unique(),
                    {
                        sellerId: order.sellerId,
                        orderId: orderId,
                        type: 'sale' as TransactionType,
                        amount: order.productPrice,
                        description: `Sale: ${order.productName}`,
                        balanceBefore: sellerProfile.balance,
                        balanceAfter: newBalance
                    }
                )
            }
        } catch (error) {
            console.error('Error confirming delivery:', error)
            throw error
        }
    },

    // Get buyer's orders
    async getBuyerOrders(): Promise<MarketplaceOrder[]> {
        try {
            const user = await account.get()
            const response = await databases.listDocuments(
                DATABASE_ID,
                MARKETPLACE_ORDERS_COLLECTION_ID,
                [
                    Query.equal('buyerId', user.$id),
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]
            )
            return response.documents as unknown as MarketplaceOrder[]
        } catch (error) {
            console.error('Error getting buyer orders:', error)
            throw error
        }
    },

    // Get seller's orders
    async getSellerOrders(): Promise<MarketplaceOrder[]> {
        try {
            const user = await account.get()
            const response = await databases.listDocuments(
                DATABASE_ID,
                MARKETPLACE_ORDERS_COLLECTION_ID,
                [
                    Query.equal('sellerId', user.$id),
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]
            )
            return response.documents as unknown as MarketplaceOrder[]
        } catch (error) {
            console.error('Error getting seller orders:', error)
            throw error
        }
    },

    // Get order by ID
    async getOrder(orderId: string): Promise<MarketplaceOrder | null> {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                MARKETPLACE_ORDERS_COLLECTION_ID,
                orderId
            )
            return response as unknown as MarketplaceOrder
        } catch (error) {
            console.error('Error getting order:', error)
            return null
        }
    },

    // Get all orders (admin)
    async getAllOrders(): Promise<MarketplaceOrder[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                MARKETPLACE_ORDERS_COLLECTION_ID,
                [
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]
            )
            return response.documents as unknown as MarketplaceOrder[]
        } catch (error) {
            console.error('Error getting all orders:', error)
            throw error
        }
    },

    // Admin confirm delivery and release funds to seller
    async adminConfirmDelivery(orderId: string): Promise<void> {
        try {
            const order = await databases.getDocument(
                DATABASE_ID,
                MARKETPLACE_ORDERS_COLLECTION_ID,
                orderId
            ) as unknown as MarketplaceOrder

            // Update order status
            await databases.updateDocument(
                DATABASE_ID,
                MARKETPLACE_ORDERS_COLLECTION_ID,
                orderId,
                {
                    status: 'confirmed' as MarketplaceOrderStatus,
                    deliveryConfirmedAt: new Date().toISOString()
                }
            )

            // Move pending balance to available balance
            const sellerProfile = await sellerProfileService.getProfileByUserId(order.sellerId)
            if (sellerProfile && sellerProfile.$id) {
                const newPendingBalance = Math.max(0, sellerProfile.pendingBalance - order.productPrice)
                const newBalance = sellerProfile.balance + order.productPrice
                const newTotalEarnings = sellerProfile.totalEarnings + order.productPrice
                const newTotalSales = sellerProfile.totalSales + 1

                await sellerProfileService.updateProfile(sellerProfile.$id, {
                    pendingBalance: newPendingBalance,
                    balance: newBalance,
                    totalEarnings: newTotalEarnings,
                    totalSales: newTotalSales
                })

                // Create transaction record
                await databases.createDocument(
                    DATABASE_ID,
                    SELLER_TRANSACTIONS_COLLECTION_ID,
                    ID.unique(),
                    {
                        sellerId: order.sellerId,
                        orderId: orderId,
                        type: 'sale' as TransactionType,
                        amount: order.productPrice,
                        description: `Sale confirmed by admin: ${order.productName}`,
                        balanceBefore: sellerProfile.balance,
                        balanceAfter: newBalance
                    }
                )
            }
        } catch (error) {
            console.error('Error admin confirming delivery:', error)
            throw error
        }
    },

    // Admin update order status
    async adminUpdateOrderStatus(orderId: string, status: MarketplaceOrderStatus): Promise<void> {
        try {
            await databases.updateDocument(
                DATABASE_ID,
                MARKETPLACE_ORDERS_COLLECTION_ID,
                orderId,
                { status }
            )
        } catch (error) {
            console.error('Error updating order status:', error)
            throw error
        }
    }
}

// Extended review interface with product info
export interface SellerReviewWithProduct extends SellerReview {
    productName?: string
    productId?: string
    sellerName?: string
}

// Review Service
export const reviewService = {
    // Get all reviews (for admin)
    async getAllReviews(): Promise<SellerReviewWithProduct[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                SELLER_REVIEWS_COLLECTION_ID,
                [
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]
            )
            const reviews = response.documents as unknown as SellerReview[]

            // Enrich reviews with product info from orders
            const enrichedReviews: SellerReviewWithProduct[] = await Promise.all(
                reviews.map(async (review) => {
                    try {
                        const order = await databases.getDocument(
                            DATABASE_ID,
                            MARKETPLACE_ORDERS_COLLECTION_ID,
                            review.orderId
                        ) as unknown as MarketplaceOrder
                        return {
                            ...review,
                            productName: order.productName,
                            productId: order.productId,
                            sellerName: order.sellerName
                        }
                    } catch {
                        return {
                            ...review,
                            productName: 'Unknown Product',
                            productId: undefined,
                            sellerName: undefined
                        }
                    }
                })
            )

            return enrichedReviews
        } catch (error) {
            console.error('Error getting all reviews:', error)
            throw error
        }
    },

    // Create review
    async createReview(data: {
        orderId: string
        sellerId: string
        rating: number
        comment: string
    }): Promise<SellerReview> {
        try {
            const user = await account.get()

            const review = await databases.createDocument(
                DATABASE_ID,
                SELLER_REVIEWS_COLLECTION_ID,
                ID.unique(),
                {
                    orderId: data.orderId,
                    sellerId: data.sellerId,
                    buyerId: user.$id,
                    buyerName: user.name,
                    rating: data.rating,
                    comment: data.comment
                }
            )

            // Update seller's average rating
            await this.updateSellerRating(data.sellerId)

            return review as unknown as SellerReview
        } catch (error) {
            console.error('Error creating review:', error)
            throw error
        }
    },

    // Get seller reviews
    async getSellerReviews(sellerId: string): Promise<SellerReview[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                SELLER_REVIEWS_COLLECTION_ID,
                [
                    Query.equal('sellerId', sellerId),
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]
            )
            return response.documents as unknown as SellerReview[]
        } catch (error) {
            console.error('Error getting seller reviews:', error)
            throw error
        }
    },

    // Check if user has reviewed an order
    async hasReviewedOrder(orderId: string): Promise<boolean> {
        try {
            const user = await account.get()
            const response = await databases.listDocuments(
                DATABASE_ID,
                SELLER_REVIEWS_COLLECTION_ID,
                [
                    Query.equal('orderId', orderId),
                    Query.equal('buyerId', user.$id)
                ]
            )
            return response.documents.length > 0
        } catch (error) {
            console.error('Error checking review:', error)
            return false
        }
    },

    // Update seller's average rating
    async updateSellerRating(sellerId: string): Promise<void> {
        try {
            const reviews = await this.getSellerReviews(sellerId)
            if (reviews.length === 0) return

            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

            const sellerProfile = await sellerProfileService.getProfileByUserId(sellerId)
            if (sellerProfile && sellerProfile.$id) {
                await sellerProfileService.updateProfile(sellerProfile.$id, {
                    rating: Math.round(avgRating * 10) / 10,
                    reviewCount: reviews.length
                })
            }
        } catch (error) {
            console.error('Error updating seller rating:', error)
        }
    }
}

// Transaction Service
export const transactionService = {
    // Get seller transactions
    async getMyTransactions(): Promise<SellerTransaction[]> {
        try {
            const user = await account.get()
            const response = await databases.listDocuments(
                DATABASE_ID,
                SELLER_TRANSACTIONS_COLLECTION_ID,
                [
                    Query.equal('sellerId', user.$id),
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]
            )
            return response.documents as unknown as SellerTransaction[]
        } catch (error) {
            console.error('Error getting transactions:', error)
            throw error
        }
    },

    // Request withdrawal
    async requestWithdrawal(amount: number): Promise<void> {
        try {
            const user = await account.get()
            const profile = await sellerProfileService.getMyProfile()

            if (!profile || !profile.$id) {
                throw new Error('Seller profile not found')
            }

            if (amount > profile.balance) {
                throw new Error('Insufficient balance')
            }

            const newBalance = profile.balance - amount

            // Create transaction
            await databases.createDocument(
                DATABASE_ID,
                SELLER_TRANSACTIONS_COLLECTION_ID,
                ID.unique(),
                {
                    sellerId: user.$id,
                    type: 'withdrawal' as TransactionType,
                    amount: -amount,
                    description: `Withdrawal request`,
                    balanceBefore: profile.balance,
                    balanceAfter: newBalance
                }
            )

            // Update balance
            await sellerProfileService.updateProfile(profile.$id, {
                balance: newBalance
            })
        } catch (error) {
            console.error('Error requesting withdrawal:', error)
            throw error
        }
    }
}
