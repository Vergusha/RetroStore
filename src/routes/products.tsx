import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { productService, type Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Loader2, X, ArrowUpDown, Grid, LayoutGrid } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export const Route = createFileRoute('/products')({
    component: Products,
    validateSearch: (search: Record<string, unknown>): { category?: string } => ({
        category: (search.category as string) || undefined,
    }),
});

type SortOption = 'newest' | 'price-low' | 'price-high' | 'rating';

function Products() {
    const navigate = useNavigate();
    const { category } = useSearch({ from: '/products' });
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [gridCols, setGridCols] = useState<3 | 4>(4);

    useEffect(() => {
        loadProducts();
    }, [category]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const allProducts = await productService.getProducts();

            if (category) {
                setProducts(allProducts.filter(p => p.category === category));
            } else {
                setProducts(allProducts);
            }
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilter = () => {
        navigate({ to: '/products', search: {} });
    };

    // Sort products
    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return (b.rating || 0) - (a.rating || 0);
            case 'newest':
            default:
                return 0; // Keep original order
        }
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const breadcrumbItems: { label: string; href?: string }[] = [
        { label: 'Products', href: '/products' }
    ];

    if (category) {
        breadcrumbItems.push({ label: category });
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">
                            {category ? category : 'All Products'}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {products.length} {products.length === 1 ? 'product' : 'products'} found
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {category && (
                            <Button variant="outline" size="sm" onClick={clearFilter}>
                                <X className="h-4 w-4 mr-2" />
                                Clear
                            </Button>
                        )}
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                            <SelectTrigger className="w-[160px]">
                                <ArrowUpDown className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                                <SelectItem value="rating">Top Rated</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="hidden md:flex border rounded-md">
                            <Button
                                variant={gridCols === 3 ? 'secondary' : 'ghost'}
                                size="icon"
                                onClick={() => setGridCols(3)}
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={gridCols === 4 ? 'secondary' : 'ghost'}
                                size="icon"
                                onClick={() => setGridCols(4)}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-16">
                    <h3 className="text-2xl font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                        {category
                            ? `There are no products in the "${category}" category yet.`
                            : 'There are no products available yet.'}
                    </p>
                    <Link to="/">
                        <Button>Back to Home</Button>
                    </Link>
                </div>
            ) : (
                <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
                    {sortedProducts.map((product) => (
                        <ProductCard key={product.$id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}
