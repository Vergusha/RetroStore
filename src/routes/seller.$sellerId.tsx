import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import {
    Loader2,
    ArrowLeft,
    Star,
    Package,
    MapPin,
    Calendar,
    MessageCircle,
    User
} from 'lucide-react'
import { Breadcrumbs } from '../components/Breadcrumbs'
import {
    usedProductService,
    sellerProfileService,
    reviewService,
    type UsedProduct,
    type SellerProfile,
    type SellerReview
} from '../lib/marketplace'

export const Route = createFileRoute('/seller/$sellerId')({
    component: SellerProfilePage,
})

const CONDITIONS: Record<string, { label: string; color: string }> = {
    new: { label: 'New', color: 'bg-green-500' },
    like_new: { label: 'Like New', color: 'bg-emerald-500' },
    good: { label: 'Good', color: 'bg-blue-500' },
    fair: { label: 'Fair', color: 'bg-yellow-500' },
    poor: { label: 'Poor', color: 'bg-orange-500' }
}

function SellerProfilePage() {
    const navigate = useNavigate()
    const { sellerId } = Route.useParams()

    const [profile, setProfile] = useState<SellerProfile | null>(null)
    const [products, setProducts] = useState<UsedProduct[]>([])
    const [reviews, setReviews] = useState<SellerReview[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadSellerData()
    }, [sellerId])

    async function loadSellerData() {
        try {
            setLoading(true)

            // Load seller profile
            const sellerProfile = await sellerProfileService.getProfileByUserId(sellerId)
            if (!sellerProfile) {
                navigate({ to: '/marketplace' })
                return
            }
            setProfile(sellerProfile)

            // Load seller's products
            const allProducts = await usedProductService.getApprovedProducts(100)
            const sellerProducts = allProducts.filter(p => p.sellerId === sellerId)
            setProducts(sellerProducts)

            // Load reviews
            const sellerReviews = await reviewService.getSellerReviews(sellerId)
            setReviews(sellerReviews)
        } catch (error) {
            console.error('Error loading seller data:', error)
            navigate({ to: '/marketplace' })
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">Seller Not Found</h1>
                <p className="text-muted-foreground mb-8">
                    This seller profile doesn't exist or has been removed.
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

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs
                items={[
                    { label: 'Marketplace', href: '/marketplace' },
                    { label: profile.displayName }
                ]}
            />

            {/* Seller Header */}
            <Card className="mb-8">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.displayName}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <User className="w-12 h-12 text-primary" />
                            )}
                        </div>

                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-2">{profile.displayName}</h1>
                            {profile.bio && (
                                <p className="text-muted-foreground mb-3">{profile.bio}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-semibold">
                                        {profile.rating > 0 ? profile.rating.toFixed(1) : 'New'}
                                    </span>
                                    <span className="text-muted-foreground">
                                        ({profile.reviewCount} reviews)
                                    </span>
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Package className="h-4 w-4" />
                                    {profile.totalSales} sales
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {profile.city}, {profile.country}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    Seller since {new Date(profile.$createdAt!).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 text-center">
                            <div className="text-3xl font-bold text-primary">{products.length}</div>
                            <div className="text-sm text-muted-foreground">Active Listings</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Listings */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Active Listings ({products.length})
                    </h2>

                    {products.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                This seller has no active listings at the moment.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {products.map(product => (
                                <Link
                                    key={product.$id}
                                    to="/marketplace/$productId"
                                    params={{ productId: product.$id! }}
                                >
                                    <Card className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden">
                                        <div className="aspect-video relative overflow-hidden">
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-2 left-2">
                                                <Badge className={CONDITIONS[product.condition]?.color}>
                                                    {CONDITIONS[product.condition]?.label}
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold truncate">{product.name}</h3>
                                            <div className="flex items-center justify-between mt-2">
                                                <Badge variant="secondary">{product.category}</Badge>
                                                <span className="text-lg font-bold text-primary">
                                                    ${product.price}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reviews */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Reviews ({reviews.length})
                    </h2>

                    {reviews.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                No reviews yet.
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-4">
                                {/* Rating Summary */}
                                <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold">
                                            {profile.rating > 0 ? profile.rating.toFixed(1) : '-'}
                                        </div>
                                        <div className="flex items-center gap-1 justify-center">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.round(profile.rating)
                                                        ? 'text-yellow-500 fill-yellow-500'
                                                        : 'text-muted-foreground'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {reviews.length} reviews
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        {[5, 4, 3, 2, 1].map(stars => {
                                            const count = reviews.filter(r => Math.round(r.rating) === stars).length
                                            const percentage = reviews.length > 0
                                                ? (count / reviews.length) * 100
                                                : 0
                                            return (
                                                <div key={stars} className="flex items-center gap-2 text-sm">
                                                    <span className="w-3">{stars}</span>
                                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-yellow-500"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="w-8 text-muted-foreground">{count}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Review List */}
                                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                    {reviews.map(review => (
                                        <div key={review.$id} className="border-b pb-4 last:border-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium">{review.buyerName}</span>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-3 w-3 ${i < review.rating
                                                                ? 'text-yellow-500 fill-yellow-500'
                                                                : 'text-muted-foreground'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {new Date(review.$createdAt!).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
