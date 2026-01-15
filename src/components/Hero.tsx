import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <Badge variant="secondary" className="gap-1">
                        <Sparkles className="w-3 h-3" />
                        New Arrivals Weekly
                    </Badge>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                        Welcome to{' '}
                        <span className="text-primary">Retro Store</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Discover classic retro consoles and the latest modern gaming systems.
                        From vintage Nintendo to PlayStation 5 — we have it all!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button size="lg" className="gap-2">
                            Shop Now
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button size="lg" variant="outline">
                            Browse Categories
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
