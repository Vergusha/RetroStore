import { useState, useEffect } from 'react'
import { productService, type Product } from '../lib/products'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'
import { Textarea } from './ui/textarea'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2 } from 'lucide-react'
import { Checkbox } from './ui/checkbox'

interface ProductFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product?: Product | null
    onSuccess: () => void
}

const CATEGORIES = [
    'Retro Consoles',
    'Modern Consoles',
    'Handhelds',
    'Accessories',
    'Limited Edition',
    'Mobile Gaming'
]

export function ProductFormDialog({ open, onOpenChange, product, onSuccess }: ProductFormDialogProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        oldPrice: '',
        category: '',
        image: '',
        stock: '',
        featured: false,
        rating: '4.5'
    })

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                oldPrice: product.oldPrice?.toString() || '',
                category: product.category,
                image: product.image,
                stock: product.stock.toString(),
                featured: product.featured,
                rating: product.rating?.toString() || '4.5'
            })
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                oldPrice: '',
                category: '',
                image: '',
                stock: '',
                featured: false,
                rating: '4.5'
            })
        }
    }, [product, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            let imageUrl = formData.image

            // Upload new image if selected
            if (imageFile) {
                imageUrl = await productService.uploadImage(imageFile)
            }

            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : undefined,
                category: formData.category,
                image: imageUrl,
                stock: parseInt(formData.stock),
                featured: formData.featured,
                rating: parseFloat(formData.rating)
            }

            if (product?.$id) {
                await productService.updateProduct(product.$id, productData)
            } else {
                await productService.createProduct(productData)
            }

            onSuccess()
            onOpenChange(false)
        } catch (err: any) {
            setError(err.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
                    <DialogDescription>
                        {product ? 'Update product information' : 'Add a new product to the store'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            disabled={loading}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="oldPrice">Old Price ($) - Optional</Label>
                            <Input
                                id="oldPrice"
                                type="number"
                                step="0.01"
                                value={formData.oldPrice}
                                onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                                disabled={loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rating">Rating (0-5)</Label>
                        <Input
                            id="rating"
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={formData.rating}
                            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Image URL or Upload</Label>
                        <Input
                            id="image"
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            disabled={loading}
                        />
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="featured"
                            checked={formData.featured}
                            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                            disabled={loading}
                        />
                        <Label htmlFor="featured" className="cursor-pointer">
                            Featured Product
                        </Label>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {product ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
