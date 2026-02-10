import { ShoppingCart, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { useCart } from '../contexts/CartContext'
import { Link } from '@tanstack/react-router'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from './ui/sheet'

export function CartSheet() {
    const { items, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart()
    const cartCount = getCartCount()
    const cartTotal = getCartTotal()

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    className="relative bg-black border-2 border-primary text-primary hover:bg-primary hover:text-black font-bold gap-2 hidden sm:flex rounded-none h-10 px-6 transition-all duration-200"
                    style={{
                        fontFamily: '"Press Start 2P", cursive',
                        fontSize: '0.75rem',
                        boxShadow: '4px 4px 0 0 rgba(0, 255, 0, 0.5)'
                    }}
                >
                    <ShoppingCart className="w-4 h-4" />
                    CART
                    {cartCount > 0 && (
                        <div
                            className="absolute -top-3 -right-3 h-6 w-6 flex items-center justify-center bg-secondary text-black border-2 border-black z-10"
                            style={{
                                fontFamily: '"Press Start 2P", cursive',
                                fontSize: '0.6rem'
                            }}
                        >
                            {cartCount}
                        </div>
                    )}
                </Button>
            </SheetTrigger>
            <SheetTrigger asChild>
                {/* Mobile Trigger */}
                <Button variant="ghost" size="icon" className="relative sm:hidden text-primary hover:text-secondary hover:bg-transparent">
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                        <div
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-secondary text-black text-[10px] border border-black"
                            style={{ fontFamily: '"Press Start 2P", cursive' }}
                        >
                            {cartCount}
                        </div>
                    )}
                </Button>
            </SheetTrigger>

            <SheetContent className="flex flex-col border-l-4 border-primary bg-black text-white w-full sm:max-w-lg p-0 gap-0">
                <SheetHeader className="p-6 border-b border-gray-800 bg-gray-950/50">
                    <SheetTitle className="flex items-center gap-3 text-primary uppercase" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1rem' }}>
                        <ShoppingCart className="w-5 h-5" />
                        YOUR CART
                    </SheetTitle>
                    <SheetDescription className="text-gray-400 font-mono text-xs">
                        {cartCount === 0
                            ? 'SYSTEM EMPTY'
                            : `LOADED ITEMS: ${cartCount}`}
                    </SheetDescription>
                </SheetHeader>

                {cartCount === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center p-8">
                        <div className="p-6 border-4 border-gray-800 rounded-none bg-gray-900/50">
                            <ShoppingBag className="w-12 h-12 text-gray-600" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-gray-400 uppercase" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>
                                NO ITEMS FOUND
                            </h3>
                            <p className="text-gray-600 font-mono text-xs max-w-[200px] mx-auto">
                                INSERT CARTRIDGE TO CONTINUE
                            </p>
                        </div>
                        <SheetTrigger asChild>
                            <Button asChild className="rounded-none bg-primary text-black hover:bg-primary/80 border-2 border-transparent hover:border-white">
                                <Link to="/products" className="font-bold" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.7rem' }}>
                                    BROWSE CATALOG
                                </Link>
                            </Button>
                        </SheetTrigger>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.map((item) => (
                                <div
                                    key={item.product.$id}
                                    className="flex gap-4 group relative"
                                >
                                    {/* Item Image */}
                                    <div className="relative w-20 h-20 border-2 border-gray-700 group-hover:border-secondary transition-colors bg-gray-900 flex-shrink-0">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div>
                                            <h4 className="text-white uppercase truncate pr-6" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.7rem', lineHeight: '1.4' }}>
                                                {item.product.name}
                                            </h4>
                                            <p className="text-[10px] text-primary mt-1 uppercase tracking-wider">
                                                {item.product.category}
                                            </p>
                                        </div>

                                        <div className="flex items-end justify-between mt-2">
                                            <div className="flex items-center border border-gray-700 bg-gray-950">
                                                <button
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                                                    onClick={() => updateQuantity(item.product.$id!, item.quantity - 1)}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center text-xs font-mono text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                                                    onClick={() => updateQuantity(item.product.$id!, item.quantity + 1)}
                                                    disabled={item.quantity >= item.product.stock}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <span className="block text-secondary" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        className="absolute top-0 right-0 p-1 text-gray-600 hover:text-destructive transition-colors"
                                        onClick={() => removeFromCart(item.product.$id!)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-gray-900/50 border-t border-gray-800 space-y-6">
                            <div className="space-y-4 font-mono text-sm">
                                <div className="flex justify-between text-gray-400 uppercase text-xs tracking-wider">
                                    <span>Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 uppercase text-xs tracking-wider">
                                    <span>Shipping</span>
                                    <span className="text-primary">FREE</span>
                                </div>
                                <div className="h-px bg-gray-800 my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="text-white uppercase" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>Total</span>
                                    <span className="text-secondary" style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '1.2rem', textShadow: '0 0 10px rgba(255, 0, 255, 0.5)' }}>${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <SheetFooter className="flex-col gap-3 sm:flex-col sm:space-x-0">
                                <SheetTrigger asChild>
                                    <Button asChild className="w-full bg-secondary text-black hover:bg-secondary/90 rounded-none border-2 border-transparent h-12">
                                        <Link to="/checkout" className="flex items-center justify-center gap-2">
                                            <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.8rem' }}>CHECKOUT</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                </SheetTrigger>
                                <SheetTrigger asChild>
                                    <Button variant="outline" asChild className="w-full border-2 border-gray-700 text-gray-400 hover:text-white hover:border-white hover:bg-transparent rounded-none h-10">
                                        <Link to="/cart">
                                            <span style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '0.6rem' }}>VIEW FULL CART</span>
                                        </Link>
                                    </Button>
                                </SheetTrigger>
                            </SheetFooter>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
