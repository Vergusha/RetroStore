import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from './ui/card'

interface Testimonial {
    name: string
    role: string
    avatar: string
    rating: number
    text: string
}

const testimonials: Testimonial[] = [
    {
        name: 'Alex Johnson',
        role: 'Retro Collector',
        avatar: 'AJ',
        rating: 5,
        text: 'Found a mint condition SNES here that I\'ve been hunting for years. Authentic product, carefully packaged. This is my go-to store now!',
    },
    {
        name: 'Maria Chen',
        role: 'Casual Gamer',
        avatar: 'MC',
        rating: 5,
        text: 'The marketplace feature is fantastic. Bought a Game Boy Color from a verified seller and it was exactly as described. Great experience!',
    },
    {
        name: 'David Kim',
        role: 'Speedrunner',
        avatar: 'DK',
        rating: 5,
        text: 'Amazing selection of retro consoles. The condition ratings are accurate and customer support is super responsive. Highly recommend!',
    },
]

export function Testimonials() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                        What Gamers Say
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of satisfied retro gaming enthusiasts
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="relative overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <CardContent className="pt-8 pb-6 px-6">
                                <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />

                                {/* Stars */}
                                <div className="flex gap-0.5 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>

                                {/* Text */}
                                <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                                    "{testimonial.text}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{testimonial.name}</p>
                                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
