import { ShoppingCart, Search, User, Menu, Gamepad2, LogOut, Shield } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { AuthDialog } from './AuthDialog'
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
    const [authDialogOpen, setAuthDialogOpen] = useState(false)
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
    const [isAdmin, setIsAdmin] = useState(false)

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

    const openRegisterDialog = () => {
        setAuthMode('register')
        setAuthDialogOpen(true)
    }

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
                            <Link to="/about">About</Link>
                        </Button>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="hidden sm:flex">
                            <Search className="w-5 h-5" />
                        </Button>

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
                                        <a href="/profile">Profile</a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <a href="/orders">Orders</a>
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

                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart className="w-5 h-5" />
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                            >
                                0
                            </Badge>
                        </Button>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <AuthDialog
                open={authDialogOpen}
                onOpenChange={setAuthDialogOpen}
                mode={authMode}
                onModeChange={setAuthMode}
            />
        </header>
    )
}
