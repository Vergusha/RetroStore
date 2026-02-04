import { useState, useEffect } from 'react'
import { AdminRoute } from '../components/AdminRoute'
import { productService, type Product } from '../lib/products'
import {
    sellerRequestService,
    usedProductService,
    sellerProfileService,
    type SellerRequest,
    type UsedProduct,
    type SellerProfile,
} from '../lib/marketplace'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import {
    Plus,
    Pencil,
    Trash2,
    ArrowLeft,
    Check,
    X,
    Eye,
    UserCheck,
    Store,
    Package,
    Users,
    Clock,
    AlertCircle
} from 'lucide-react'
import { ProductFormDialog } from '../components/ProductFormDialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table'
import { Badge } from '../components/ui/badge'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../components/ui/alert-dialog'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Alert, AlertDescription } from '../components/ui/alert'

export function AdminPanel() {
    const [activeTab, setActiveTab] = useState('products')

    // Store Products State
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<Product | null>(null)

    // Seller Requests State
    const [sellerRequests, setSellerRequests] = useState<SellerRequest[]>([])
    const [loadingRequests, setLoadingRequests] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState<SellerRequest | null>(null)
    const [requestDialogOpen, setRequestDialogOpen] = useState(false)
    const [rejectNote, setRejectNote] = useState('')

    // Marketplace Products State
    const [marketplaceProducts, setMarketplaceProducts] = useState<UsedProduct[]>([])
    const [loadingMarketplace, setLoadingMarketplace] = useState(false)
    const [selectedMarketplaceProduct, setSelectedMarketplaceProduct] = useState<UsedProduct | null>(null)
    const [marketplaceProductDialogOpen, setMarketplaceProductDialogOpen] = useState(false)
    const [rejectProductNote, setRejectProductNote] = useState('')

    // Sellers State
    const [sellers, setSellers] = useState<SellerProfile[]>([])
    const [loadingSellers, setLoadingSellers] = useState(false)

    // Stats
    const [pendingRequestsCount, setPendingRequestsCount] = useState(0)
    const [pendingProductsCount, setPendingProductsCount] = useState(0)

    useEffect(() => {
        loadProducts()
        loadStats()
    }, [])

    useEffect(() => {
        if (activeTab === 'seller-requests') {
            loadSellerRequests()
        } else if (activeTab === 'marketplace-products') {
            loadMarketplaceProducts()
        } else if (activeTab === 'sellers') {
            loadSellers()
        }
    }, [activeTab])

    const loadStats = async () => {
        try {
            const requests = await sellerRequestService.getPendingRequests()
            setPendingRequestsCount(requests.length)
            const products = await usedProductService.getPendingProducts()
            setPendingProductsCount(products.length)
        } catch (error) {
            console.error('Failed to load stats:', error)
        }
    }

    const loadProducts = async () => {
        try {
            setLoading(true)
            const data = await productService.getProducts()
            setProducts(data)
        } catch (error) {
            console.error('Failed to load products:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadSellerRequests = async () => {
        try {
            setLoadingRequests(true)
            const data = await sellerRequestService.getAllRequests()
            setSellerRequests(data)
        } catch (error) {
            console.error('Failed to load seller requests:', error)
        } finally {
            setLoadingRequests(false)
        }
    }

    const loadMarketplaceProducts = async () => {
        try {
            setLoadingMarketplace(true)
            const data = await usedProductService.getAllProducts()
            setMarketplaceProducts(data)
        } catch (error) {
            console.error('Failed to load marketplace products:', error)
        } finally {
            setLoadingMarketplace(false)
        }
    }

    const loadSellers = async () => {
        try {
            setLoadingSellers(true)
            const data = await sellerProfileService.getAllProfiles()
            setSellers(data)
        } catch (error) {
            console.error('Failed to load sellers:', error)
        } finally {
            setLoadingSellers(false)
        }
    }

    // Store Product Handlers
    const handleEdit = (product: Product) => {
        setSelectedProduct(product)
        setDialogOpen(true)
    }

    const handleAdd = () => {
        setSelectedProduct(null)
        setDialogOpen(true)
    }

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!productToDelete?.$id) return

        try {
            await productService.deleteProduct(productToDelete.$id)
            await loadProducts()
            setDeleteDialogOpen(false)
            setProductToDelete(null)
        } catch (error) {
            console.error('Failed to delete product:', error)
        }
    }

    // Seller Request Handlers
    const handleViewRequest = (request: SellerRequest) => {
        setSelectedRequest(request)
        setRejectNote('')
        setRequestDialogOpen(true)
    }

    const handleApproveRequest = async () => {
        if (!selectedRequest?.$id) return
        try {
            await sellerRequestService.approveRequest(selectedRequest.$id)
            setRequestDialogOpen(false)
            await loadSellerRequests()
            await loadStats()
        } catch (error) {
            console.error('Failed to approve request:', error)
        }
    }

    const handleRejectRequest = async () => {
        if (!selectedRequest?.$id || !rejectNote.trim()) return
        try {
            await sellerRequestService.rejectRequest(selectedRequest.$id, rejectNote)
            setRequestDialogOpen(false)
            await loadSellerRequests()
            await loadStats()
        } catch (error) {
            console.error('Failed to reject request:', error)
        }
    }

    // Marketplace Product Handlers
    const handleViewMarketplaceProduct = (product: UsedProduct) => {
        setSelectedMarketplaceProduct(product)
        setRejectProductNote('')
        setMarketplaceProductDialogOpen(true)
    }

    const handleApproveProduct = async () => {
        if (!selectedMarketplaceProduct?.$id) return
        try {
            await usedProductService.approveProduct(selectedMarketplaceProduct.$id)
            setMarketplaceProductDialogOpen(false)
            await loadMarketplaceProducts()
            await loadStats()
        } catch (error) {
            console.error('Failed to approve product:', error)
        }
    }

    const handleRejectProduct = async () => {
        if (!selectedMarketplaceProduct?.$id || !rejectProductNote.trim()) return
        try {
            await usedProductService.rejectProduct(selectedMarketplaceProduct.$id, rejectProductNote)
            setMarketplaceProductDialogOpen(false)
            await loadMarketplaceProducts()
            await loadStats()
        } catch (error) {
            console.error('Failed to reject product:', error)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
            case 'approved':
                return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>
            case 'rejected':
                return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>
            case 'sold':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800">Sold</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <AdminRoute>
            <div className="min-h-screen bg-muted/30">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" asChild>
                                    <a href="/">
                                        <ArrowLeft className="w-5 h-5" />
                                    </a>
                                </Button>
                                <h1 className="text-3xl font-bold">Admin Panel</h1>
                            </div>
                            <p className="text-muted-foreground">Manage your store and marketplace</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Package className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{products.length}</p>
                                    <p className="text-sm text-muted-foreground">Store Products</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{pendingRequestsCount}</p>
                                    <p className="text-sm text-muted-foreground">Pending Seller Requests</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <AlertCircle className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{pendingProductsCount}</p>
                                    <p className="text-sm text-muted-foreground">Pending Products</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{sellers.length}</p>
                                    <p className="text-sm text-muted-foreground">Active Sellers</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-6">
                            <TabsTrigger value="products" className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Store Products
                            </TabsTrigger>
                            <TabsTrigger value="seller-requests" className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4" />
                                Seller Requests
                                {pendingRequestsCount > 0 && (
                                    <Badge variant="destructive" className="ml-1">{pendingRequestsCount}</Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="marketplace-products" className="flex items-center gap-2">
                                <Store className="h-4 w-4" />
                                Marketplace Products
                                {pendingProductsCount > 0 && (
                                    <Badge variant="destructive" className="ml-1">{pendingProductsCount}</Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="sellers" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Sellers
                            </TabsTrigger>
                        </TabsList>

                        {/* Store Products Tab */}
                        <TabsContent value="products">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Products ({products.length})</CardTitle>
                                    <Button onClick={handleAdd}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Product
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                                        </div>
                                    ) : products.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No products yet. Add your first product!
                                        </div>
                                    ) : (
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[100px]">Image</TableHead>
                                                        <TableHead>Name</TableHead>
                                                        <TableHead>Category</TableHead>
                                                        <TableHead>Price</TableHead>
                                                        <TableHead>Stock</TableHead>
                                                        <TableHead>Featured</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {products.map((product) => (
                                                        <TableRow key={product.$id}>
                                                            <TableCell>
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    className="w-16 h-16 object-cover rounded"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-medium">{product.name}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="secondary">{product.category}</Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div>
                                                                    <div className="font-semibold">${product.price}</div>
                                                                    {product.oldPrice && (
                                                                        <div className="text-xs text-muted-foreground line-through">
                                                                            ${product.oldPrice}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{product.stock}</TableCell>
                                                            <TableCell>
                                                                {product.featured && <Badge>Featured</Badge>}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                                                        <Pencil className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(product)}>
                                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Seller Requests Tab */}
                        <TabsContent value="seller-requests">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Seller Verification Requests</CardTitle>
                                    <CardDescription>
                                        Review and approve seller verification requests
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loadingRequests ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                                        </div>
                                    ) : sellerRequests.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No seller requests yet.
                                        </div>
                                    ) : (
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>User</TableHead>
                                                        <TableHead>Full Name</TableHead>
                                                        <TableHead>Location</TableHead>
                                                        <TableHead>ID Type</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {sellerRequests.map((request) => (
                                                        <TableRow key={request.$id}>
                                                            <TableCell>
                                                                <div>
                                                                    <div className="font-medium">{request.userName}</div>
                                                                    <div className="text-xs text-muted-foreground">{request.userEmail}</div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{request.fullName}</TableCell>
                                                            <TableCell>
                                                                {request.city}, {request.country}
                                                            </TableCell>
                                                            <TableCell className="capitalize">
                                                                {request.idDocumentType.replace('_', ' ')}
                                                            </TableCell>
                                                            <TableCell>{getStatusBadge(request.status)}</TableCell>
                                                            <TableCell>
                                                                {new Date(request.$createdAt!).toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleViewRequest(request)}
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Marketplace Products Tab */}
                        <TabsContent value="marketplace-products">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Marketplace Products</CardTitle>
                                    <CardDescription>
                                        Review and approve user-listed products
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loadingMarketplace ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                                        </div>
                                    ) : marketplaceProducts.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No marketplace products yet.
                                        </div>
                                    ) : (
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[80px]">Image</TableHead>
                                                        <TableHead>Name</TableHead>
                                                        <TableHead>Seller</TableHead>
                                                        <TableHead>Category</TableHead>
                                                        <TableHead>Price</TableHead>
                                                        <TableHead>Condition</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {marketplaceProducts.map((product) => (
                                                        <TableRow key={product.$id}>
                                                            <TableCell>
                                                                <img
                                                                    src={product.images[0]}
                                                                    alt={product.name}
                                                                    className="w-12 h-12 object-cover rounded"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-medium">{product.name}</TableCell>
                                                            <TableCell>
                                                                <div>
                                                                    <div className="font-medium">{product.sellerName}</div>
                                                                    <div className="text-xs text-muted-foreground">{product.sellerEmail}</div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="secondary">{product.category}</Badge>
                                                            </TableCell>
                                                            <TableCell>${product.price}</TableCell>
                                                            <TableCell className="capitalize">
                                                                {product.condition.replace('_', ' ')}
                                                            </TableCell>
                                                            <TableCell>{getStatusBadge(product.status)}</TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleViewMarketplaceProduct(product)}
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Sellers Tab */}
                        <TabsContent value="sellers">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Verified Sellers</CardTitle>
                                    <CardDescription>
                                        Manage verified sellers on the marketplace
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loadingSellers ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                                        </div>
                                    ) : sellers.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No verified sellers yet.
                                        </div>
                                    ) : (
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Seller</TableHead>
                                                        <TableHead>Location</TableHead>
                                                        <TableHead>Sales</TableHead>
                                                        <TableHead>Rating</TableHead>
                                                        <TableHead>Balance</TableHead>
                                                        <TableHead>Pending</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead>Joined</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {sellers.map((seller) => (
                                                        <TableRow key={seller.$id}>
                                                            <TableCell>
                                                                <div>
                                                                    <div className="font-medium">{seller.displayName}</div>
                                                                    <div className="text-xs text-muted-foreground">{seller.userEmail}</div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {seller.city}, {seller.country}
                                                            </TableCell>
                                                            <TableCell>{seller.totalSales}</TableCell>
                                                            <TableCell>
                                                                {seller.rating > 0 ? (
                                                                    <span>{seller.rating.toFixed(1)} ({seller.reviewCount})</span>
                                                                ) : (
                                                                    <span className="text-muted-foreground">No reviews</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>${seller.balance.toFixed(2)}</TableCell>
                                                            <TableCell>${seller.pendingBalance.toFixed(2)}</TableCell>
                                                            <TableCell>
                                                                {seller.isActive ? (
                                                                    <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="bg-red-100 text-red-800">Inactive</Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {new Date(seller.$createdAt!).toLocaleDateString()}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Product Form Dialog */}
                <ProductFormDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    product={selectedProduct}
                    onSuccess={loadProducts}
                />

                {/* Delete Product Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete "{productToDelete?.name}". This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Seller Request Review Dialog */}
                <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Review Seller Request</DialogTitle>
                            <DialogDescription>
                                Review the seller verification request details
                            </DialogDescription>
                        </DialogHeader>

                        {selectedRequest && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">User Account</Label>
                                        <p className="font-medium">{selectedRequest.userName}</p>
                                        <p className="text-sm text-muted-foreground">{selectedRequest.userEmail}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Status</Label>
                                        <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Full Legal Name</Label>
                                        <p className="font-medium">{selectedRequest.fullName}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Phone</Label>
                                        <p className="font-medium">{selectedRequest.phone}</p>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-muted-foreground">Address</Label>
                                    <p className="font-medium">
                                        {selectedRequest.address}, {selectedRequest.city}, {selectedRequest.country}
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-muted-foreground">ID Document Type</Label>
                                    <p className="font-medium capitalize">{selectedRequest.idDocumentType.replace('_', ' ')}</p>
                                </div>

                                <div>
                                    <Label className="text-muted-foreground">ID Document</Label>
                                    <a
                                        href={selectedRequest.idDocumentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block mt-2"
                                    >
                                        <img
                                            src={selectedRequest.idDocumentUrl}
                                            alt="ID Document"
                                            className="max-w-full h-auto max-h-48 rounded border"
                                        />
                                    </a>
                                </div>

                                <div>
                                    <Label className="text-muted-foreground">Reason for Becoming a Seller</Label>
                                    <p className="font-medium">{selectedRequest.reason}</p>
                                </div>

                                {selectedRequest.adminNote && (
                                    <Alert>
                                        <AlertDescription>
                                            <strong>Admin Note:</strong> {selectedRequest.adminNote}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {selectedRequest.status === 'pending' && (
                                    <>
                                        <div>
                                            <Label htmlFor="rejectNote">Rejection Note (required for rejection)</Label>
                                            <Textarea
                                                id="rejectNote"
                                                placeholder="Explain why the request is being rejected..."
                                                value={rejectNote}
                                                onChange={(e) => setRejectNote(e.target.value)}
                                                rows={3}
                                            />
                                        </div>

                                        <DialogFooter className="gap-2">
                                            <Button
                                                variant="destructive"
                                                onClick={handleRejectRequest}
                                                disabled={!rejectNote.trim()}
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Reject
                                            </Button>
                                            <Button onClick={handleApproveRequest}>
                                                <Check className="w-4 h-4 mr-2" />
                                                Approve
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Marketplace Product Review Dialog */}
                <Dialog open={marketplaceProductDialogOpen} onOpenChange={setMarketplaceProductDialogOpen}>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Review Product Listing</DialogTitle>
                            <DialogDescription>
                                Review the product listing details
                            </DialogDescription>
                        </DialogHeader>

                        {selectedMarketplaceProduct && (
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <img
                                        src={selectedMarketplaceProduct.images[0]}
                                        alt={selectedMarketplaceProduct.name}
                                        className="w-32 h-32 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">{selectedMarketplaceProduct.name}</h3>
                                        <p className="text-2xl font-bold text-primary">${selectedMarketplaceProduct.price}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="secondary">{selectedMarketplaceProduct.category}</Badge>
                                            <Badge className="capitalize">{selectedMarketplaceProduct.condition.replace('_', ' ')}</Badge>
                                        </div>
                                    </div>
                                </div>

                                {selectedMarketplaceProduct.images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto">
                                        {selectedMarketplaceProduct.images.slice(1).map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`${selectedMarketplaceProduct.name} ${idx + 2}`}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                        ))}
                                    </div>
                                )}

                                <div>
                                    <Label className="text-muted-foreground">Seller</Label>
                                    <p className="font-medium">{selectedMarketplaceProduct.sellerName}</p>
                                    <p className="text-sm text-muted-foreground">{selectedMarketplaceProduct.sellerEmail}</p>
                                </div>

                                <div>
                                    <Label className="text-muted-foreground">Description</Label>
                                    <p className="font-medium whitespace-pre-wrap">{selectedMarketplaceProduct.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Status</Label>
                                        <div className="mt-1">{getStatusBadge(selectedMarketplaceProduct.status)}</div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Listed</Label>
                                        <p className="font-medium">
                                            {new Date(selectedMarketplaceProduct.$createdAt!).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {selectedMarketplaceProduct.adminNote && (
                                    <Alert>
                                        <AlertDescription>
                                            <strong>Admin Note:</strong> {selectedMarketplaceProduct.adminNote}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {selectedMarketplaceProduct.status === 'pending' && (
                                    <>
                                        <div>
                                            <Label htmlFor="rejectProductNote">Rejection Note (required for rejection)</Label>
                                            <Textarea
                                                id="rejectProductNote"
                                                placeholder="Explain why the listing is being rejected..."
                                                value={rejectProductNote}
                                                onChange={(e) => setRejectProductNote(e.target.value)}
                                                rows={3}
                                            />
                                        </div>

                                        <DialogFooter className="gap-2">
                                            <Button
                                                variant="destructive"
                                                onClick={handleRejectProduct}
                                                disabled={!rejectProductNote.trim()}
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Reject
                                            </Button>
                                            <Button onClick={handleApproveProduct}>
                                                <Check className="w-4 h-4 mr-2" />
                                                Approve
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AdminRoute>
    )
}
