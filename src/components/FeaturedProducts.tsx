import { Star, ShoppingCart } from 'lucide-react'
import { Card, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useState, useEffect } from 'react'
import { productService, type Product } from '../lib/products'
import { Link } from '@tanstack/react-router'

export function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadProducts() {
            try {
                const featuredProducts = await productService.getFeaturedProducts()
                setProducts(featuredProducts)
            } catch (error) {
                console.error('Failed to load products:', error)
            } finally {
                setLoading(false)
            }
        }
        loadProducts()
    }, [])

    if (loading) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                        <p className="mt-4 text-muted-foreground">Loading products...</p>
                    </div>
                </div>
            </section>
        )
    }

    if (products.length === 0) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Featured Consoles
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            No featured products yet. Check back soon!
                        </p>
                    </div>
                </div>
            </section>
        )
    }
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Featured Consoles
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Hand-picked collection of the best retro and modern gaming consoles
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link
                            key={product.$id}
                            to="/product/$productId"
                            params={{ productId: product.$id! }}
                            className="block"
                        >
                            <Card className="group overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer">
                                {/* Product Image */}
                                <div className="relative overflow-hidden aspect-square">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {product.oldPrice && (
                                        <Badge variant="destructive" className="absolute top-3 left-3">
                                            -{Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                                        </Badge>
                                    )}
                                    <Button
                                        size="icon"
                                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Product Info */}
                                <CardContent className="space-y-3">
                                    <Badge variant="secondary" className="w-fit">
                                        {product.category}
                                    </Badge>
                                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="text-sm font-medium">
                                            {product.rating}
                                        </span>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="text-2xl font-bold">
                                            ${product.price.toLocaleString('en-US')}
                                        </div>
                                        {product.oldPrice && (
                                            <div className="text-sm text-muted-foreground line-through">
                                                ${product.oldPrice.toLocaleString('en-US')}
                                            </div>
                                        )}
                                    </div>
                                    <Button size="sm" onClick={(e) => e.preventDefault()}>
                                        Add to Cart
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button size="lg" asChild>
                        <Link to="/products" search={{}}>View All Consoles</Link>
                    </Button>
                </div>
            </div >
        </section >
    )
}
