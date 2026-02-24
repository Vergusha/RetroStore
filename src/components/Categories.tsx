import { Gamepad2, Cpu, Zap, Package, Joystick, Smartphone } from 'lucide-react'
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
        name: 'Retro',
        icon: <Gamepad2 className="w-8 h-8" />
    },
    {
        id: 2,
        name: 'Modern',
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
        name: 'Limited',
        icon: <Zap className="w-8 h-8" />
    },
    {
        id: 6,
        name: 'Mobile',
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
        <section className="py-10 md:py-12 bg-muted/20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map(category => (
                        <Link
                            key={category.id}
                            to="/products"
                            search={{ category: category.name }}
                            className=""
                        >
                            <Button
                                variant="outline"
                                className="h-auto p-4 md:p-6 flex flex-col items-center gap-3 bg-black border-2 border-primary hover:bg-black hover:border-secondary transition-all duration-300 group w-full rounded-xl whitespace-normal"
                            >
                                <div className="text-primary group-hover:text-secondary transition-colors duration-300">
                                    {category.icon}
                                </div>
                                <div className="text-center space-y-1 w-full">
                                    <h3 className="font-bold text-xs md:text-sm uppercase font-mono text-primary group-hover:text-secondary transition-colors duration-300 break-words leading-tight">
                                        {category.name}
                                    </h3>
                                    <span className="text-[10px] md:text-xs font-mono text-primary/80 group-hover:text-secondary/80 transition-colors duration-300">
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
