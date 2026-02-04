import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2, X, AlertCircle, ImagePlus } from 'lucide-react'
import { usedProductService, type UsedProduct } from '../lib/marketplace'

interface UsedProductFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product?: UsedProduct | null
    onSuccess?: () => void
}

interface FormData {
    name: string
    description: string
    condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
    price: number
    category: string
}

const CONDITIONS = [
    { value: 'new', label: 'New (Sealed)', description: 'Brand new, never opened' },
    { value: 'like_new', label: 'Like New', description: 'Opened but barely used, like new condition' },
    { value: 'good', label: 'Good', description: 'Used but in good working condition with minor wear' },
    { value: 'fair', label: 'Fair', description: 'Shows signs of use, but fully functional' },
    { value: 'poor', label: 'Poor', description: 'Heavy wear, may have cosmetic damage' }
]

const CATEGORIES = [
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

export function UsedProductFormDialog({
    open,
    onOpenChange,
    product,
    onSuccess
}: UsedProductFormDialogProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
        defaultValues: {
            name: product?.name || '',
            description: product?.description || '',
            condition: product?.condition || 'good',
            price: product?.price || 0,
            category: product?.category || ''
        }
    })

    const condition = watch('condition')
    const category = watch('category')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])

        // Check total count
        if (imageFiles.length + files.length > 5) {
            setError('Maximum 5 images allowed')
            return
        }

        // Validate each file
        for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Each image must be less than 5MB')
                return
            }
            if (!file.type.startsWith('image/')) {
                setError('Only image files are allowed')
                return
            }
        }

        setError(null)

        // Add files
        setImageFiles(prev => [...prev, ...files])

        // Create previews
        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreviews(prev => [...prev, e.target?.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    const onSubmit = async (data: FormData) => {
        if (imageFiles.length === 0 && !product) {
            setError('Please upload at least one image')
            return
        }

        setLoading(true)
        setError(null)

        try {
            if (product && product.$id) {
                // Update existing product
                await usedProductService.updateProduct(product.$id, {
                    name: data.name,
                    description: data.description,
                    condition: data.condition,
                    price: data.price,
                    category: data.category
                })
            } else {
                // Create new product
                await usedProductService.createProduct({
                    name: data.name,
                    description: data.description,
                    condition: data.condition,
                    price: parseFloat(String(data.price)),
                    category: data.category,
                    imageFiles
                })
            }

            reset()
            setImageFiles([])
            setImagePreviews([])
            onOpenChange(false)
            onSuccess?.()
        } catch (err: any) {
            setError(err.message || 'Failed to save product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? 'Edit Product' : 'List a Product for Sale'}</DialogTitle>
                    <DialogDescription>
                        {product
                            ? 'Update your product listing details.'
                            : 'Fill in the details of the item you want to sell. Your listing will be reviewed before being published.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Nintendo 64 Console with Controller"
                                {...register('name', { required: 'Product name is required' })}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Category *</Label>
                                <Select
                                    value={category}
                                    onValueChange={(value) => setValue('category', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="price">Price ($) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    placeholder="99.99"
                                    {...register('price', {
                                        required: 'Price is required',
                                        min: { value: 1, message: 'Price must be at least $1' }
                                    })}
                                />
                                {errors.price && (
                                    <p className="text-sm text-destructive">{errors.price.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Condition *</Label>
                            <Select
                                value={condition}
                                onValueChange={(value) => setValue('condition', value as any)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CONDITIONS.map(cond => (
                                        <SelectItem key={cond.value} value={cond.value}>
                                            <div>
                                                <span className="font-medium">{cond.label}</span>
                                                <span className="text-muted-foreground ml-2 text-xs">
                                                    - {cond.description}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your item in detail. Include information about what's included, any defects, and the item's history..."
                                rows={4}
                                {...register('description', {
                                    required: 'Description is required',
                                    minLength: { value: 30, message: 'Please provide more details (at least 30 characters)' }
                                })}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description.message}</p>
                            )}
                        </div>

                        {!product && (
                            <div className="grid gap-2">
                                <Label>Product Images * (Max 5)</Label>
                                <div className="grid grid-cols-5 gap-2">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {imageFiles.length < 5 && (
                                        <label className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <ImagePlus className="h-6 w-6 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground mt-1">Add</span>
                                        </label>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Upload clear photos from multiple angles. First image will be the main photo.
                                </p>
                            </div>
                        )}
                    </div>

                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Your listing will be reviewed by our team before it appears on the marketplace. This usually takes 24-48 hours.
                        </AlertDescription>
                    </Alert>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {product ? 'Update Listing' : 'Submit for Review'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
