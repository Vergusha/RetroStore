import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { CreditCard, Shield, Lock, CheckCircle, Wallet, Building2 } from 'lucide-react'
import { Breadcrumbs } from '../components/Breadcrumbs'

export const Route = createFileRoute('/payment')({
    component: PaymentPage,
})

function PaymentPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-8">
                <Breadcrumbs items={[{ label: 'Payment', current: true }]} />
            </div>

            {/* Hero Section */}
            <div className="text-center mb-16">
                <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-primary/10">
                        <CreditCard className="w-12 h-12 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-4">Payment Methods</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Secure and convenient payment options for your purchases
                </p>
            </div>

            {/* Payment Methods */}
            <div className="max-w-4xl mx-auto mb-12">
                <h2 className="text-2xl font-bold mb-6">Accepted Payment Methods</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                                <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <CardTitle>Credit & Debit Cards</CardTitle>
                            <CardDescription>All major cards accepted</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                    Visa
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                    MasterCard
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                    American Express
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                    Discover
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
                                <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <CardTitle>Digital Wallets</CardTitle>
                            <CardDescription>Fast and secure checkout</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                    PayPal
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                    Apple Pay
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                    Google Pay
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                                <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <CardTitle>Bank Transfer</CardTitle>
                            <CardDescription>Direct payment option</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Available for orders over $500. Contact us for bank transfer details.
                                Processing may take 2-3 business days.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-2">
                                <CreditCard className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <CardTitle>Buy Now, Pay Later</CardTitle>
                            <CardDescription>Flexible payment plans</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Split your purchase into 4 interest-free payments. Available for orders between $50-$1000.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Security Section */}
            <div className="max-w-4xl mx-auto mb-12">
                <Card className="border-primary">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Secure Payments</CardTitle>
                                <CardDescription>Your security is our priority</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            All payments are processed through secure, encrypted connections. We never store your
                            complete payment information on our servers.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                                <Lock className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h4 className="font-medium">SSL Encryption</h4>
                                    <p className="text-sm text-muted-foreground">256-bit secure connection</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                                <Shield className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h4 className="font-medium">PCI Compliant</h4>
                                    <p className="text-sm text-muted-foreground">Industry standard security</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h4 className="font-medium">Fraud Protection</h4>
                                    <p className="text-sm text-muted-foreground">Advanced fraud detection</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Billing Information */}
            <div className="max-w-4xl mx-auto mb-12">
                <h2 className="text-2xl font-bold mb-6">Billing Information</h2>
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2">When Will I Be Charged?</h4>
                                <p className="text-sm text-muted-foreground">
                                    Your payment method is charged immediately when you place your order.
                                    For pre-orders, you'll be charged when the item ships.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Currency</h4>
                                <p className="text-sm text-muted-foreground">
                                    All prices are displayed in USD. International payments will be converted
                                    to your local currency by your payment provider.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Sales Tax</h4>
                                <p className="text-sm text-muted-foreground">
                                    Sales tax is calculated based on your shipping address and will be shown
                                    at checkout before you complete your purchase.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Payment Issues?</h4>
                                <p className="text-sm text-muted-foreground">
                                    If your payment fails, please verify your card details and billing address,
                                    or try an alternative payment method.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Marketplace Payments */}
            <div className="max-w-4xl mx-auto">
                <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle>Marketplace Payments</CardTitle>
                        <CardDescription>For purchases from individual sellers</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            When purchasing from marketplace sellers, your payment is held securely until you
                            confirm receipt of the item. This protects both buyers and sellers.
                        </p>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                <span>Payment is held until delivery is confirmed</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                <span>Sellers receive payment within 3-5 days after confirmation</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                <span>Buyer protection on all marketplace purchases</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
