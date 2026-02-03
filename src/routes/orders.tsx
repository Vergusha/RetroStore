import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
    Package,
    ArrowLeft,
    Loader2,
    ShoppingBag,
    ChevronDown,
    ChevronUp,
    MapPin,
    CreditCard,
    Calendar,
    Receipt,
    Download
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { useAuth } from '../contexts/AuthContext'
import { orderService, type Order } from '../lib/orders'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../components/ui/dialog'

export const Route = createFileRoute('/orders')({
    component: OrdersPage,
})

function OrdersPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

    useEffect(() => {
        if (!user) {
            navigate({ to: '/' })
            return
        }

        loadOrders()
    }, [user, navigate])

    async function loadOrders() {
        try {
            const userOrders = await orderService.getUserOrders()
            setOrders(userOrders)
        } catch (error) {
            console.error('Error loading orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleOrder = (orderId: string) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev)
            if (newSet.has(orderId)) {
                newSet.delete(orderId)
            } else {
                newSet.add(orderId)
            }
            return newSet
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'processing':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'shipped':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
            case 'delivered':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }
    }

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'pending':
                return 1
            case 'processing':
                return 2
            case 'shipped':
                return 3
            case 'delivered':
                return 4
            default:
                return 0
        }
    }

    const downloadReceipt = (order: Order) => {
        const html = orderService.generateReceiptHTML(order)
        const blob = new Blob([html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `receipt-${order.$id}.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    if (!user) {
        return null
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading your orders...</p>
                </div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <div className="p-8 rounded-full bg-muted inline-flex mb-6">
                        <ShoppingBag className="w-16 h-16 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">No orders yet</h1>
                    <p className="text-muted-foreground mb-8">
                        You haven't placed any orders yet. Start shopping to see your order history here!
                    </p>
                    <Button asChild size="lg">
                        <Link to="/products">
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            Browse Products
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" asChild className="mb-6">
                <Link to="/profile">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Profile
                </Link>
            </Button>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Package className="w-8 h-8 text-primary" />
                        Order History
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {orders.length} order{orders.length !== 1 ? 's' : ''} placed
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.$id}>
                        <CardHeader
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleOrder(order.$id!)}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        {order.items?.slice(0, 3).map((item, index) => (
                                            <div
                                                key={item.$id || index}
                                                className="w-12 h-12 rounded-lg overflow-hidden border-2 border-background"
                                            >
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                        {(order.items?.length || 0) > 3 && (
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 border-2 border-background flex items-center justify-center text-sm font-medium">
                                                +{(order.items?.length || 0) - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">
                                            Order #{order.$id?.slice(-8).toUpperCase()}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.$createdAt || '').toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge className={getStatusColor(order.status)}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </Badge>
                                    <span className="font-bold text-lg text-primary">
                                        ${order.totalAmount.toFixed(2)}
                                    </span>
                                    {expandedOrders.has(order.$id!) ? (
                                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        {expandedOrders.has(order.$id!) && (
                            <CardContent className="pt-0">
                                <Separator className="mb-6" />

                                {/* Order Progress */}
                                {order.status !== 'cancelled' && (
                                    <div className="mb-6">
                                        <div className="flex justify-between mb-2">
                                            {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, index) => (
                                                <div
                                                    key={step}
                                                    className={`text-xs font-medium ${getStatusStep(order.status) >= index + 1
                                                        ? 'text-primary'
                                                        : 'text-muted-foreground'
                                                        }`}
                                                >
                                                    {step}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-500"
                                                style={{
                                                    width: `${(getStatusStep(order.status) / 4) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Order Items */}
                                <div className="space-y-3 mb-6">
                                    <h4 className="font-medium text-sm text-muted-foreground">Items</h4>
                                    {order.items?.map((item) => (
                                        <div
                                            key={item.$id}
                                            className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                                        >
                                            <div className="w-16 h-16 rounded-md overflow-hidden bg-background">
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Link
                                                    to="/product/$productId"
                                                    params={{ productId: item.productId }}
                                                    className="font-medium hover:text-primary transition-colors"
                                                >
                                                    {item.productName}
                                                </Link>
                                                <p className="text-sm text-muted-foreground">
                                                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <span className="font-semibold">
                                                ${(item.quantity * item.price).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Shipping Address
                                        </h4>
                                        <div className="text-sm">
                                            <p>{order.shippingAddress}</p>
                                            <p>{order.shippingCity}, {order.shippingZip}</p>
                                            <p>{order.shippingCountry}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                                            <CreditCard className="w-4 h-4" />
                                            Payment
                                        </h4>
                                        <p className="text-sm">{order.paymentMethod}</p>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <Receipt className="w-4 h-4 mr-2" />
                                                View Receipt
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2">
                                                    <Receipt className="w-5 h-5" />
                                                    Order Receipt
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Order #{order.$id?.slice(-8).toUpperCase()}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div
                                                className="mt-4"
                                                dangerouslySetInnerHTML={{
                                                    __html: orderService.generateReceiptHTML(order)
                                                }}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => downloadReceipt(order)}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Receipt
                                    </Button>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    )
}
