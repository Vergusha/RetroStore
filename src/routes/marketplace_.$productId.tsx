import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Separator } from '../components/ui/separator'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog'
import {
    Loader2,
    ArrowLeft,
    ShoppingCart,
    Star,
    Eye,
    MessageCircle,
    User,
    MapPin,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Share2,
    AlertCircle,
    CheckCircle,
    Package
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Breadcrumbs } from '../components/Breadcrumbs'
import {
    usedProductService,
    sellerProfileService,
    marketplaceOrderService,
    reviewService,
    type UsedProduct,
    type SellerProfile,
    type SellerReview
} from '../lib/marketplace'
import { Alert, AlertDescription } from '../components/ui/alert'

export const Route = createFileRoute('/marketplace_/$productId')({
    component: MarketplaceProductPage,
})

const CONDITIONS: Record<string, { label: string; color: string; description: string }> = {
    new: { label: 'New', color: 'bg-green-500', description: 'Brand new, sealed in original packaging' },
    like_new: { label: 'Like New', color: 'bg-emerald-500', description: 'Opened but barely used, like new condition' },
    good: { label: 'Good', color: 'bg-blue-500', description: 'Used but in good working condition with minor wear' },
    fair: { label: 'Fair', color: 'bg-yellow-500', description: 'Shows signs of use, but fully functional' },
    poor: { label: 'Poor', color: 'bg-orange-500', description: 'Heavy wear, may have cosmetic damage' }
}

