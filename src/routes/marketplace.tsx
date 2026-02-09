import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select'
import {
    Plus,
    Search,
    Loader2,
    Store,
    Eye,
    Filter,
    Grid,
    List,
    UserCheck
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import {
    usedProductService,
    sellerProfileService,
    sellerRequestService,
    type UsedProduct,
    type SellerRequest
} from '../lib/marketplace'
import { SellerRequestDialog } from '../components/SellerRequestDialog'
import { UsedProductFormDialog } from '../components/UsedProductFormDialog'
import { Breadcrumbs } from '../components/Breadcrumbs'

export const Route = createFileRoute('/marketplace')({
    component: MarketplacePage,
})

const CATEGORIES = [
    'All',
    'NES',
    'SNES',
    'Nintendo 64',
    'GameCube',
    'Wii',
    'Game Boy',
    'Nintendo DS',
    'Sega Genesis',
    'Sega Saturn',
    'Dreamcast',
    'PlayStation',
    'PlayStation 2',
    'PlayStation 3',
    'PSP',
    'Xbox',
    'Xbox 360',
    'Atari',
    'Neo Geo',
    'TurboGrafx-16',
    'Accessories',
    'Games',
    'Other'
]

const CONDITIONS: Record<string, { label: string; color: string }> = {
    new: { label: 'New', color: 'bg-green-500' },
    like_new: { label: 'Like New', color: 'bg-emerald-500' },
    good: { label: 'Good', color: 'bg-blue-500' },
    fair: { label: 'Fair', color: 'bg-yellow-500' },
    poor: { label: 'Poor', color: 'bg-orange-500' }
}

function MarketplacePage() {
    const { user } = useAuth()
    const [products, setProducts] = useState<UsedProduct[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const [isSeller, setIsSeller] = useState(false)
    const [sellerRequest, setSellerRequest] = useState<SellerRequest | null>(null)
    const [sellerRequestDialogOpen, setSellerRequestDialogOpen] = useState(false)
    const [productFormOpen, setProductFormOpen] = useState(false)

    useEffect(() => {
        loadProducts()
        if (user) {
            checkSellerStatus()
        }
    }, [user])

    async function loadProducts() {
        try {
            setLoading(true)
            const data = await usedProductService.getApprovedProducts()
            setProducts(data)
        } catch (error) {
            console.error('Error loading products:', error)
        } finally {
            setLoading(false)
        }
    }

    async function checkSellerStatus() {
        try {
            const isSellerStatus = await sellerProfileService.isSeller()
            setIsSeller(isSellerStatus)

            if (!isSellerStatus) {
                const request = await sellerRequestService.getUserRequest()
                setSellerRequest(request)

                // If request was approved but profile check failed, force refresh
                if (request && request.status === 'approved') {
                    // Small delay then recheck - profile might have just been created
                    setTimeout(async () => {
                        const recheck = await sellerProfileService.isSeller()
                        if (recheck) {
                            setIsSeller(true)
                            setSellerRequest(null)
                        }
                    }, 500)
                }
            } else {
                setSellerRequest(null)
            }
        } catch (error) {
            console.error('Error checking seller status:', error)
        }
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const handleBecomeSeller = () => {
        if (!user) {
            // Show login dialog - for now just alert
            alert('Please login first')
            return
        }
        setSellerRequestDialogOpen(true)
    }

    const handleAddProduct = () => {
        if (!isSeller) {
            handleBecomeSeller()
            return
        }
        setProductFormOpen(true)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs items={[{ label: 'Marketplace' }]} />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Store className="h-8 w-8 text-primary" />
                        Marketplace
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Buy and sell pre-owned retro gaming gear from trusted sellers
                    </p>
                </div>

                <div className="flex gap-2">
                    {user && isSeller && (
                        <Button onClick={handleAddProduct}>
                            <Plus className="w-4 h-4 mr-2" />
                            List Item
                        </Button>
                    )}
                    {user && !isSeller && (
                        <Button onClick={handleBecomeSeller} variant={sellerRequest ? 'outline' : 'default'}>
                            <UserCheck className="w-4 h-4 mr-2" />
                            {sellerRequest ? 'Seller Status' : 'Become a Seller'}
                        </Button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                    <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No products found</h2>
                    <p className="text-muted-foreground mb-6">
                        {searchQuery || selectedCategory !== 'All'
                            ? 'Try adjusting your search or filters'
                            : 'Be the first to list a product on our marketplace!'}
                    </p>
                    {user && isSeller && (
                        <Button onClick={handleAddProduct}>
                            <Plus className="w-4 h-4 mr-2" />
                            List Your First Item
                        </Button>
                    )}
                </div>
            ) : (
                <div className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'flex flex-col gap-4'
                }>
                    {filteredProducts.map(product => (
                        <MarketplaceProductCard
                            key={product.$id}
                            product={product}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            )}

            {/* Dialogs */}
            <SellerRequestDialog
                open={sellerRequestDialogOpen}
                onOpenChange={setSellerRequestDialogOpen}
                existingRequest={sellerRequest}
                onSuccess={() => {
                    checkSellerStatus()
                }}
            />

            <UsedProductFormDialog
                open={productFormOpen}
                onOpenChange={setProductFormOpen}
                onSuccess={() => {
                    loadProducts()
                }}
            />
        </div>
    )
}

interface MarketplaceProductCardProps {
    product: UsedProduct
    viewMode: 'grid' | 'list'
}

function MarketplaceProductCard({ product, viewMode }: MarketplaceProductCardProps) {
    const condition = CONDITIONS[product.condition] || CONDITIONS.good

    if (viewMode === 'list') {
        return (
            <Link to="/used-product/$productId" params={{ productId: product.$id! }}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                                    <span className="text-xl font-bold text-primary whitespace-nowrap">
                                        ${product.price}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                    {product.description}
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="secondary">{product.category}</Badge>
                                    <Badge className={condition.color}>{condition.label}</Badge>
                                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {product.viewCount || 0}
                                    </span>
                                </div>
                                <div className="mt-2 text-sm text-muted-foreground">
                                    Seller: <span className="font-medium text-foreground">{product.sellerName}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        )
    }

    return (
        <Link to="/used-product/$productId" params={{ productId: product.$id! }}>
            <Card className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden h-full">
                <div className="aspect-square relative overflow-hidden">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                        <Badge className={condition.color}>{condition.label}</Badge>
                    </div>
                    <div className="absolute top-2 right-2 bg-background/80 rounded px-2 py-1 text-xs flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {product.viewCount || 0}
                    </div>
                </div>
                <CardContent className="p-4">
                    <div className="mb-2">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                            {product.description}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <Badge variant="secondary">{product.category}</Badge>
                        <span className="text-lg font-bold text-primary">${product.price}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                        by <span className="font-medium text-foreground">{product.sellerName}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
