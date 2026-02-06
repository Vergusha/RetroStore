import { Menu, Home, Package, Grid, Store, Info, Heart, ShoppingBag } from 'lucide-react'
import { Button } from './ui/button'
import { Link } from '@tanstack/react-router'
import { useFavorites } from '../contexts/FavoritesContext'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from './ui/sheet'
import { Separator } from './ui/separator'
import { useState } from 'react'

export function MobileNav() {
    const [open, setOpen] = useState(false)
    const { getFavoritesCount } = useFavorites()
    const favCount = getFavoritesCount()

    const handleLinkClick = () => setOpen(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
                <SheetHeader>
                    <SheetTitle className="text-left">
                        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">RETRO</span>
                        <span className="text-foreground">STORE</span>
                    </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-6">
                    <Link to="/" onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium">
                        <Home className="w-5 h-5 text-primary" />
                        Home
                    </Link>
                    <Link to="/products" search={{ category: undefined }} onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium">
                        <Package className="w-5 h-5 text-primary" />
                        Consoles
                    </Link>
                    <Link to="/categories" onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium">
                        <Grid className="w-5 h-5 text-primary" />
                        Categories
                    </Link>
                    <Link to="/marketplace" onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium">
                        <Store className="w-5 h-5 text-primary" />
                        Marketplace
                    </Link>
                    <Link to="/favorites" onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium">
                        <Heart className="w-5 h-5 text-primary" />
                        Favorites
                        {favCount > 0 && (
                            <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {favCount}
                            </span>
                        )}
                    </Link>

                    <Separator className="my-3" />

                    <Link to="/about" onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium text-muted-foreground">
                        <Info className="w-5 h-5" />
                        About
                    </Link>
                    <Link to="/faq" onClick={handleLinkClick} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors font-medium text-muted-foreground">
                        <ShoppingBag className="w-5 h-5" />
                        FAQ
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    )
}
