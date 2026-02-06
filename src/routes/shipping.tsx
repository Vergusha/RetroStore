import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Truck, Clock, Globe, Package, ShieldCheck, MapPin } from 'lucide-react'
import { Breadcrumbs } from '../components/Breadcrumbs'

export const Route = createFileRoute('/shipping')({
    component: ShippingPage,
})

function ShippingPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-8">
                <Breadcrumbs items={[{ label: 'Shipping', current: true }]} />
            </div>

            <div className="text-center mb-16">
                <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-primary/10">
                        <Truck className="w-12 h-12 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Fast, secure delivery of your retro gaming treasures
                </p>
            </div>

            <div className="max-w-4xl mx-auto mb-12">
                <h2 className="text-2xl font-bold mb-6">Shipping Options</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <CardTitle>Standard Shipping</CardTitle>
                            <CardDescription>5-7 business days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-primary mb-2">$5.99</p>
                            <p className="text-sm text-muted-foreground">Free on orders over $50</p>
                        </CardContent>
                    </Card>

                    <Card className="border-primary">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <Truck className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle>Express Shipping</CardTitle>
                            <CardDescription>2-3 business days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-primary mb-2">$12.99</p>
                            <p className="text-sm text-muted-foreground">Free on orders over $100</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
                                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <CardTitle>Next Day Delivery</CardTitle>
                            <CardDescription>Next business day</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-primary mb-2">$24.99</p>
                            <p className="text-sm text-muted-foreground">Order before 2 PM</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mb-12">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Globe className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle>International Shipping</CardTitle>
                                <CardDescription>We ship worldwide</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            We ship to most countries worldwide. International shipping rates are calculated at checkout based on your location.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-muted/50">
                                <h4 className="font-semibold mb-2">Europe</h4>
                                <p className="text-sm text-muted-foreground">7-14 business days</p>
                                <p className="text-sm">Starting at $15.99</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50">
                                <h4 className="font-semibold mb-2">Asia and Pacific</h4>
                                <p className="text-sm text-muted-foreground">10-21 business days</p>
                                <p className="text-sm">Starting at $19.99</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50">
                                <h4 className="font-semibold mb-2">Canada</h4>
                                <p className="text-sm text-muted-foreground">5-10 business days</p>
                                <p className="text-sm">Starting at $9.99</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50">
                                <h4 className="font-semibold mb-2">Other Regions</h4>
                                <p className="text-sm text-muted-foreground">14-28 business days</p>
                                <p className="text-sm">Calculated at checkout</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Our Shipping Promise</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-muted/30">
                        <CardContent className="pt-6 text-center">
                            <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Secure Packaging</h3>
                            <p className="text-sm text-muted-foreground">
                                Every item is carefully packaged to protect your retro treasures
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                        <CardContent className="pt-6 text-center">
                            <MapPin className="w-10 h-10 text-primary mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Order Tracking</h3>
                            <p className="text-sm text-muted-foreground">
                                Track your order every step of the way with real-time updates
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                        <CardContent className="pt-6 text-center">
                            <Package className="w-10 h-10 text-primary mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Insurance Included</h3>
                            <p className="text-sm text-muted-foreground">
                                All shipments are insured against loss or damage
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
