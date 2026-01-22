import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { productService, type Product } from '@/lib/products';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';

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
                <div className="flex gap-2 flex-wrap">
                    <Link to="/">
                        <Button variant="ghost" size="sm">Home</Button>
                    </Link>
                    <span className="text-muted-foreground">/</span>
                    <Badge variant="secondary">Products</Badge>
                    {category && (
                        <>
                            <span className="text-muted-foreground">/</span>
                            <Badge>{category}</Badge>
                        </>
                    )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link
                            key={product.$id}
                            to="/product/$productId"
                            params={{ productId: product.$id! }}
                            className="group"
                        >
                            <Card className="flex flex-col hover:shadow-lg transition-shadow h-full cursor-pointer">
                                <CardHeader>
                                    <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-muted">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <Badge className="w-fit mb-2" variant="secondary">
                                        {product.category}
                                    </Badge>
                                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                                        {product.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl font-bold">${product.price}</span>
                                        {product.oldPrice && (
                                            <span className="text-sm text-muted-foreground line-through">
                                                ${product.oldPrice}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={i < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-muted-foreground">({product.rating})</span>
                                    </div>
                                    <div className="mt-2">
                                        {product.stock > 0 ? (
                                            <Badge variant="outline" className="text-green-600">
                                                In Stock ({product.stock})
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-red-600">
                                                Out of Stock
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        disabled={product.stock === 0}
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Add to Cart
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
