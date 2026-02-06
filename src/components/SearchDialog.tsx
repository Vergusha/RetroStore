import { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2, ArrowRight } from 'lucide-react'
import { Dialog, DialogContent } from './ui/dialog'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Link } from '@tanstack/react-router'
import { productService, type Product } from '../lib/products'

interface SearchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [allProducts, setAllProducts] = useState<Product[]>([])
    const inputRef = useRef<HTMLInputElement>(null)

    // Load products once when dialog opens
    useEffect(() => {
        if (open && allProducts.length === 0) {
            loadProducts()
        }
        if (open) {
            setQuery('')
            setResults([])
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [open])

    // Search when query changes
    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }

        const q = query.toLowerCase()
        const filtered = allProducts.filter(
            p =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
        )
        setResults(filtered.slice(0, 8))
    }, [query, allProducts])

    async function loadProducts() {
        setLoading(true)
        try {
            const products = await productService.getProducts()
            setAllProducts(products)
        } catch (error) {
            console.error('Failed to load products for search:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelect = () => {
        onOpenChange(false)
        setQuery('')
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[540px] p-0 gap-0 overflow-hidden">
                <div className="flex items-center border-b px-4">
                    <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                    <Input
                        ref={inputRef}
                        placeholder="Search consoles, games, accessories..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 text-base"
                    />
                    {query && (
                        <Button variant="ghost" size="icon" onClick={() => setQuery('')} className="shrink-0">
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : query && results.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <p className="text-muted-foreground">
                                No results for "<span className="font-medium text-foreground">{query}</span>"
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Try a different search term
                            </p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="py-2">
                            {results.map(product => (
                                <Link
                                    key={product.$id}
                                    to="/product/$productId"
                                    params={{ productId: product.$id! }}
                                    onClick={handleSelect}
                                    className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{product.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Badge variant="secondary" className="text-xs">
                                                {product.category}
                                            </Badge>
                                            <span className="text-sm font-semibold text-primary">
                                                ${product.price}
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                </Link>
                            ))}
                        </div>
                    ) : !query ? (
                        <div className="py-8 px-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                Start typing to search products...
                            </p>
                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                {['Retro Consoles', 'Handhelds', 'Modern Consoles', 'Accessories'].map(tag => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                        onClick={() => setQuery(tag)}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground bg-muted/30">
                    <span>
                        {results.length > 0 ? `${results.length} result${results.length !== 1 ? 's' : ''}` : 'Search products'}
                    </span>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        ESC to close
                    </kbd>
                </div>
            </DialogContent>
        </Dialog>
    )
}
