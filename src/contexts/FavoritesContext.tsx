import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Product } from '../lib/products'

interface FavoritesContextType {
    favorites: Product[]
    addToFavorites: (product: Product) => void
    removeFromFavorites: (productId: string) => void
    isFavorite: (productId: string) => boolean
    toggleFavorite: (product: Product) => void
    getFavoritesCount: () => number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const FAVORITES_STORAGE_KEY = 'retrostore_favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<Product[]>(() => {
        // Initialize from localStorage
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
            if (stored) {
                try {
                    return JSON.parse(stored)
                } catch (e) {
                    console.error('Error parsing favorites from localStorage:', e)
                }
            }
        }
        return []
    })

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
    }, [favorites])

    const addToFavorites = (product: Product) => {
        setFavorites(prev => {
            if (prev.some(p => p.$id === product.$id)) {
                return prev
            }
            return [...prev, product]
        })
    }

    const removeFromFavorites = (productId: string) => {
        setFavorites(prev => prev.filter(p => p.$id !== productId))
    }

    const isFavorite = (productId: string) => {
        return favorites.some(p => p.$id === productId)
    }

    const toggleFavorite = (product: Product) => {
        if (isFavorite(product.$id!)) {
            removeFromFavorites(product.$id!)
        } else {
            addToFavorites(product)
        }
    }

    const getFavoritesCount = () => favorites.length

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                addToFavorites,
                removeFromFavorites,
                isFavorite,
                toggleFavorite,
                getFavoritesCount
            }}
        >
            {children}
        </FavoritesContext.Provider>
    )
}

export function useFavorites() {
    const context = useContext(FavoritesContext)
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider')
    }
    return context
}
