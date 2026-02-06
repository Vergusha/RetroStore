import { createFileRoute, Link } from '@tanstack/react-router'
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardFooter } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useFavorites } from '../contexts/FavoritesContext'
import { useCart } from '../contexts/CartContext'
import { Breadcrumbs } from '../components/Breadcrumbs'

export const Route = createFileRoute('/favorites')({
    component: FavoritesPage,
})

function FavoritesPage() {
    const { favorites, removeFromFavorites } = useFavorites()
    const { addToCart, isInCart } = useCart()

    if (favorites.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <div className="p-8 rounded-full bg-muted inline-flex mb-6">
                        <Heart className="w-16 h-16 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">No favorites yet</h1>
                    <p className="text-muted-foreground mb-8">
                        Browse our collection and save items you love by clicking the heart icon.
                    </p>
                    <Button asChild size="lg">
                        <Link to="/products">
                            Browse Products
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs items={[{ label: 'Favorites', current: true }]} />

            <div className="flex items-center justify-between mb-8 mt-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                        My Favorites
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {favorites.length} item{favorites.length !== 1 ? 's' : ''} saved
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map(product => (
                    <Card key={product.$id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <Link to="/product/$productId" params={{ productId: product.$id! }} className="block">
                            <div className="relative aspect-square overflow-hidden bg-muted">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {product.oldPrice && (
                                    <Badge variant="destructive" className="absolute top-3 left-3 shadow-lg font-bold">
                                        -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                                    </Badge>
                                )}
                            </div>
                        </Link>
                        <CardContent className="p-4 space-y-2">
                            <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                            <Link to="/product/$productId" params={{ productId: product.$id! }}>
                                <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                                    {product.name}
                                </h3>
                            </Link>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-primary">${product.price}</span>
                                {product.oldPrice && (
                                    <span className="text-sm text-muted-foreground line-through">${product.oldPrice}</span>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 gap-2">
                            <Button
                                className="flex-1"
                                size="sm"
                                disabled={product.stock === 0 || isInCart(product.$id!)}
                                onClick={() => addToCart(product)}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {isInCart(product.$id!) ? 'In Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0"
                                onClick={() => removeFromFavorites(product.$id!)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="mt-8">
                <Button variant="ghost" asChild className="gap-2">
                    <Link to="/products">
                        <ArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </Link>
                </Button>
            </div>
        </div>
    )
}
