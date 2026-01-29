import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Gamepad2, Heart, Package, Shield } from 'lucide-react'
import { Breadcrumbs } from '../components/Breadcrumbs'

export const Route = createFileRoute('/about')({
    component: AboutPage,
})

function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-8">
                <Breadcrumbs items={[{ label: 'About', current: true }]} />
            </div>
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-4">
                        <Gamepad2 className="w-16 h-16 text-primary" />
                    </div>
                    <h1 className="text-5xl font-bold mb-4">
                        About <span className="text-primary">RETRO</span>
                        <span className="text-muted-foreground">STORE</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Your ultimate destination for vintage gaming nostalgia
                    </p>
                </div>

                {/* Story Section */}
                <div className="max-w-4xl mx-auto mb-16">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl">Our Story</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground space-y-4">
                            <p>
                                Founded in 2020, RETRO STORE was born from a passion for preserving gaming history.
                                We believe that classic gaming consoles and games deserve to be celebrated, preserved,
                                and enjoyed by both veterans and newcomers alike.
                            </p>
                            <p>
                                What started as a small collection of vintage consoles has grown into a comprehensive
                                marketplace featuring everything from the iconic Atari 2600 to the revolutionary PlayStation 2.
                                Each item in our catalog is carefully selected and verified to ensure authenticity and quality.
                            </p>
                            <p>
                                Our mission is simple: to keep the golden age of gaming alive and accessible to everyone.
                                Whether you're looking to relive your childhood memories or discover gaming history for the
                                first time, we're here to help you on that journey.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle>Authentic Products</CardTitle>
                            <CardDescription>
                                Every console and game is verified for authenticity and quality
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <Package className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle>Secure Shipping</CardTitle>
                            <CardDescription>
                                Professional packaging to ensure your retro treasures arrive safely
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <Heart className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle>Passionate Team</CardTitle>
                            <CardDescription>
                                Run by gamers who truly understand and love retro gaming
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <Gamepad2 className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle>Huge Selection</CardTitle>
                            <CardDescription>
                                From 8-bit classics to 128-bit powerhouses and everything in between
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                {/* Values Section */}
                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl">Why Choose Us?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Preservation First</h3>
                                <p className="text-muted-foreground">
                                    We're not just selling products—we're preserving gaming history. Every purchase
                                    supports the ongoing effort to keep these classic systems alive and playable.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
                                <p className="text-muted-foreground">
                                    Our community of retro gaming enthusiasts is at the heart of everything we do.
                                    We regularly host events, share tips, and connect collectors from around the world.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Expert Knowledge</h3>
                                <p className="text-muted-foreground">
                                    Need help choosing the right console? Wondering about compatibility? Our team
                                    has decades of combined experience and we're always happy to help.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Collection?</h2>
                    <p className="text-muted-foreground mb-8">
                        Browse our catalog and discover the console that defined your childhood—or start a new retro adventure.
                    </p>
                </div>
        </div>
    )
}
