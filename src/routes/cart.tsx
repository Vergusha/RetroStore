import { createFileRoute, Link } from '@tanstack/react-router'
import { ShoppingCart, Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '../contexts/CartContext'

export const Route = createFileRoute('/cart')({
    component: CartPage,
})

function CartPage() {
    const { items, updateQuantity, removeFromCart, getCartTotal, getCartCount, clearCart } = useCart()
    const cartCount = getCartCount()
    const cartTotal = getCartTotal()

    if (cartCount === 0) {
        return (
            <div className="min-h-screen container mx-auto px-4 py-16 text-white flex flex-col items-center justify-center">
                <div className="max-w-md mx-auto text-center space-y-6">
                    <div className="p-8 border-4 border-gray-800 bg-gray-900 inline-flex shadow-[8px_8px_0_0_#333]">
                        <ShoppingBag className="w-16 h-16 text-gray-500" />
                    </div>
                    <h1 className="text-2xl text-destructive uppercase" style={{ fontFamily: '"Press Start 2P", cursive', lineHeight: '1.5' }}>
                        Cart Empty
                    </h1>
                    <p className="text-gray-400 mb-8 font-mono">
                        INSERT COIN TO CONTINUE SHOPPING
                    </p>
                    <Button asChild size="lg" className="rounded-none bg-primary text-black hover:bg-primary/90 border-2 border-transparent">
                        <Link to="/products" className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>BROWSE GAMES</span>
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen text-white pb-20 pt-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-primary uppercase" style={{ fontFamily: '"Press Start 2P", cursive', textShadow: '4px 4px 0 rgba(0,255,0,0.2)' }}>
                            <ShoppingCart className="w-8 h-8" />
                            Shopping Cart
                        </h1>
                        <p className="text-gray-500 mt-2 font-mono uppercase tracking-widest pl-12">
                            Detected Items: {cartCount}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={clearCart}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-none border-2 border-transparent hover:border-destructive transition-all"
                        style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.7rem' }}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        EMPTY CART
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-8">
                        {items.map((item) => (
                            <div
                                key={item.product.$id}
                                className="group relative bg-gray-950 border-2 border-gray-800 hover:border-secondary transition-colors duration-300"
                            >
                                <div className="flex flex-col sm:flex-row">
                                    <div className="relative w-full sm:w-48 h-48 bg-gray-900 border-r-0 sm:border-r-2 border-gray-800 group-hover:border-secondary transition-colors">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Pixel accent */}
                                        <div className="absolute top-0 left-0 w-2 h-2 bg-primary" />
                                    </div>

                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <Link
                                                        to="/product/$productId"
                                                        params={{ productId: item.product.$id! }}
                                                        className="font-bold text-lg md:text-xl text-white hover:text-primary transition-colors line-clamp-1 uppercase tracking-wide"
                                                        style={{ fontFamily: '"Press Start 2P", cursive', lineHeight: '1.4' }}
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 font-mono uppercase">
                                                            {item.product.category}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-gray-600 hover:text-destructive rounded-none"
                                                    onClick={() => removeFromCart(item.product.$id!)}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-end justify-between mt-6 gap-4">
                                            <div className="flex items-center gap-0 border border-gray-700 bg-black">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 text-white hover:bg-gray-800 rounded-none"
                                                    onClick={() =>
                                                        updateQuantity(item.product.$id!, item.quantity - 1)
                                                    }
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <span className="w-12 text-center font-mono text-lg text-primary border-x border-gray-700">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-10 w-10 text-white hover:bg-gray-800 rounded-none"
                                                    onClick={() =>
                                                        updateQuantity(item.product.$id!, item.quantity + 1)
                                                    }
                                                    disabled={item.quantity >= item.product.stock}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xl md:text-2xl text-secondary" style={{ fontFamily: '"Press Start 2P", cursive', textShadow: '0 0 10px rgba(255, 0, 255, 0.4)' }}>
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-gray-500 font-mono mt-1">
                                                    UNIT COST: ${item.product.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-start">
                            <Link to="/products" className="group flex items-center gap-2 text-primary hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-mono uppercase tracking-widest border-b border-primary group-hover:border-white">Continue Shopping</span>
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-gray-900/80 border-t-4 border-primary p-6 backdrop-blur-sm">
                            <h2 className="text-xl text-white mb-6 uppercase" style={{ fontFamily: '"Press Start 2P", cursive' }}>
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm font-mono text-gray-400">
                                    <span className="uppercase">Subtotal ({cartCount} items)</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-mono text-gray-400">
                                    <span className="uppercase">Shipping</span>
                                    <span className="text-primary font-bold">FREE</span>
                                </div>
                                <div className="h-px bg-gray-700 my-4" />
                                <div className="flex justify-between items-center">
                                    <span className="text-white uppercase" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>Total</span>
                                    <div className="text-right">
                                        <span className="text-primary text-2xl block" style={{ fontFamily: '"Press Start 2P", cursive', textShadow: '0 0 15px rgba(0, 255, 0, 0.5)' }}>
                                            ${cartTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button asChild className="w-full h-14 bg-secondary text-black hover:bg-secondary/90 rounded-none text-lg border-2 border-transparent hover:border-white transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                                <Link to="/checkout" className="flex items-center justify-center gap-2">
                                    <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>CHECKOUT</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </Button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 font-mono">
                                <ShoppingBag className="w-3 h-3" />
                                <span>SECURE TRANSACTION ENCRYPTED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

