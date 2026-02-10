import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { productService, type Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingCart, Heart, Share2, Star, Check, ArrowLeft, CheckCheck, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/components/Toast';
import { ImageWithFallback } from '@/components/ImageWithFallback';

export const Route = createFileRoute('/product/$productId')({
    component: ProductPage,
});

function ProductPage() {
    const { productId } = Route.useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [booting, setBooting] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart, isInCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { addToast } = useToast();
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
                copyToClipboard(url);
            }
        } else {
            copyToClipboard(url);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setLinkCopied(true);
            addToast('Link copied to clipboard', 'success');
            setTimeout(() => setLinkCopied(false), 2000);
        });
    };

    useEffect(() => {
        loadProduct();
    }, [productId]);

    useEffect(() => {
        setBooting(true);
        const timer = window.setTimeout(() => setBooting(false), 650);
        return () => window.clearTimeout(timer);
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
            <div className="min-h-screen">
                {booting && <div className="retro-poweron" aria-hidden="true" />}
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-primary font-mono animate-pulse">LOADING ASSETS...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen text-white">
                {booting && <div className="retro-poweron" aria-hidden="true" />}
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl mb-4 text-destructive" style={{ fontFamily: '"Press Start 2P", cursive' }}>ERROR 404</h1>
                    <p className="text-gray-400 mb-8 font-mono">
                        OBJECT NOT FOUND IN DATABASE
                    </p>
                    <Link to="/products">
                        <Button className="rounded-none border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-black">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            RETURN TO BASE
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white pb-20">
            {booting && <div className="retro-poweron" aria-hidden="true" />}

            <div className="container mx-auto px-4 py-8">
                <Breadcrumbs
                    items={[
                        { label: 'Products', href: '/products' },
                        { label: product.name, current: true }
                    ]}
                />

                <div className="grid md:grid-cols-2 gap-12 mt-8 mb-12">
                    {/* Product Image Stage */}
                    <div className="space-y-4 relative group">
                        <div
                            className="aspect-square relative overflow-hidden bg-gray-900 border-4 border-primary shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10 pointer-events-none" />
                            <ImageWithFallback
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                fallbackText={product.name}
                            />

                            {/* Decorative grid overlay */}
                            <div className="absolute inset-0 bg-[url('/grid.png')] opacity-10 pointer-events-none z-20" />

                            {/* Scanline overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none" />
                        </div>
                    </div>

                    {/* Product Info Console */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="px-3 py-1 bg-secondary text-black text-xs border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                                    {product.category}
                                </span>
                                {product.stock > 0 ? (
                                    <span className="text-green-500 text-xs flex items-center gap-2 font-mono uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        System Online
                                    </span>
                                ) : (
                                    <span className="text-destructive text-xs flex items-center gap-2 font-mono uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-destructive rounded-full" />
                                        System Offline
                                    </span>
                                )}
                            </div>

                            <h1
                                className="text-3xl lg:text-4xl text-white mb-4 leading-relaxed tracking-wide"
                                style={{
                                    fontFamily: '"Press Start 2P", cursive',
                                    textShadow: '4px 4px 0px #000'
                                }}
                            >
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 border-b border-gray-800 pb-6">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < (product.rating || 0)
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-700'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500 font-mono">
                                    ID: {product.$id?.substring(0, 8).toUpperCase() || 'UNKNOWN'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-baseline gap-4">
                                <span
                                    className="text-4xl text-primary"
                                    style={{
                                        fontFamily: '"Press Start 2P", cursive',
                                        textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
                                    }}
                                >
                                    ${product.price}
                                </span>
                                {product.oldPrice && (
                                    <span
                                        className="text-xl text-gray-600 line-through decoration-destructive decoration-2"
                                        style={{ fontFamily: '"Press Start 2P", cursive' }}
                                    >
                                        ${product.oldPrice}
                                    </span>
                                )}
                            </div>
                            {product.oldPrice && (
                                <p className="text-sm text-secondary font-mono animate-pulse">
                                    &gt;&gt; SAVINGS DETECTED: {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                                </p>
                            )}
                        </div>

                        <div className="bg-gray-900/50 border-l-4 border-primary p-4">
                            <p className="text-gray-300 leading-relaxed font-mono text-sm">
                                {product.description}
                            </p>
                        </div>

                        {/* Control Panel */}
                        {product.stock > 0 && (
                            <div className="bg-gray-900 border-2 border-gray-700 p-6 space-y-6 shadow-[8px_8px_0_0_#000]">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold uppercase text-gray-400" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.7rem' }}>Quantity</label>
                                    <div className="flex items-center bg-black border border-gray-600">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-white hover:text-primary hover:bg-gray-800 rounded-none h-10 w-10"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </Button>
                                        <span className="px-4 py-2 min-w-[3rem] text-center font-mono text-lg border-x border-gray-600">
                                            {quantity}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-white hover:text-primary hover:bg-gray-800 rounded-none h-10 w-10"
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
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        className={`flex-1 h-14 text-lg border-4 transition-all duration-200 rounded-none relative overflow-hidden group/btn ${isInCart(product.$id!)
                                            ? 'bg-secondary text-black border-secondary'
                                            : 'bg-primary text-black border-primary hover:bg-primary/90'
                                            }`}
                                        onClick={() => {
                                            if (isInCart(product.$id!)) return;
                                            addToCart(product, quantity);
                                            addToast("ITEM ACQUIRED", 'success');
                                        }}
                                    >
                                        <div className="absolute inset-0 skew-x-12 translate-x-full group-hover/btn:translate-x-[-200%] transition-transform duration-1000 bg-white/30 z-10" />

                                        <span className="relative z-20 flex items-center justify-center gap-3" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>
                                            {isInCart(product.$id!) ? (
                                                <>
                                                    <Check className="h-5 w-5" />
                                                    IN INVENTORY
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="h-5 w-5" />
                                                    ADD TO CART
                                                </>
                                            )}
                                        </span>
                                    </Button>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className={`h-14 w-14 rounded-none border-2 bg-black ${isFavorite(product.$id!) ? 'border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-500'}`}
                                            onClick={() => toggleFavorite(product)}
                                        >
                                            <Heart className={`h-6 w-6 ${isFavorite(product.$id!) ? 'fill-red-500' : ''}`} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className={`h-14 w-14 rounded-none border-2 bg-black ${linkCopied ? 'border-green-500 text-green-500' : 'border-gray-600 text-gray-400 hover:border-green-500 hover:text-green-500'}`}
                                            onClick={handleShare}
                                        >
                                            {linkCopied ? <CheckCheck className="h-6 w-6" /> : <Share2 className="h-6 w-6" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Info Cards */}
                <div className="grid md:grid-cols-2 gap-8 mt-16">
                    <div className="bg-black border-2 border-primary relative">
                        <div className="absolute -top-3 left-4 bg-primary text-black px-2 py-1 font-bold text-xs" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                            DESCRIPTION
                        </div>
                        <div className="p-8 pt-10">
                            <p className="text-gray-300 leading-loose font-mono">
                                {product.description}
                            </p>
                        </div>
                    </div>

                    <div className="bg-black border-2 border-secondary relative">
                        <div className="absolute -top-3 left-4 bg-secondary text-black px-2 py-1 font-bold text-xs" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                            SPECIFICATIONS
                        </div>
                        <div className="p-8 pt-10 space-y-4">
                            <div className="flex justify-between py-2 border-b border-gray-800">
                                <span className="text-gray-500 font-mono text-sm">SYSTEM CLASS</span>
                                <span className="text-white font-bold">{product.category}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-800">
                                <span className="text-gray-500 font-mono text-sm">STATUS</span>
                                <span className={`font-bold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {product.stock > 0 ? 'AVAILABLE' : 'UNAVAILABLE'}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-800">
                                <span className="text-gray-500 font-mono text-sm">USER RATING</span>
                                <span className="text-yellow-400 font-bold">{product.rating}/5</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    <div className="bg-gray-900/50 border border-gray-800 p-6 flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary/20 flex items-center justify-center rounded-none border border-primary text-primary">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1 pixel-font text-xs" style={{ fontFamily: '"Press Start 2P", cursive' }}>FAST DELIVERY</h3>
                            <p className="text-xs text-gray-500 font-mono">Global shipping available</p>
                        </div>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 p-6 flex items-center gap-4">
                        <div className="h-12 w-12 bg-secondary/20 flex items-center justify-center rounded-none border border-secondary text-secondary">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1 pixel-font text-xs" style={{ fontFamily: '"Press Start 2P", cursive' }}>AUTHENTICATED</h3>
                            <p className="text-xs text-gray-500 font-mono">Verified retro hardware</p>
                        </div>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 p-6 flex items-center gap-4">
                        <div className="h-12 w-12 bg-[#0099FF]/20 flex items-center justify-center rounded-none border border-[#0099FF] text-[#0099FF]">
                            <RefreshCw className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1 pixel-font text-xs" style={{ fontFamily: '"Press Start 2P", cursive' }}>30-DAY RETURNS</h3>
                            <p className="text-xs text-gray-500 font-mono">Money back guarantee</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
