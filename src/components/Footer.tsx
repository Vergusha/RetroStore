import { Mail, Gamepad2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* About */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Gamepad2 className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold">
                                <span className="text-primary">RETRO</span>
                                <span className="text-foreground">STORE</span>
                            </h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your trusted source for retro and modern gaming consoles. Quality and authenticity guaranteed.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/products" className="hover:text-primary transition-colors">Consoles</Link></li>
                            <li><Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
                            <li><Link to="/favorites" className="hover:text-primary transition-colors">My Favorites</Link></li>
                            <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold">Customer Service</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link to="/shipping" className="hover:text-primary transition-colors">Shipping</Link></li>
                            <li><Link to="/returns" className="hover:text-primary transition-colors">Returns</Link></li>
                            <li><Link to="/payment" className="hover:text-primary transition-colors">Payment</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold">Contact</h4>
                        <p className="text-sm text-muted-foreground">
                            Have questions? We'd love to hear from you.
                        </p>
                        <a
                            href="mailto:support@example.com"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <Mail className="w-4 h-4" />
                            Contact Us
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; 2026 Retro Store. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
