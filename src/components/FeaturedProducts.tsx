import { useState, useEffect } from 'react'
import { productService, type Product } from '../lib/products'
import { Button } from './ui/button'
import { Link } from '@tanstack/react-router'
import { ProductCard } from './ProductCard'

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
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-primary/70 bg-clip-text text-transparent">
                        Featured Consoles
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Hand-picked collection of retro and modern gaming systems
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <div
                            key={product.$id}
                            className="animate-in fade-in slide-in-from-bottom-8 duration-500"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <Button size="lg" variant="outline" asChild className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <Link to="/products" search={{}}>View All</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