function MarketplaceProductPage() {
    const navigate = useNavigate()
    const { productId } = Route.useParams()
    const { user } = useAuth()

    const [product, setProduct] = useState<UsedProduct | null>(null)
    const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null)
    const [sellerReviews, setSellerReviews] = useState<SellerReview[]>([])
    const [loading, setLoading] = useState(true)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [buyDialogOpen, setBuyDialogOpen] = useState(false)
    const [purchasing, setPurchasing] = useState(false)
    const [purchaseError, setPurchaseError] = useState<string | null>(null)
    const [purchaseSuccess, setPurchaseSuccess] = useState(false)

    // Shipping form
    const [shippingAddress, setShippingAddress] = useState('')
    const [shippingCity, setShippingCity] = useState('')
    const [shippingZip, setShippingZip] = useState('')
    const [shippingCountry, setShippingCountry] = useState('')

    useEffect(() => {
        loadProduct()
    }, [productId])

    async function loadProduct() {
        try {
            setLoading(true)
            const data = await usedProductService.getProduct(productId)

            if (!data) {
                navigate({ to: '/marketplace' })
                return
            }

            setProduct(data)

            // Increment view count
            usedProductService.incrementViewCount(productId)

            // Load seller profile
            const seller = await sellerProfileService.getProfileByUserId(data.sellerId)
            setSellerProfile(seller)

            // Load seller reviews
            const reviews = await reviewService.getSellerReviews(data.sellerId)
            setSellerReviews(reviews)
        } catch (error) {
            console.error('Error loading product:', error)
            navigate({ to: '/marketplace' })
        } finally {
            setLoading(false)
        }
    }

    const handlePurchase = async () => {
        if (!user) {
            alert('Please login to purchase')
            return
        }

        if (!shippingAddress || !shippingCity || !shippingZip || !shippingCountry) {
            setPurchaseError('Please fill in all shipping details')
            return
        }

        setPurchasing(true)
        setPurchaseError(null)

        try {
            // Create order
            const order = await marketplaceOrderService.createOrder({
                productId: productId,
                shippingAddress,
                shippingCity,
                shippingZip,
                shippingCountry,
                paymentMethod: 'card'
            })

            // Simulate payment processing
            await marketplaceOrderService.processPayment(order.$id!, `pi_${Date.now()}`)

            setPurchaseSuccess(true)
        } catch (error: any) {
            setPurchaseError(error.message || 'Failed to complete purchase')
        } finally {
            setPurchasing(false)
        }
    }

    const nextImage = () => {
        if (product && currentImageIndex < product.images.length - 1) {
            setCurrentImageIndex(prev => prev + 1)
        }
    }

    const prevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
                <p className="text-muted-foreground mb-8">
                    The product you're looking for doesn't exist or has been removed.
                </p>
                <Button asChild>
                    <Link to="/marketplace">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Marketplace
                    </Link>
                </Button>
            </div>
        )
    }

    const condition = CONDITIONS[product.condition] || CONDITIONS.good
    const isOwner = user && user.$id === product.sellerId

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs
                items={[
                    { label: 'Marketplace', href: '/marketplace' },
                    { label: product.name }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Images */}
                <div className="space-y-4">
                    <div className="aspect-square relative rounded-lg overflow-hidden border bg-muted">
                        <img
                            src={product.images[currentImageIndex]}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />

                        {product.images.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                                    onClick={prevImage}
                                    disabled={currentImageIndex === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                                    onClick={nextImage}
                                    disabled={currentImageIndex === product.images.length - 1}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>

                    {product.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${index === currentImageIndex ? 'border-primary' : 'border-transparent'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{product.category}</Badge>
                            <Badge className={condition.color}>{condition.label}</Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {product.viewCount || 0} views
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                        <p className="text-4xl font-bold text-primary">${product.price}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Condition: {condition.label}</h3>
                        <p className="text-muted-foreground">{condition.description}</p>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
                    </div>

                    <Separator />

                    {/* Seller Info */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Seller Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold text-lg">{sellerProfile?.displayName || product.sellerName}</p>
                                    {sellerProfile && (
                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                {sellerProfile.rating > 0 ? sellerProfile.rating.toFixed(1) : 'New'}
                                                ({sellerProfile.reviewCount} reviews)
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Package className="h-4 w-4" />
                                                {sellerProfile.totalSales} sales
                                            </span>
                                        </div>
                                    )}
                                    {sellerProfile && (
                                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {sellerProfile.city}, {sellerProfile.country}
                                        </p>
                                    )}
                                </div>
                                <Link to="/seller/$sellerId" params={{ sellerId: product.sellerId }}>
                                    <Button variant="outline" size="sm">View Profile</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    {!isOwner && product.status === 'approved' && (
                        <Button
                            size="lg"
                            className="w-full"
                            onClick={() => setBuyDialogOpen(true)}
                        >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Buy Now - ${product.price}
                        </Button>
                    )}

                    {isOwner && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                This is your listing. You cannot purchase your own products.
                            </AlertDescription>
                        </Alert>
                    )}

                    {product.status === 'sold' && (
                        <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                                This item has been sold.
                            </AlertDescription>
                        </Alert>
                    )}

                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Listed on {new Date(product.$createdAt!).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Seller Reviews */}
            {sellerReviews.length > 0 && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Seller Reviews ({sellerReviews.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {sellerReviews.slice(0, 5).map(review => (
                                <div key={review.$id} className="border-b pb-4 last:border-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">{review.buyerName}</span>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < review.rating
                                                        ? 'text-yellow-500 fill-yellow-500'
                                                        : 'text-muted-foreground'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground">{review.comment}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(review.$createdAt!).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Purchase Dialog */}
            <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    {purchaseSuccess ? (
                        <div className="text-center py-8">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Purchase Complete!</h3>
                            <p className="text-muted-foreground mb-6">
                                Your order has been placed. The seller will be notified and will ship your item soon.
                                You can track your order in your profile.
                            </p>
                            <div className="flex gap-2 justify-center">
                                <Button variant="outline" onClick={() => navigate({ to: '/marketplace' })}>
                                    Continue Shopping
                                </Button>
                                <Button onClick={() => navigate({ to: '/profile' })}>
                                    View My Orders
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle>Complete Your Purchase</DialogTitle>
                                <DialogDescription>
                                    Enter your shipping details to complete the purchase
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                {purchaseError && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{purchaseError}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            from {product.sellerName}
                                        </p>
                                    </div>
                                    <p className="text-lg font-bold">${product.price}</p>
                                </div>

                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Street Address</Label>
                                        <Input
                                            id="address"
                                            placeholder="123 Main Street"
                                            value={shippingAddress}
                                            onChange={(e) => setShippingAddress(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                placeholder="New York"
                                                value={shippingCity}
                                                onChange={(e) => setShippingCity(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="zip">ZIP Code</Label>
                                            <Input
                                                id="zip"
                                                placeholder="10001"
                                                value={shippingZip}
                                                onChange={(e) => setShippingZip(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            placeholder="United States"
                                            value={shippingCountry}
                                            onChange={(e) => setShippingCountry(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Your payment will be held securely until you confirm receipt of the item.
                                        This protects both buyers and sellers.
                                    </AlertDescription>
                                </Alert>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setBuyDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handlePurchase} disabled={purchasing}>
                                        {purchasing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        Pay ${product.price}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
