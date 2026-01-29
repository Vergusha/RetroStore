import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Gamepad2 } from 'lucide-react'
import { Button } from './ui/button'

export function Footer() {
    return (
        <footer className="border-t bg-gradient-to-b from-muted/30 to-muted/50">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* About */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Gamepad2 className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold">
                                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">RETRO</span>
                                <span className="text-foreground">STORE</span>
                            </h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your trusted source for retro and modern gaming consoles. Quality and authenticity guaranteed.
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground" asChild>
                                <a href="#" aria-label="Facebook">
                                    <Facebook className="w-4 h-4" />
                                </a>
                            </Button>
                            <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground" asChild>
                                <a href="#" aria-label="Twitter">
                                    <Twitter className="w-4 h-4" />
                                </a>
                            </Button>
                            <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground" asChild>
                                <a href="#" aria-label="Instagram">
                                    <Instagram className="w-4 h-4" />
                                </a>
                            </Button>
                            <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground" asChild>
                                <a href="#" aria-label="YouTube">
                                    <Youtube className="w-4 h-4" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
                            <li><a href="/products" className="hover:text-primary transition-colors">Consoles</a></li>
                            <li><a href="/categories" className="hover:text-primary transition-colors">Categories</a></li>
                            <li><a href="/about" className="hover:text-primary transition-colors">About</a></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold">Customer Service</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="/faq" className="hover:text-primary transition-colors">FAQ</a></li>
                            <li><a href="/shipping" className="hover:text-primary transition-colors">Shipping</a></li>
                            <li><a href="/returns" className="hover:text-primary transition-colors">Returns</a></li>
                            <li><a href="/payment" className="hover:text-primary transition-colors">Payment</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold">Contact</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                                <span>123 Gaming Street, Console City</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                                <span>hello@retrostore.com</span>
                            </li>
                        </ul>
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
