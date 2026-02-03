import { createFileRoute, Link } from '@tanstack/react-router'
import { ShoppingCart, Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
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
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <div className="p-8 rounded-full bg-muted inline-flex mb-6">
                        <ShoppingBag className="w-16 h-16 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-8">
                        Looks like you haven't added any retro treasures to your cart yet.
                        Browse our collection to find something special!
                    </p>
                    <Button asChild size="lg">
                        <Link to="/products">
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Browse Products
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <ShoppingCart className="w-8 h-8 text-primary" />
                        Shopping Cart
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart
                    </p>
                </div>
                <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cart
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <Card key={item.product.$id} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                                <div className="relative w-full sm:w-40 h-40 bg-muted flex-shrink-0">
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <Link
                                                    to="/product/$productId"
                                                    params={{ productId: item.product.$id! }}
                                                    className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.product.category}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive flex-shrink-0"
                                                onClick={() => removeFromCart(item.product.$id!)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                            {item.product.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() =>
                                                    updateQuantity(item.product.$id!, item.quantity - 1)
                                                }
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                            <span className="w-10 text-center font-medium">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() =>
                                                    updateQuantity(item.product.$id!, item.quantity + 1)
                                                }
                                                disabled={item.quantity >= item.product.stock}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                            {item.quantity >= item.product.stock && (
                                                <span className="text-xs text-amber-600 ml-2">
                                                    Max stock
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-primary">
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                ${item.product.price.toFixed(2)} each
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}

                    <Button variant="ghost" asChild className="gap-2">
                        <Link to="/products">
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                    </Button>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Subtotal ({cartCount} items)
                                </span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span className="text-primary">${cartTotal.toFixed(2)}</span>
                            </div>

                            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-3 text-sm text-green-700 dark:text-green-400">
                                <p className="font-medium">🎉 Free shipping on all orders!</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full" size="lg">
                                <Link to="/checkout">
                                    Proceed to Checkout
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
