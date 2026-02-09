import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { ChevronRight } from 'lucide-react'

export function Hero() {
    return (
        <section className="bg-background">
            <div className="container mx-auto px-4 py-8 md:py-10">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" asChild className="text-base px-8 py-6 rounded-xl group">
                            <Link to="/products" search={{}}>
                                Browse Consoles
                                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="text-base px-8 py-6 rounded-xl">
                            <Link to="/marketplace">
                                Visit Marketplace
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
