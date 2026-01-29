import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { Gamepad2 } from 'lucide-react'

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
            </div>

            <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
                <div className="max-w-5xl mx-auto text-center space-y-8">
                    {/* Icon with animation */}
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Gamepad2 className="w-10 h-10" />
                    </div>

                    {/* Main heading with gradient */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 animate-delay-200">
                        <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                            Retro Store
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 animate-delay-400">
                        Discover legendary retro consoles and modern gaming systems
                    </p>

                    {/* Single clear CTA */}
                    <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 animate-delay-400">
                        <Button size="lg" asChild className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <Link to="/products" search={{}}>
                                Browse Consoles
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
