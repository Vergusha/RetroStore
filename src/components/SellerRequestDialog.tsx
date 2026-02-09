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
import { Loader2, Upload, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { sellerRequestService, type SellerRequest } from '../lib/marketplace'

interface SellerRequestDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    existingRequest?: SellerRequest | null
    onSuccess?: () => void
}

interface FormData {
    fullName: string
    phone: string
    address: string
    city: string
    country: string
    idDocumentType: string
    reason: string
}

export function SellerRequestDialog({
    open,
    onOpenChange,
    existingRequest,
    onSuccess
}: SellerRequestDialogProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null)

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
        defaultValues: {
            fullName: '',
            phone: '',
            address: '',
            city: '',
            country: '',
            idDocumentType: 'passport',
            reason: ''
        }
    })

    const idDocumentType = watch('idDocumentType')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB')
                return
            }
            // Check file type
            if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
                setError('File must be an image or PDF')
                return
            }
            setIdDocumentFile(file)
            setError(null)
        }
    }

    const onSubmit = async (data: FormData) => {
        if (!idDocumentFile) {
            setError('Please upload your ID document')
            return
        }

        setLoading(true)
        setError(null)

        try {
            await sellerRequestService.submitRequest({
                fullName: data.fullName,
                phone: data.phone,
                address: data.address,
                city: data.city,
                country: data.country,
                idDocumentFile,
                idDocumentType: data.idDocumentType,
                reason: data.reason
            })

            setSuccess(true)
            onSuccess?.()
        } catch (err: any) {
            setError(err.message || 'Failed to submit request')
        } finally {
            setLoading(false)
        }
    }

    // If request exists, show status
    if (existingRequest) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Seller Verification Status</DialogTitle>
                        <DialogDescription>
                            Your seller verification request status
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {existingRequest.status === 'pending' && (
                            <Alert>
                                <Clock className="h-4 w-4" />
                                <AlertDescription>
                                    Your request is being reviewed. We'll notify you once it's processed.
                                </AlertDescription>
                            </Alert>
                        )}

                        {existingRequest.status === 'approved' && (
                            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-600">
                                    Congratulations! Your seller request has been approved. You can now list products on the marketplace.
                                </AlertDescription>
                            </Alert>
                        )}

                        {existingRequest.status === 'rejected' && (
                            <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertDescription className="text-red-600">
                                    Your request was rejected. {existingRequest.adminNote && `Reason: ${existingRequest.adminNote}`}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid gap-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Full Name</Label>
                                    <p className="font-medium">{existingRequest.fullName}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Phone</Label>
                                    <p className="font-medium">{existingRequest.phone}</p>
                                </div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Address</Label>
                                <p className="font-medium">
                                    {existingRequest.address}, {existingRequest.city}, {existingRequest.country}
                                </p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Submitted</Label>
                                <p className="font-medium">
                                    {new Date(existingRequest.$createdAt!).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <Button onClick={() => onOpenChange(false)} className="w-full">
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    // Show success state
    if (success) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Seller Request Submitted</DialogTitle>
                        <DialogDescription>Your seller verification request has been submitted</DialogDescription>
                    </DialogHeader>
                    <div className="text-center py-8">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Request Submitted!</h3>
                        <p className="text-muted-foreground mb-6">
                            Your seller verification request has been submitted. We'll review it and get back to you within 24-48 hours.
                        </p>
                        <Button onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Become a Seller</DialogTitle>
                    <DialogDescription>
                        Submit your information to become a verified seller on our marketplace.
                        We'll review your application and get back to you within 24-48 hours.
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
                            <Label htmlFor="fullName">Full Legal Name *</Label>
                            <Input
                                id="fullName"
                                placeholder="John Doe"
                                {...register('fullName', { required: 'Full name is required' })}
                            />
                            {errors.fullName && (
                                <p className="text-sm text-destructive">{errors.fullName.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                                id="phone"
                                placeholder="+1 234 567 8900"
                                {...register('phone', { required: 'Phone number is required' })}
                            />
                            {errors.phone && (
                                <p className="text-sm text-destructive">{errors.phone.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">Address *</Label>
                            <Input
                                id="address"
                                placeholder="123 Main Street"
                                {...register('address', { required: 'Address is required' })}
                            />
                            {errors.address && (
                                <p className="text-sm text-destructive">{errors.address.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    placeholder="New York"
                                    {...register('city', { required: 'City is required' })}
                                />
                                {errors.city && (
                                    <p className="text-sm text-destructive">{errors.city.message}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="country">Country *</Label>
                                <Input
                                    id="country"
                                    placeholder="United States"
                                    {...register('country', { required: 'Country is required' })}
                                />
                                {errors.country && (
                                    <p className="text-sm text-destructive">{errors.country.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>ID Document Type *</Label>
                            <Select
                                value={idDocumentType}
                                onValueChange={(value) => setValue('idDocumentType', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select document type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="passport">Passport</SelectItem>
                                    <SelectItem value="drivers_license">Driver's License</SelectItem>
                                    <SelectItem value="national_id">National ID Card</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="idDocument">Upload ID Document *</Label>
                            <div className="border-2 border-dashed rounded-lg p-4 text-center">
                                <input
                                    type="file"
                                    id="idDocument"
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="idDocument"
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    {idDocumentFile ? (
                                        <span className="text-sm font-medium text-primary">
                                            {idDocumentFile.name}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">
                                            Click to upload (max 5MB)
                                        </span>
                                    )}
                                </label>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Your document will be securely stored and only used for verification purposes.
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="reason">Why do you want to become a seller? *</Label>
                            <Textarea
                                id="reason"
                                placeholder="Tell us about what you plan to sell and your experience..."
                                rows={3}
                                {...register('reason', {
                                    required: 'Please tell us why you want to become a seller',
                                    minLength: { value: 20, message: 'Please provide more details (at least 20 characters)' }
                                })}
                            />
                            {errors.reason && (
                                <p className="text-sm text-destructive">{errors.reason.message}</p>
                            )}
                        </div>
                    </div>

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
                            Submit Request
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
