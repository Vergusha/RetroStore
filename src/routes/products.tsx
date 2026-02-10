import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { productService, type Product } from '@/lib/products';
import { Loader2 } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { FilterBar } from '@/components/FilterBar';

export const Route = createFileRoute('/products')({
    component: Products,
    validateSearch: (search: Record<string, unknown>): { category?: string } => ({
        category: (search.category as string) || undefined,
    }),
});

function Products() {
    const navigate = useNavigate();
    const { category } = useSearch({ from: '/products' });
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    // const [sortBy, setSortBy] = useState<SortOption>('newest'); // Filters handled by FilterBar mostly now

    useEffect(() => {
        loadProducts();
    }, [category]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const allProducts = await productService.getProducts();

            if (category && category !== 'All') {
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

    const handleCategoryChange = (newCategory: string) => {
        if (newCategory === 'All') {
            navigate({ to: '/products', search: {} });
        } else {
            navigate({ to: '/products', search: { category: newCategory } });
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-black">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-12">
            <FilterBar
                selectedBrand="All"
                onBrandChange={() => { }}
                selectedCategory={category || 'All'}
                onCategoryChange={handleCategoryChange}
            />

            <div className="container mx-auto px-4">
                {/* 
                <div className="mb-8">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>
                 */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.$id} product={product} />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground font-mono">
                        NO PRODUCTS FOUND
                    </div>
                )}
            </div>
        </div>
    );
}
