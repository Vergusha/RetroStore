import { Star, ShoppingCart } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { Product } from '../lib/products'
import { useCart } from '../contexts/CartContext'
import { useToast } from './Toast'
import { ImageWithFallback } from './ImageWithFallback'

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart, isInCart } = useCart()
    const { addToast } = useToast()
    const inCart = isInCart(product.$id!)
    const rating = Math.round(product.rating || 0)
    const categoryUpper = product.category ? product.category.toUpperCase() : 'RETRO'

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (product.stock === 0 || inCart) return

        addToCart(product)
        addToast(`${product.name} added to cart`, 'success')
    }

    return (
        <Link
            to="/product/$productId"
            params={{ productId: product.$id! }}
            className="block h-full"
        >
            <div
                className="group relative bg-black border-4 border-primary hover:border-secondary transition-all duration-300 overflow-hidden h-full flex flex-col"
                style={{
                    boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)',
                }}
            >
                {/* Glitch effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />

                {/* Image container */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-900 to-black border-b-4 border-primary group-hover:border-secondary transition-colors">
                    <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        fallbackText={product.name}
                    />

                    {/* Stock badge */}
                    {product.stock === 0 && (
                        <div
                            className="absolute top-4 right-4 bg-destructive text-white px-2 py-1 border-2 border-white transform rotate-3"
                            style={{
                                fontFamily: '"Press Start 2P", cursive',
                                fontSize: '0.6rem',
                                textShadow: '2px 2px 0 #000'
                            }}
                        >
                            SOLD OUT
                        </div>
                    )}

                    {/* Category badge */}
                    <div
                        className="absolute top-4 left-4 bg-[#0099FF] text-white px-2 py-1 border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        style={{
                            fontFamily: '"Press Start 2P", cursive',
                            fontSize: '0.5rem'
                        }}
                    >
                        {categoryUpper}
                    </div>

                    {/* Discount Badge */}
                    {product.oldPrice && (
                        <div
                            className="absolute bottom-4 left-4 bg-[#FF00FF] text-white px-2 py-1 border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            style={{
                                fontFamily: '"Press Start 2P", cursive',
                                fontSize: '0.5rem'
                            }}
                        >
                            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 flex flex-col flex-grow">
                    <h3
                        className="text-primary group-hover:text-secondary transition-colors line-clamp-2 min-h-[2.5em]"
                        style={{
                            fontFamily: '"Press Start 2P", cursive',
                            fontSize: '0.75rem',
                            lineHeight: '1.6',
                            textShadow: '2px 2px 0 #000'
                        }}
                    >
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 ${i < rating ? 'fill-[#FFD700] text-[#FFD700]' : 'text-gray-800'}`}
                            />
                        ))}
                    </div>

                    {/* Price and button */}
                    <div className="flex items-center justify-between pt-2 mt-auto">
                        <div>
                            <div
                                className="text-gray-500 uppercase mb-1"
                                style={{
                                    fontFamily: '"Press Start 2P", cursive',
                                    fontSize: '0.5rem'
                                }}
                            >
                                Price
                            </div>
                            <div className="flex flex-col">
                                <span
                                    className="text-primary group-hover:text-secondary transition-colors"
                                    style={{
                                        fontFamily: '"Press Start 2P", cursive',
                                        fontSize: '1rem',
                                        textShadow: '0 0 5px currentColor'
                                    }}
                                >
                                    ${product.price}
                                </span>
                                {product.oldPrice && (
                                    <span
                                        className="text-gray-600 line-through decoration-red-500 decoration-2"
                                        style={{
                                            fontFamily: '"Press Start 2P", cursive',
                                            fontSize: '0.6rem'
                                        }}
                                    >
                                        ${product.oldPrice}
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`
                                px-3 py-2 border-2 transition-all duration-200 flex items-center gap-2
                                ${product.stock > 0
                                    ? inCart
                                        ? 'bg-secondary border-secondary text-black hover:bg-secondary/80'
                                        : 'bg-black border-secondary hover:bg-secondary hover:text-black text-secondary'
                                    : 'bg-gray-900 border-gray-700 text-gray-700 cursor-not-allowed'
                                }
                            `}
                            style={{
                                boxShadow: product.stock > 0 && !inCart ? '0 0 10px rgba(255, 0, 255, 0.3)' : 'none',
                            }}
                        >
                            <ShoppingCart className="w-3 h-3" />
                            <span
                                style={{
                                    fontFamily: '"Press Start 2P", cursive',
                                    fontSize: '0.5rem'
                                }}
                            >
                                {inCart ? 'ADDED' : 'BUY'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}

