import { useState, useEffect } from 'react'
import { AdminRoute } from '../components/AdminRoute'
import { productService, type Product } from '../lib/products'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react'
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

export function AdminPanel() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<Product | null>(null)

    useEffect(() => {
        loadProducts()
    }, [])

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
                            <p className="text-muted-foreground">Manage your store products</p>
                        </div>
                        <Button onClick={handleAdd}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Products ({products.length})</CardTitle>
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
                                                    <TableCell className="font-medium">
                                                        {product.name}
                                                    </TableCell>
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
                                                        {product.featured && (
                                                            <Badge>Featured</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleEdit(product)}
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDeleteClick(product)}
                                                            >
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
                </div>

                <ProductFormDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    product={selectedProduct}
                    onSuccess={loadProducts}
                />

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
            </div>
        </AdminRoute>
    )
}
