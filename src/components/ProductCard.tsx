import { Star, ShoppingCart, Check } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Link } from '@tanstack/react-router'
import type { Product } from '../lib/products'
import { useCart } from '../contexts/CartContext'
import { useState } from 'react'

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart, isInCart } = useCart()
    const [isAdding, setIsAdding] = useState(false)
    const inCart = isInCart(product.$id!)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (product.stock === 0 || inCart) return

        setIsAdding(true)
        addToCart(product)

        // Reset animation after short delay
        setTimeout(() => setIsAdding(false), 1000)
    }

    return (
        <Link
            to="/product/$productId"
            params={{ productId: product.$id! }}
            className="group block h-full"
        >
            <Card className="flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer border-2 hover:border-primary/50">
                <CardHeader className="p-0">
                    <div className="relative aspect-square rounded-t-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.oldPrice && (
                            <Badge variant="destructive" className="absolute top-3 left-3 shadow-lg font-bold">
                                -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                            </Badge>
                        )}
                        {product.stock === 0 && (
                            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                                <Badge variant="outline" className="text-red-600 bg-background px-4 py-2">
                                    Out of Stock
                                </Badge>
                            </div>
                        )}
                    </div>
                    <div className="p-4 space-y-2">
                        <Badge variant="secondary" className="w-fit text-xs">
                            {product.category}
                        </Badge>
                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-lg">
                            {product.name}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow px-4 pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {product.description}
                    </p>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            ${product.price}
                        </span>
                        {product.oldPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                                ${product.oldPrice}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-medium">{product.rating}</span>
                        </div>
                        {product.stock > 0 && (
                            <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                                <Check className="w-3 h-3 mr-1" />
                                In Stock
                            </Badge>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="px-4 pb-4">
                    <Button
                        className={`w-full shadow-sm hover:shadow-md transition-all ${inCart ? 'bg-green-600 hover:bg-green-700' : ''
                            } ${isAdding ? 'scale-95' : ''}`}
                        disabled={product.stock === 0}
                        onClick={handleAddToCart}
                    >
                        {inCart ? (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Added to Cart
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    )
}
