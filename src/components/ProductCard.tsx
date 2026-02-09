import { Star, ShoppingCart, Check, Heart } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Link } from '@tanstack/react-router'
import type { Product } from '../lib/products'
import { useCart } from '../contexts/CartContext'
import { useFavorites } from '../contexts/FavoritesContext'
import { useToast } from './Toast'

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart, isInCart } = useCart()
    const { toggleFavorite, isFavorite } = useFavorites()
    const { addToast } = useToast()
    const inCart = isInCart(product.$id!)
    const favorited = isFavorite(product.$id!)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (product.stock === 0 || inCart) return

        addToCart(product)
        addToast(`${product.name} added to cart`, 'success')
    }

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(product)
        if (!favorited) {
            addToast(`${product.name} added to favorites`, 'success')
        }
    }

    return (
        <Link
            to="/product/$productId"
            params={{ productId: product.$id! }}
            className="group block h-full"
        >
            <Card className="flex flex-col hover:shadow-md transition-shadow h-full cursor-pointer">
                <CardHeader className="p-0">
                    <div className="relative aspect-square rounded-t-lg overflow-hidden bg-muted">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {/* Favorite button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleToggleFavorite}
                            className={`absolute top-3 right-3 bg-background shadow-sm hover:bg-background transition-colors ${favorited ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500' : ''}`} />
                        </Button>
                        {product.oldPrice && (
                            <Badge variant="destructive" className="absolute top-3 left-3 shadow-lg font-bold">
                                -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                            </Badge>
                        )}
                        {product.stock === 0 && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
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
                        <span className="text-3xl font-bold text-primary">
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
                        className={`w-full ${inCart ? 'bg-green-600 hover:bg-green-700' : ''}`}
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
