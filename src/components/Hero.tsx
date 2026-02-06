import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { Gamepad2, Sparkles, ChevronRight } from 'lucide-react'

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-t from-primary/5 to-transparent rounded-full blur-3xl" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />

            <div className="container mx-auto px-4 py-24 md:py-36 relative z-10">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 backdrop-blur-sm px-4 py-1.5 text-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Your retro gaming destination</span>
                    </div>

                    {/* Main heading with gradient */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 animate-delay-200 leading-[1.1]">
                        <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Discover
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                            Legendary
                        </span>
                        <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {" "}Consoles
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 animate-delay-400">
                        From the iconic 8-bit era to modern powerhouses — find authentic
                        retro and modern gaming systems from trusted sellers
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 animate-delay-400">
                        <Button size="lg" asChild className="text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all group">
                            <Link to="/products" search={{}}>
                                Browse Consoles
                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="text-base px-8 py-6 rounded-xl hover:scale-[1.02] transition-all">
                            <Link to="/marketplace">
                                Visit Marketplace
                            </Link>
                        </Button>
                    </div>

                    {/* Stats strip */}
                    <div className="flex items-center justify-center gap-8 md:gap-16 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 animate-delay-400">
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-foreground">500+</div>
                            <div className="text-xs md:text-sm text-muted-foreground">Products</div>
                        </div>
                        <div className="w-px h-10 bg-border" />
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-foreground">50+</div>
                            <div className="text-xs md:text-sm text-muted-foreground">Sellers</div>
                        </div>
                        <div className="w-px h-10 bg-border" />
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-foreground">4.9</div>
                            <div className="text-xs md:text-sm text-muted-foreground">Rating</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
