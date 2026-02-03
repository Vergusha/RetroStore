import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
    User,
    Mail,
    Package,
    Settings,
    LogOut,
    Edit2,
    Save,
    X,
    Loader2,
    ShoppingBag,
    Receipt
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { orderService, type Order } from '../lib/orders'
import { account } from '../lib/appwrite'

export const Route = createFileRoute('/profile')({
    component: ProfilePage,
})

function ProfilePage() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [recentOrders, setRecentOrders] = useState<Order[]>([])
    const [loadingOrders, setLoadingOrders] = useState(true)
    const [editedName, setEditedName] = useState(user?.name || '')

    useEffect(() => {
        if (!user) {
            navigate({ to: '/' })
            return
        }

        loadRecentOrders()
    }, [user, navigate])

    async function loadRecentOrders() {
        try {
            const orders = await orderService.getUserOrders()
            setRecentOrders(orders.slice(0, 3))
        } catch (error) {
            console.error('Error loading orders:', error)
        } finally {
            setLoadingOrders(false)
        }
    }

    const handleSaveName = async () => {
        if (!editedName.trim()) return

        setIsSaving(true)
        try {
            await account.updateName(editedName)
            setIsEditing(false)
            window.location.reload()
        } catch (error) {
            console.error('Error updating name:', error)
            alert('Failed to update name')
        } finally {
            setIsSaving(false)
        }
    }

    const handleLogout = async () => {
        try {
            await logout()
            navigate({ to: '/' })
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'processing':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'shipped':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
            case 'delivered':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <div className="p-8 rounded-full bg-muted inline-flex mb-6">
                        <User className="w-16 h-16 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Please log in</h1>
                    <p className="text-muted-foreground mb-8">
                        You need to be logged in to view your profile.
                    </p>
                    <Button asChild size="lg">
                        <Link to="/">Go Home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Account Information
                                </span>
                                {!isEditing ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setEditedName(user.name)
                                            setIsEditing(true)
                                        }}
                                    >
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsEditing(false)}
                                            disabled={isSaving}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleSaveName}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="w-10 h-10 text-primary" />
                                </div>
                                <div className="flex-1">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h2 className="text-xl font-semibold">{user.name}</h2>
                                            <p className="text-muted-foreground flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {user.email}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground text-sm">Member Since</Label>
                                    <p className="font-medium">January 2026</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-sm">Total Orders</Label>
                                    <p className="font-medium">{recentOrders.length} orders</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Recent Orders
                                </span>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/orders">View All</Link>
                                </Button>
                            </CardTitle>
                            <CardDescription>
                                Your most recent purchases
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingOrders ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : recentOrders.length === 0 ? (
                                <div className="text-center py-8">
                                    <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No orders yet</p>
                                    <Button asChild className="mt-4">
                                        <Link to="/products">Start Shopping</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <div
                                            key={order.$id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-2">
                                                    {order.items?.slice(0, 3).map((item, index) => (
                                                        <div
                                                            key={item.$id || index}
                                                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-background"
                                                        >
                                                            <img
                                                                src={item.productImage}
                                                                alt={item.productName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                    {(order.items?.length || 0) > 3 && (
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium">
                                                            +{(order.items?.length || 0) - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {order.items?.length} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(order.$createdAt || '').toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status}
                                                </Badge>
                                                <span className="font-semibold text-primary">
                                                    ${order.totalAmount.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link to="/orders">
                                    <Receipt className="w-4 h-4 mr-2" />
                                    Order History
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <Link to="/products">
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    Browse Products
                                </Link>
                            </Button>
                            <Separator className="my-4" />
                            <Button
                                variant="destructive"
                                className="w-full justify-start"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
