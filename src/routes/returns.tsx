import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { RotateCcw, Clock, CheckCircle, AlertCircle, Package, ArrowRight } from 'lucide-react'
import { Breadcrumbs } from '../components/Breadcrumbs'

export const Route = createFileRoute('/returns')({
    component: ReturnsPage,
})

function ReturnsPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-8">
                <Breadcrumbs items={[{ label: 'Returns', current: true }]} />
            </div>

            {/* Hero Section */}
            <div className="text-center mb-16">
                <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-primary/10">
                        <RotateCcw className="w-12 h-12 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-4">Returns & Refunds</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Easy returns and hassle-free refunds for your peace of mind
                </p>
            </div>

            {/* Return Policy Overview */}
            <div className="max-w-4xl mx-auto mb-12">
                <Card className="border-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            30-Day Return Policy
                        </CardTitle>
                        <CardDescription>
                            We want you to be completely satisfied with your purchase
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            You have 30 days from the date of delivery to return any item purchased from RETRO STORE.
                            Items must be in their original condition with all included accessories.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-green-800 dark:text-green-300">Eligible for Return</h4>
                                    <ul className="text-sm text-green-700 dark:text-green-400 mt-1 space-y-1">
                                        <li>• Defective or malfunctioning items</li>
                                        <li>• Items not as described</li>
                                        <li>• Damaged during shipping</li>
                                        <li>• Wrong item received</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-red-800 dark:text-red-300">Not Eligible</h4>
                                    <ul className="text-sm text-red-700 dark:text-red-400 mt-1 space-y-1">
                                        <li>• Items damaged by user</li>
                                        <li>• Missing accessories or parts</li>
                                        <li>• Items returned after 30 days</li>
                                        <li>• Final sale items</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Return Process */}
            <div className="max-w-4xl mx-auto mb-12">
                <h2 className="text-2xl font-bold mb-6">How to Return an Item</h2>
                <div className="grid md:grid-cols-4 gap-4">
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-primary font-bold">1</span>
                            </div>
                            <h3 className="font-semibold mb-2">Contact Us</h3>
                            <p className="text-sm text-muted-foreground">
                                Email us at hello@retrostore.com with your order number
                            </p>
                        </CardContent>
                    </Card>

                    <div className="hidden md:flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-primary font-bold">2</span>
                            </div>
                            <h3 className="font-semibold mb-2">Get Return Label</h3>
                            <p className="text-sm text-muted-foreground">
                                We will send you a prepaid return shipping label
                            </p>
                        </CardContent>
                    </Card>

                    <div className="hidden md:flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-primary font-bold">3</span>
                            </div>
                            <h3 className="font-semibold mb-2">Ship It Back</h3>
                            <p className="text-sm text-muted-foreground">
                                Pack the item securely and drop it off at any carrier location
                            </p>
                        </CardContent>
                    </Card>

                    <div className="hidden md:flex items-center justify-center">
                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>

                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-primary font-bold">4</span>
                            </div>
                            <h3 className="font-semibold mb-2">Get Refunded</h3>
                            <p className="text-sm text-muted-foreground">
                                Refund processed within 5-7 business days after we receive the item
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Marketplace Returns */}
            <div className="max-w-4xl mx-auto mb-12">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Marketplace Returns</CardTitle>
                                <CardDescription>For items purchased from individual sellers</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            Items purchased from marketplace sellers have their own return policies set by each seller.
                            Please check the seller profile and listing details before purchasing.
                        </p>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                <span>Contact the seller directly through your order page</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                <span>If the seller does not respond within 48 hours, contact our support team</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                <span>We provide buyer protection for all marketplace purchases</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Refund Information */}
            <div className="max-w-4xl mx-auto">
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle>Refund Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2">Processing Time</h4>
                                <p className="text-sm text-muted-foreground">
                                    Refunds are processed within 5-7 business days after we receive and inspect your return.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Refund Method</h4>
                                <p className="text-sm text-muted-foreground">
                                    Refunds are issued to the original payment method used for the purchase.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Shipping Costs</h4>
                                <p className="text-sm text-muted-foreground">
                                    Original shipping costs are refunded only if the return is due to our error.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Partial Refunds</h4>
                                <p className="text-sm text-muted-foreground">
                                    Items returned in less than original condition may receive a partial refund.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
