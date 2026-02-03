import { ShoppingCart, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
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
    const { items, updateQuantity, removeFromCart, getCartTotal, getCartCount, clearCart } = useCart()
    const cartCount = getCartCount()
    const cartTotal = getCartTotal()

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                    >
                        {cartCount}
                    </Badge>
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Shopping Cart
                    </SheetTitle>
                    <SheetDescription>
                        {cartCount === 0
                            ? 'Your cart is empty'
                            : `You have ${cartCount} item${cartCount !== 1 ? 's' : ''} in your cart`}
                    </SheetDescription>
                </SheetHeader>

                {cartCount === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                        <div className="p-6 rounded-full bg-muted">
                            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Your cart is empty</h3>
                            <p className="text-muted-foreground text-sm">
                                Add some retro games and consoles to get started!
                            </p>
                        </div>
                        <SheetTrigger asChild>
                            <Button asChild>
                                <Link to="/products">
                                    Browse Products
                                </Link>
                            </Button>
                        </SheetTrigger>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.product.$id}
                                    className="flex gap-4 bg-muted/50 rounded-lg p-3"
                                >
                                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-background flex-shrink-0">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm line-clamp-2 leading-tight">
                                            {item.product.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {item.product.category}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() =>
                                                        updateQuantity(item.product.$id!, item.quantity - 1)
                                                    }
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm font-medium">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() =>
                                                        updateQuantity(item.product.$id!, item.quantity + 1)
                                                    }
                                                    disabled={item.quantity >= item.product.stock}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-primary">
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                                    onClick={() => removeFromCart(item.product.$id!)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <SheetFooter className="flex-col gap-2 sm:flex-col">
                                <SheetTrigger asChild>
                                    <Button asChild className="w-full" size="lg">
                                        <Link to="/checkout">
                                            Checkout
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                </SheetTrigger>
                                <div className="flex gap-2 w-full">
                                    <SheetTrigger asChild>
                                        <Button variant="outline" asChild className="flex-1">
                                            <Link to="/cart">View Cart</Link>
                                        </Button>
                                    </SheetTrigger>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={clearCart}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </SheetFooter>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
