import { Client, Databases, Storage, ID, Query } from 'appwrite'
import { client } from './appwrite'

export const databases = new Databases(client)
export const storage = new Storage(client)

// Database and Collection IDs - you'll need to create these in Appwrite Console
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'retro_store_db'
export const PRODUCTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID || 'products'
export const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID || 'product_images'

export interface Product {
    $id?: string
    name: string
    description: string
    price: number
    oldPrice?: number
    category: string
    image: string
    rating?: number
    stock: number
    featured: boolean
    $createdAt?: string
    $updatedAt?: string
}

export const productService = {
    // Get all products
    async getProducts(limit = 100): Promise<Product[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                PRODUCTS_COLLECTION_ID,
                [Query.limit(limit), Query.orderDesc('$createdAt')]
            )
            return response.documents as unknown as Product[]
        } catch (error) {
            console.error('Error fetching products:', error)
            throw error
        }
    },

    // Get featured products
    async getFeaturedProducts(): Promise<Product[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                PRODUCTS_COLLECTION_ID,
                [Query.equal('featured', true), Query.limit(8)]
            )
            return response.documents as unknown as Product[]
        } catch (error) {
            console.error('Error fetching featured products:', error)
            throw error
        }
    },

    // Get product by ID
    async getProduct(id: string): Promise<Product> {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                PRODUCTS_COLLECTION_ID,
                id
            )
            return response as unknown as Product
        } catch (error) {
            console.error('Error fetching product:', error)
            throw error
        }
    },

    // Create product
    async createProduct(product: Omit<Product, '$id' | '$createdAt' | '$updatedAt'>): Promise<Product> {
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                PRODUCTS_COLLECTION_ID,
                ID.unique(),
                product
            )
            return response as unknown as Product
        } catch (error) {
            console.error('Error creating product:', error)
            throw error
        }
    },

    // Update product
    async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                PRODUCTS_COLLECTION_ID,
                id,
                product
            )
            return response as unknown as Product
        } catch (error) {
            console.error('Error updating product:', error)
            throw error
        }
    },

    // Delete product
    async deleteProduct(id: string): Promise<void> {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                PRODUCTS_COLLECTION_ID,
                id
            )
        } catch (error) {
            console.error('Error deleting product:', error)
            throw error
        }
    },

    // Upload product image
    async uploadImage(file: File): Promise<string> {
        try {
            const response = await storage.createFile(
                STORAGE_BUCKET_ID,
                ID.unique(),
                file
            )
            // Return the file view URL
            return storage.getFileView(STORAGE_BUCKET_ID, response.$id).toString()
        } catch (error) {
            console.error('Error uploading image:', error)
            throw error
        }
    }
}
