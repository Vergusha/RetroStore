import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { productService, type Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';

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
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            {category ? category : 'All Products'}
                        </h1>
                        <p className="text-muted-foreground">
                            {products.length} {products.length === 1 ? 'product' : 'products'} found
                        </p>
                    </div>
                    {category && (
                        <Button variant="outline" onClick={clearFilter}>
                            <X className="h-4 w-4 mr-2" />
                            Clear Filter
                        </Button>
                    )}
                </div>
                <Breadcrumbs items={breadcrumbItems} />
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.$id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}
