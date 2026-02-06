import { Search, User, Gamepad2, LogOut, Shield, Receipt, UserCircle, Store, Heart } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { useFavorites } from '../contexts/FavoritesContext'
import { AuthDialog } from './AuthDialog'
import { CartSheet } from './CartSheet'
import { ThemeToggle } from './ThemeToggle'
import { MobileNav } from './MobileNav'
import { SearchDialog } from './SearchDialog'
import { useState, useEffect } from 'react'
import { adminService } from '../lib/admin'
import { Link } from '@tanstack/react-router'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function Header() {
    const { user, logout } = useAuth()
    const { getFavoritesCount } = useFavorites()
    const [authDialogOpen, setAuthDialogOpen] = useState(false)
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
    const [isAdmin, setIsAdmin] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const favCount = getFavoritesCount()

    useEffect(() => {
        async function checkAdmin() {
            if (user) {
                const adminStatus = await adminService.isAdmin()
                setIsAdmin(adminStatus)
            } else {
                setIsAdmin(false)
            }
        }
        checkAdmin()
    }, [user])

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const openLoginDialog = () => {
        setAuthMode('login')
        setAuthDialogOpen(true)
    }

    // Keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setSearchOpen(true)
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <Gamepad2 className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-xl font-bold tracking-tight">
                                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">RETRO</span>
                                <span className="text-foreground">STORE</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Button variant="ghost" asChild className="font-medium">
                            <Link to="/">Home</Link>
                        </Button>
                        <Button variant="ghost" asChild className="font-medium">
                            <Link to="/products" search={{ category: undefined }}>Consoles</Link>
                        </Button>
                        <Button variant="ghost" asChild className="font-medium">
                            <Link to="/categories">Categories</Link>
                        </Button>
                        <Button variant="ghost" asChild className="font-medium">
                            <Link to="/marketplace" className="flex items-center gap-1">
                                <Store className="w-4 h-4" />
                                Marketplace
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild className="font-medium">
                            <Link to="/favorites" className="relative flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                Favorites
                                {favCount > 0 && (
                                    <Badge variant="secondary" className="h-5 min-w-5 px-1 flex items-center justify-center text-[10px]">
                                        {favCount}
                                    </Badge>
                                )}
                            </Link>
                        </Button>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchOpen(true)}
                            className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <Search className="w-4 h-4" />
                            <span className="text-sm hidden lg:inline">Search...</span>
                            <kbd className="pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                ⌘K
                            </kbd>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="sm:hidden">
                            <Search className="w-5 h-5" />
                        </Button>

                        <ThemeToggle />

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <User className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to="/profile">
                                            <UserCircle className="w-4 h-4 mr-2" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/orders">
                                            <Receipt className="w-4 h-4 mr-2" />
                                            Orders
                                        </Link>
                                    </DropdownMenuItem>                                    {isAdmin && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link to="/admin" className="text-primary">
                                                    <Shield className="w-4 h-4 mr-2" />
                                                    Admin Panel
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant="ghost" size="sm" onClick={openLoginDialog}>
                                Login
                            </Button>
                        )}

                        <CartSheet />
                        <MobileNav />
                    </div>
                </div>
            </div>

            <AuthDialog
                open={authDialogOpen}
                onOpenChange={setAuthDialogOpen}
                mode={authMode}
                onModeChange={setAuthMode}
            />
            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </header>
    )
}
