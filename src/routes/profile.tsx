import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
    User,
    Mail,
    Package,
    Settings,
    LogOut,
    Edit2,
    Save,
    X,
    Loader2,
    ShoppingBag,
    Receipt,
    Store,
    DollarSign,
    Star,
    Clock,
    TrendingUp,
    Eye,
    Plus,
    Truck,
    CheckCircle
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../components/ui/dialog'
import { Textarea } from '../components/ui/textarea'
import { Alert, AlertDescription } from '../components/ui/alert'
import { useAuth } from '../contexts/AuthContext'
import { orderService, type Order } from '../lib/orders'
import {
    sellerProfileService,
    sellerRequestService,
    usedProductService,
    marketplaceOrderService,
    transactionService,
    reviewService,
    type SellerProfile,
    type SellerRequest,
    type UsedProduct,
    type MarketplaceOrder,
    type SellerTransaction
} from '../lib/marketplace'
import { account } from '../lib/appwrite'
import { SellerRequestDialog } from '../components/SellerRequestDialog'
import { UsedProductFormDialog } from '../components/UsedProductFormDialog'

export const Route = createFileRoute('/profile')({
    component: ProfilePage,
})

function ProfilePage() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [recentOrders, setRecentOrders] = useState<Order[]>([])
    const [loadingOrders, setLoadingOrders] = useState(true)
    const [editedName, setEditedName] = useState(user?.name || '')

    // Seller state
    const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null)
    const [sellerRequest, setSellerRequest] = useState<SellerRequest | null>(null)
    const [myProducts, setMyProducts] = useState<UsedProduct[]>([])
    const [mySellerOrders, setMySellerOrders] = useState<MarketplaceOrder[]>([])
    const [myPurchases, setMyPurchases] = useState<MarketplaceOrder[]>([])
    const [transactions, setTransactions] = useState<SellerTransaction[]>([])
    const [loadingSeller, setLoadingSeller] = useState(true)

    // Dialogs
    const [sellerRequestDialogOpen, setSellerRequestDialogOpen] = useState(false)
    const [productFormOpen, setProductFormOpen] = useState(false)
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
    const [selectedOrderForReview, setSelectedOrderForReview] = useState<MarketplaceOrder | null>(null)
    const [reviewRating, setReviewRating] = useState(5)
    const [reviewComment, setReviewComment] = useState('')
    const [submittingReview, setSubmittingReview] = useState(false)

    useEffect(() => {
        if (!user) {
            navigate({ to: '/' })
            return
        }

        loadRecentOrders()
        loadSellerData()
    }, [user, navigate])

    async function loadRecentOrders() {
        try {
            const orders = await orderService.getUserOrders()
            setRecentOrders(orders.slice(0, 3))
        } catch (error) {
            console.error('Error loading orders:', error)
        } finally {
            setLoadingOrders(false)
        }
    }

    async function loadSellerData() {
        try {
            setLoadingSeller(true)

            // Check if user is a seller
            const profile = await sellerProfileService.getMyProfile()
            setSellerProfile(profile)

            if (profile) {
                // Load seller-specific data
                const [products, sellerOrders, purchases, txns] = await Promise.all([
                    usedProductService.getMyProducts(),
                    marketplaceOrderService.getSellerOrders(),
                    marketplaceOrderService.getBuyerOrders(),
                    transactionService.getMyTransactions()
                ])
                setMyProducts(products)
                setMySellerOrders(sellerOrders)
                setMyPurchases(purchases)
                setTransactions(txns)
            } else {
                // Check for pending seller request
                const request = await sellerRequestService.getUserRequest()
                setSellerRequest(request)

                // Load purchases only
                try {
                    const purchases = await marketplaceOrderService.getBuyerOrders()
                    setMyPurchases(purchases)
                } catch (e) {
                    // User might not have any purchases
                }
            }
        } catch (error) {
            console.error('Error loading seller data:', error)
        } finally {
            setLoadingSeller(false)
        }
    }

    const handleSaveName = async () => {
        if (!editedName.trim()) return

        setIsSaving(true)
        try {
            await account.updateName(editedName)
            setIsEditing(false)
            window.location.reload()
        } catch (error) {
            console.error('Error updating name:', error)
            alert('Failed to update name')
        } finally {
            setIsSaving(false)
        }
    }

    const handleLogout = async () => {
        try {
            await logout()
            navigate({ to: '/' })
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const handleConfirmDelivery = async (order: MarketplaceOrder) => {
        try {
            await marketplaceOrderService.confirmDelivery(order.$id!)
            // Open review dialog
            setSelectedOrderForReview(order)
            setReviewDialogOpen(true)
            await loadSellerData()
        } catch (error) {
            console.error('Error confirming delivery:', error)
        }
    }

    const handleSubmitReview = async () => {
        if (!selectedOrderForReview || !reviewComment.trim()) return

        setSubmittingReview(true)
        try {
            await reviewService.createReview({
                orderId: selectedOrderForReview.$id!,
                sellerId: selectedOrderForReview.sellerId,
                rating: reviewRating,
                comment: reviewComment
            })
            setReviewDialogOpen(false)
            setSelectedOrderForReview(null)
            setReviewRating(5)
            setReviewComment('')
        } catch (error) {
            console.error('Error submitting review:', error)
        } finally {
            setSubmittingReview(false)
        }
    }

    const handleShipOrder = async (orderId: string) => {
        const trackingNumber = prompt('Enter tracking number (optional):')
        try {
            await marketplaceOrderService.updateOrderStatus(orderId, 'shipped', trackingNumber || undefined)
            await loadSellerData()
        } catch (error) {
            console.error('Error updating order:', error)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'processing':
            case 'paid':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'shipped':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
            case 'delivered':
            case 'confirmed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <div className="p-8 rounded-full bg-muted inline-flex mb-6">
                        <User className="w-16 h-16 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Please log in</h1>
                    <p className="text-muted-foreground mb-8">
                        You need to be logged in to view your profile.
                    </p>
                    <Button asChild size="lg">
                        <Link to="/">Go Home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Account Information
                                </span>
                                {!isEditing ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setEditedName(user.name)
                                            setIsEditing(true)
                                        }}
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsEditing(false)}
                                            disabled={isSaving}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleSaveName}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="w-10 h-10 text-primary" />
                                </div>
                                <div className="flex-1">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="text-xl font-semibold">{user.name}</h2>
                                            <p className="text-muted-foreground flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {user.email}
                                            </p>
                                            {sellerProfile && (
                                                <Badge className="mt-2 bg-green-100 text-green-800">
                                                    <Store className="w-3 h-3 mr-1" />
                                                    Verified Seller
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground text-sm">Member Since</Label>
                                    <p className="font-medium">January 2026</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-sm">Total Orders</Label>
                                    <p className="font-medium">{recentOrders.length} orders</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Seller Dashboard or Become Seller */}
                    {sellerProfile ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <Store className="w-5 h-5" />
                                        Seller Dashboard
                                    </span>
                                    <Button onClick={() => setProductFormOpen(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        List Product
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Seller Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="text-center p-4 bg-muted rounded-lg">
                                        <DollarSign className="w-6 h-6 mx-auto text-green-600 mb-2" />
                                        <p className="text-2xl font-bold">${sellerProfile.balance.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground">Available</p>
                                    </div>
                                    <div className="text-center p-4 bg-muted rounded-lg">
                                        <Clock className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
                                        <p className="text-2xl font-bold">${sellerProfile.pendingBalance.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground">Pending</p>
                                    </div>
                                    <div className="text-center p-4 bg-muted rounded-lg">
                                        <TrendingUp className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                                        <p className="text-2xl font-bold">{sellerProfile.totalSales}</p>
                                        <p className="text-xs text-muted-foreground">Total Sales</p>
                                    </div>
                                    <div className="text-center p-4 bg-muted rounded-lg">
                                        <Star className="w-6 h-6 mx-auto text-yellow-500 mb-2" />
                                        <p className="text-2xl font-bold">
                                            {sellerProfile.rating > 0 ? sellerProfile.rating.toFixed(1) : '-'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {sellerProfile.reviewCount} reviews
                                        </p>
                                    </div>
                                </div>

                                <Tabs defaultValue="products">
                                    <TabsList className="w-full justify-start">
                                        <TabsTrigger value="products">My Listings</TabsTrigger>
                                        <TabsTrigger value="sales">Sales</TabsTrigger>
                                        <TabsTrigger value="purchases">Purchases</TabsTrigger>
                                        <TabsTrigger value="transactions">Transactions</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="products" className="mt-4">
                                        {myProducts.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p>No products listed yet</p>
                                                <Button onClick={() => setProductFormOpen(true)} className="mt-4">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    List Your First Product
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {myProducts.map(product => (
                                                    <div key={product.$id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium">{product.name}</p>
                                                            <p className="text-sm text-muted-foreground">${product.price}</p>
                                                        </div>
                                                        <Badge className={getStatusColor(product.status)}>
                                                            {product.status}
                                                        </Badge>
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <Eye className="w-4 h-4" />
                                                            {product.viewCount || 0}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="sales" className="mt-4">
                                        {mySellerOrders.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p>No sales yet</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {mySellerOrders.map(order => (
                                                    <div key={order.$id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                                                        <img
                                                            src={order.productImage}
                                                            alt={order.productName}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium">{order.productName}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                Buyer: {order.buyerName}
                                                            </p>
                                                        </div>
                                                        <Badge className={getStatusColor(order.status)}>
                                                            {order.status}
                                                        </Badge>
                                                        <span className="font-bold text-primary">${order.productPrice}</span>
                                                        {order.status === 'paid' && (
                                                            <Button size="sm" onClick={() => handleShipOrder(order.$id!)}>
                                                                <Truck className="w-4 h-4 mr-1" />
                                                                Ship
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="purchases" className="mt-4">
                                        {myPurchases.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p>No marketplace purchases yet</p>
                                                <Button asChild className="mt-4">
                                                    <Link to="/marketplace">Browse Marketplace</Link>
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {myPurchases.map(order => (
                                                    <div key={order.$id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                                                        <img
                                                            src={order.productImage}
                                                            alt={order.productName}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium">{order.productName}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                Seller: {order.sellerName}
                                                            </p>
                                                        </div>
                                                        <Badge className={getStatusColor(order.status)}>
                                                            {order.status}
                                                        </Badge>
                                                        <span className="font-bold">${order.productPrice}</span>
                                                        {(order.status === 'shipped' || order.status === 'delivered') && (
                                                            <Button size="sm" onClick={() => handleConfirmDelivery(order)}>
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                Confirm
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="transactions" className="mt-4">
                                        {transactions.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p>No transactions yet</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {transactions.map(txn => (
                                                    <div key={txn.$id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                                        <div>
                                                            <p className="font-medium">{txn.description}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {new Date(txn.$createdAt!).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`font-bold ${txn.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {txn.amount >= 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Balance: ${txn.balanceAfter.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Store className="w-5 h-5" />
                                    Become a Seller
                                </CardTitle>
                                <CardDescription>
                                    Start selling your retro gaming gear on our marketplace
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sellerRequest ? (
                                    <Alert>
                                        <AlertDescription className="flex items-center justify-between">
                                            <span>
                                                {sellerRequest.status === 'pending' && 'Your seller request is being reviewed...'}
                                                {sellerRequest.status === 'rejected' && `Your request was rejected: ${sellerRequest.adminNote}`}
                                            </span>
                                            <Button variant="outline" onClick={() => setSellerRequestDialogOpen(true)}>
                                                View Status
                                            </Button>
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <div className="text-center py-4">
                                        <Store className="w-12 h-12 mx-auto mb-4 text-primary" />
                                        <p className="text-muted-foreground mb-4">
                                            Join our community of verified sellers and start earning money from your collection!
                                        </p>
                                        <Button onClick={() => setSellerRequestDialogOpen(true)}>
                                            Apply to Become a Seller
                                        </Button>
                                    </div>
                                )}

                                {/* Show marketplace purchases even if not a seller */}
                                {myPurchases.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="font-semibold mb-3">Your Marketplace Purchases</h4>
                                        <div className="space-y-3">
                                            {myPurchases.slice(0, 3).map(order => (
                                                <div key={order.$id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                                                    <img
                                                        src={order.productImage}
                                                        alt={order.productName}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium">{order.productName}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            from {order.sellerName}
                                                        </p>
                                                    </div>
                                                    <Badge className={getStatusColor(order.status)}>
                                                        {order.status}
                                                    </Badge>
                                                    {(order.status === 'shipped' || order.status === 'delivered') && (
                                                        <Button size="sm" onClick={() => handleConfirmDelivery(order)}>
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Confirm
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent Store Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Recent Store Orders
                                </span>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/orders">View All</Link>
                                </Button>
                            </CardTitle>
                            <CardDescription>
                                Your most recent purchases from our store
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingOrders ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : recentOrders.length === 0 ? (
                                <div className="text-center py-8">
                                    <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No orders yet</p>
                                    <Button asChild className="mt-4">
                                        <Link to="/products">Start Shopping</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <div
                                            key={order.$id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-2">
                                                    {order.items?.slice(0, 3).map((item, index) => (
                                                        <div
                                                            key={item.$id || index}
                                                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-background"
                                                        >
                                                            <img
                                                                src={item.productImage}
                                                                alt={item.productName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {order.items?.length} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(order.$createdAt || '').toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status}
                                                </Badge>
                                                <span className="font-semibold text-primary">
                                                    ${order.totalAmount.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link to="/orders">
                                    <Receipt className="w-4 h-4 mr-2" />
                                    Order History
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link to="/marketplace">
                                    <Store className="w-4 h-4 mr-2" />
                                    Marketplace
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link to="/products">
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    Browse Products
                                </Link>
                            </Button>
                            <Separator className="my-4" />
                            <Button
                                variant="destructive"
                                className="w-full justify-start"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Dialogs */}
            <SellerRequestDialog
                open={sellerRequestDialogOpen}
                onOpenChange={setSellerRequestDialogOpen}
                existingRequest={sellerRequest}
                onSuccess={loadSellerData}
            />

            <UsedProductFormDialog
                open={productFormOpen}
                onOpenChange={setProductFormOpen}
                onSuccess={loadSellerData}
            />

            {/* Review Dialog */}
            <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Leave a Review</DialogTitle>
                        <DialogDescription>
                            How was your experience with this seller?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Rating</Label>
                            <div className="flex gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        onClick={() => setReviewRating(star)}
                                        className="p-1"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= reviewRating
                                                    ? 'text-yellow-500 fill-yellow-500'
                                                    : 'text-muted-foreground'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="reviewComment">Your Review</Label>
                            <Textarea
                                id="reviewComment"
                                placeholder="Share your experience..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                            Skip
                        </Button>
                        <Button onClick={handleSubmitReview} disabled={submittingReview || !reviewComment.trim()}>
                            {submittingReview && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Submit Review
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
