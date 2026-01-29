import { Gamepad2, Cpu, Zap, Package, Joystick, Smartphone } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { useState, useEffect } from 'react'
import { productService } from '../lib/products'
import { Link } from '@tanstack/react-router'

interface Category {
    id: number
    name: string
    icon: React.ReactNode
    itemCount: number
}

const categoryDefinitions = [
    {
        id: 1,
        name: 'Retro Consoles',
        icon: <Gamepad2 className="w-8 h-8" />
    },
    {
        id: 2,
        name: 'Modern Consoles',
        icon: <Cpu className="w-8 h-8" />
    },
    {
        id: 3,
        name: 'Handhelds',
        icon: <Joystick className="w-8 h-8" />
    },
    {
        id: 4,
        name: 'Accessories',
        icon: <Package className="w-8 h-8" />
    },
    {
        id: 5,
        name: 'Limited Edition',
        icon: <Zap className="w-8 h-8" />
    },
    {
        id: 6,
        name: 'Mobile Gaming',
        icon: <Smartphone className="w-8 h-8" />
    }
]

export function Categories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadCategoryCounts() {
            try {
                const products = await productService.getProducts()

                // Count products in each category
                const categoriesWithCounts = categoryDefinitions.map(catDef => {
                    const count = products.filter(p => p.category === catDef.name).length
                    return {
                        ...catDef,
                        itemCount: count
                    }
                })

                setCategories(categoriesWithCounts)
            } catch (error) {
                console.error('Failed to load categories:', error)
                // Fallback to definitions with 0 count
                setCategories(categoryDefinitions.map(cat => ({ ...cat, itemCount: 0 })))
            } finally {
                setLoading(false)
            }
        }
        loadCategoryCounts()
    }, [])

    if (loading) {
        return (
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 bg-muted/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-primary/70 bg-clip-text text-transparent">
                        Categories
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Explore our collection of gaming consoles
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            to="/products"
                            search={{ category: category.name }}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <Button
                                variant="outline"
                                className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all group w-full rounded-xl shadow-sm hover:shadow-lg"
                            >
                                <div className="text-primary group-hover:text-primary-foreground transition-colors">
                                    {category.icon}
                                </div>
                                <div className="text-center space-y-1">
                                    <h3 className="font-semibold text-sm">
                                        {category.name}
                                    </h3>
                                    <span className="text-xs text-muted-foreground group-hover:text-primary-foreground/80">
                                        {category.itemCount}
                                    </span>
                                </div>
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
