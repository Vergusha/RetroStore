import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
    CreditCard,
    MapPin,
    ShoppingBag,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    Wallet,
    Building2,
    Lock
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { orderService } from '../lib/orders'
import { AuthDialog } from '../components/AuthDialog'

export const Route = createFileRoute('/checkout')({
    component: CheckoutPage,
})

function CheckoutPage() {
    const { items, getCartTotal, getCartCount, clearCart } = useCart()
    const { user } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [orderComplete, setOrderComplete] = useState(false)
    const [orderId, setOrderId] = useState<string | null>(null)
    const [authDialogOpen, setAuthDialogOpen] = useState(false)
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

    const [shippingInfo, setShippingInfo] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zip: '',
        country: 'USA',
        phone: ''
    })

    const [paymentMethod, setPaymentMethod] = useState('card')

    const cartTotal = getCartTotal()
    const cartCount = getCartCount()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setShippingInfo(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            setAuthDialogOpen(true)
            return
        }

        if (items.length === 0) {
            return
        }

        setIsSubmitting(true)

        try {
            const order = await orderService.createOrder(
                items,
                {
                    address: `${shippingInfo.firstName} ${shippingInfo.lastName}, ${shippingInfo.address}`,
                    city: shippingInfo.city,
                    zip: shippingInfo.zip,
                    country: shippingInfo.country
                },
                paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer'
            )

            setOrderId(order.$id!)
            setOrderComplete(true)
            clearCart()
        } catch (error) {
            console.error('Failed to create order:', error)
            alert('Failed to place order. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Order Complete Screen
    if (orderComplete && orderId) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <div className="p-6 rounded-full bg-green-100 dark:bg-green-900/30 inline-flex mb-6">
                        <CheckCircle2 className="w-16 h-16 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
                    <p className="text-muted-foreground mb-2">
                        Thank you for your order. We've sent a confirmation email to
                    </p>
                    <p className="font-medium text-lg mb-6">{user?.email}</p>

                    <Card className="text-left mb-6">
                        <CardContent className="pt-6">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Order ID</span>
                                    <span className="font-mono text-xs">{orderId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total</span>
                                    <span className="font-bold text-primary">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="text-amber-600 font-medium">Pending</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-3">
                        <Button asChild size="lg">
                            <Link to="/orders">View My Orders</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link to="/products">Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Empty Cart
    if (cartCount === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <div className="p-8 rounded-full bg-muted inline-flex mb-6">
                        <ShoppingBag className="w-16 h-16 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-8">
                        Add some products to your cart before checking out.
                    </p>
                    <Button asChild size="lg">
                        <Link to="/products">Browse Products</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" asChild className="mb-6">
                <Link to="/cart">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Cart
                </Link>
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Shipping Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Shipping Information
                                </CardTitle>
                                <CardDescription>
                                    Enter your delivery address
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            value={shippingInfo.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            value={shippingInfo.lastName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Street Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={shippingInfo.address}
                                        onChange={handleInputChange}
                                        placeholder="123 Main St, Apt 4"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={shippingInfo.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zip">ZIP Code</Label>
                                        <Input
                                            id="zip"
                                            name="zip"
                                            value={shippingInfo.zip}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            value={shippingInfo.country}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={shippingInfo.phone}
                                        onChange={handleInputChange}
                                        placeholder="+1 (555) 000-0000"
                                        required
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Payment Method
                                </CardTitle>
                                <CardDescription>
                                    Select your preferred payment method
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'card'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-muted-foreground/30'
                                            }`}
                                    >
                                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-primary' : ''}`} />
                                        <span className="font-medium text-sm">Credit Card</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('paypal')}
                                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'paypal'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-muted-foreground/30'
                                            }`}
                                    >
                                        <Wallet className={`w-6 h-6 ${paymentMethod === 'paypal' ? 'text-primary' : ''}`} />
                                        <span className="font-medium text-sm">PayPal</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('bank')}
                                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'bank'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-muted-foreground/30'
                                            }`}
                                    >
                                        <Building2 className={`w-6 h-6 ${paymentMethod === 'bank' ? 'text-primary' : ''}`} />
                                        <span className="font-medium text-sm">Bank Transfer</span>
                                    </button>
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="cardNumber">Card Number</Label>
                                            <Input
                                                id="cardNumber"
                                                placeholder="4242 4242 4242 4242"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="expiry">Expiry Date</Label>
                                                <Input
                                                    id="expiry"
                                                    placeholder="MM/YY"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cvc">CVC</Label>
                                                <Input
                                                    id="cvc"
                                                    placeholder="123"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                                    <Lock className="w-4 h-4" />
                                    <span>Your payment information is secure and encrypted</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Button (Mobile) */}
                        <div className="lg:hidden">
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>Place Order - ${cartTotal.toFixed(2)}</>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Items Preview */}
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.product.$id} className="flex gap-3">
                                        <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm line-clamp-1">
                                                {item.product.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Qty: {item.quantity}
                                            </p>
                                            <p className="text-sm font-medium text-primary">
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>$0.00</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span className="text-primary">${cartTotal.toFixed(2)}</span>
                            </div>

                            {/* Submit Button (Desktop) */}
                            <Button
                                type="submit"
                                className="w-full hidden lg:flex"
                                size="lg"
                                disabled={isSubmitting}
                                onClick={handleSubmit}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>Place Order</>
                                )}
                            </Button>

                            <p className="text-xs text-muted-foreground text-center">
                                By placing this order, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AuthDialog
                open={authDialogOpen}
                onOpenChange={setAuthDialogOpen}
                mode={authMode}
                onModeChange={setAuthMode}
            />
        </div>
    )
}
