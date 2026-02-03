import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Product } from '../lib/products'
import type { CartItem } from '../lib/orders'

interface CartContextType {
    items: CartItem[]
    addToCart: (product: Product, quantity?: number) => void
    removeFromCart: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    getCartTotal: () => number
    getCartCount: () => number
    isInCart: (productId: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'retro_store_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY)
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart)
                setItems(parsedCart)
            }
        } catch (error) {
            console.error('Error loading cart from storage:', error)
        } finally {
            setIsLoaded(true)
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
            } catch (error) {
                console.error('Error saving cart to storage:', error)
            }
        }
    }, [items, isLoaded])

    const addToCart = useCallback((product: Product, quantity = 1) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.product.$id === product.$id)

            if (existingItem) {
                // Update quantity if product already in cart
                return currentItems.map(item =>
                    item.product.$id === product.$id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            } else {
                // Add new product to cart
                return [...currentItems, { product, quantity }]
            }
        })
    }, [])

    const removeFromCart = useCallback((productId: string) => {
        setItems(currentItems =>
            currentItems.filter(item => item.product.$id !== productId)
        )
    }, [])

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }

        setItems(currentItems =>
            currentItems.map(item =>
                item.product.$id === productId
                    ? { ...item, quantity }
                    : item
            )
        )
    }, [removeFromCart])

    const clearCart = useCallback(() => {
        setItems([])
    }, [])

    const getCartTotal = useCallback(() => {
        return items.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        )
    }, [items])

    const getCartCount = useCallback(() => {
        return items.reduce((count, item) => count + item.quantity, 0)
    }, [items])

    const isInCart = useCallback((productId: string) => {
        return items.some(item => item.product.$id === productId)
    }, [items])

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
                isInCart
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
