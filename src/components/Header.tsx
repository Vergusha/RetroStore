import { Search, User, Gamepad2, LogOut, Shield, Receipt, UserCircle } from 'lucide-react'
import { Button } from './ui/button'
import { useAuth } from '../contexts/AuthContext'
import { useFavorites } from '../contexts/FavoritesContext'
import { AuthDialog } from './AuthDialog'
import { CartSheet } from './CartSheet'
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

    const [glitchActive, setGlitchActive] = useState(false)

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
        <header className="border-b-4 border-primary bg-background px-4 py-4 relative overflow-hidden">
            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--primary) 2px, var(--primary) 4px)'
                }}
            />
            <div className="container mx-auto">
                <div className="flex items-center justify-between relative z-10">
                    {/* Logo & Navigation */}
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-4 group">
                            <Gamepad2 className="w-10 h-10 text-primary" strokeWidth={2.5} />
                            <div
                                className="text-primary uppercase tracking-wider cursor-pointer"
                                style={{
                                    fontSize: '1.5rem',
                                    textShadow: '0 0 10px var(--primary), 0 0 20px var(--primary)',
                                    lineHeight: '1.5'
                                }}
                                onMouseEnter={() => setGlitchActive(true)}
                                onMouseLeave={() => setGlitchActive(false)}
                            >
                                <span className={glitchActive ? 'retro-glitch' : ''} data-text="R3TR0_SH0P">
                                    {glitchActive ? 'R3TR0_SH0P' : 'RETRO SHOP'}
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1 ml-4">
                            <Button variant="ghost" asChild className="hover:bg-primary/20 text-primary hover:text-primary font-bold tracking-wider rounded-none">
                                <Link to="/products" search={{ category: undefined }}>CONSOLES</Link>
                            </Button>
                            <Button variant="ghost" asChild className="hover:bg-primary/20 text-primary hover:text-primary font-bold tracking-wider rounded-none">
                                <Link to="/marketplace" className="flex items-center gap-1">
                                    MARKETPLACE
                                </Link>
                            </Button>
                            <Button variant="ghost" asChild className="hover:bg-primary/20 text-primary hover:text-primary font-bold tracking-wider rounded-none">
                                <Link to="/favorites" className="relative flex items-center gap-1">
                                    FAVORITES
                                    {favCount > 0 && (
                                        <span className="ml-1 text-[10px] bg-secondary text-secondary-foreground px-1">
                                            {favCount}
                                        </span>
                                    )}
                                </Link>
                            </Button>
                        </nav>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex relative group">
                            <Link to="/products" className="absolute inset-0 z-10" />
                            <Button
                                variant="outline"
                                className="border-2 border-primary bg-black text-primary hover:bg-primary hover:text-black rounded-none h-10 px-4 font-mono text-xs uppercase"
                                onClick={() => setSearchOpen(true)}
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Search...
                            </Button>
                        </div>

                        <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="md:hidden text-primary">
                            <Search className="w-5 h-5" />
                        </Button>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none gap-2 font-bold uppercase" size="icon">
                                        <User className="w-6 h-6" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-black border-2 border-primary rounded-none shadow-[4px_4px_0px_0px_var(--primary)] text-primary">
                                    <DropdownMenuLabel className="font-mono uppercase">{user.name}</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-primary/30" />
                                    <DropdownMenuItem asChild className="focus:bg-primary focus:text-black cursor-pointer font-mono uppercase text-xs">
                                        <Link to="/profile">
                                            <UserCircle className="w-4 h-4 mr-2" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="focus:bg-primary focus:text-black cursor-pointer font-mono uppercase text-xs">
                                        <Link to="/orders">
                                            <Receipt className="w-4 h-4 mr-2" />
                                            Orders
                                        </Link>
                                    </DropdownMenuItem>
                                    {isAdmin && (
                                        <>
                                            <DropdownMenuSeparator className="bg-primary/30" />
                                            <DropdownMenuItem asChild className="focus:bg-primary focus:text-black cursor-pointer font-mono uppercase text-xs">
                                                <Link to="/admin" className="text-secondary text-shadow-neon-pink">
                                                    <Shield className="w-4 h-4 mr-2" />
                                                    Admin Panel
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuSeparator className="bg-primary/30" />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer font-mono uppercase text-xs">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black rounded-none font-bold uppercase" onClick={openLoginDialog}>
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
