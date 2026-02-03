import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { productService, type Product } from '@/lib/products';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingCart, Heart, Share2, Star, Check, ArrowLeft, Copy, CheckCheck } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

export const Route = createFileRoute('/product/$productId')({
    component: ProductPage,
});

function ProductPage() {
    const { productId } = Route.useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart, isInCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [isAdding, setIsAdding] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product?.name || 'Check out this product',
                    text: product?.description || '',
                    url: url
                });
            } catch (err) {
                // User cancelled or share failed, fallback to copy
                copyToClipboard(url);
            }
        } else {
            copyToClipboard(url);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        });
    };

    useEffect(() => {
        loadProduct();
    }, [productId]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await productService.getProduct(productId);
            setProduct(data);
        } catch (error) {
            console.error('Error loading product:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
                <p className="text-muted-foreground mb-8">
                    The product you're looking for doesn't exist or has been removed.
                </p>
                <Link to="/products">
                    <Button>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Products
                    </Button>
                </Link>
            </div>
        );
    }

    const totalPrice = product.price * quantity;

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs
                items={[
                    { label: 'Products', href: '/products' },
                    { label: product.name, current: true }
                ]}
            />

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Product Image */}
                <div className="space-y-4">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <Badge className="mb-2">{product.category}</Badge>
                        <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < (product.rating || 0)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                ({product.rating} rating)
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">${product.price}</span>
                            {product.oldPrice && (
                                <span className="text-xl text-muted-foreground line-through">
                                    ${product.oldPrice}
                                </span>
                            )}
                        </div>
                        {product.oldPrice && (
                            <p className="text-sm text-green-600">
                                Save ${(product.oldPrice - product.price).toFixed(2)} (
                                {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}
                                % off)
                            </p>
                        )}
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                    {/* Stock Status */}
                    <div>
                        {product.stock > 0 ? (
                            <div className="flex items-center gap-2 text-green-600">
                                <Check className="h-5 w-5" />
                                <span className="font-medium">
                                    In Stock ({product.stock} available)
                                </span>
                            </div>
                        ) : (
                            <div className="text-red-600 font-medium">Out of Stock</div>
                        )}
                    </div>

                    {/* Quantity Selector */}
                    {product.stock > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium">Quantity:</label>
                                <div className="flex items-center border rounded-md">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </Button>
                                    <span className="px-4 py-2 min-w-[3rem] text-center">
                                        {quantity}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setQuantity(Math.min(product.stock, quantity + 1))
                                        }
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <Button
                                    className={`flex-1 ${isInCart(product.$id!) ? 'bg-green-600 hover:bg-green-700' : ''} ${isAdding ? 'scale-95' : ''} transition-all`}
                                    size="lg"
                                    onClick={() => {
                                        if (isInCart(product.$id!)) return;
                                        setIsAdding(true);
                                        addToCart(product, quantity);
                                        setTimeout(() => setIsAdding(false), 1000);
                                    }}
                                >
                                    {isInCart(product.$id!) ? (
                                        <>
                                            <Check className="h-5 w-5 mr-2" />
                                            Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="h-5 w-5 mr-2" />
                                            Add to Cart - ${totalPrice.toFixed(2)}
                                        </>
                                    )}
                                </Button>
                                <Button variant="outline" size="lg" onClick={() => toggleFavorite(product)} className={isFavorite(product.$id!) ? 'text-red-500 border-red-500 hover:bg-red-50' : ''}>
                                    <Heart className={`h-5 w-5 ${isFavorite(product.$id!) ? 'fill-red-500' : ''}`} />
                                </Button>
                                <Button variant="outline" size="lg" onClick={handleShare} className={linkCopied ? 'text-green-500 border-green-500' : ''}>
                                    {linkCopied ? <CheckCheck className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Features */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl mb-1">🚚</div>
                                <div className="text-sm font-medium">Free Shipping</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl mb-1">✓</div>
                                <div className="text-sm font-medium">Authentic</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl mb-1">↻</div>
                                <div className="text-sm font-medium">30-Day Return</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-bold">Description</h2>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-bold">Product Details</h2>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Category</span>
                            <span className="font-medium">{product.category}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Availability</span>
                            <span className="font-medium">
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Rating</span>
                            <span className="font-medium">{product.rating}/5</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
