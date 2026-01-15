import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useAuth } from '../contexts/AuthContext'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2 } from 'lucide-react'

interface AuthDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mode: 'login' | 'register'
    onModeChange: (mode: 'login' | 'register') => void
}

export function AuthDialog({ open, onOpenChange, mode, onModeChange }: AuthDialogProps) {
    const { login, register } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (mode === 'login') {
                await login(email, password)
            } else {
                if (!name.trim()) {
                    setError('Name is required')
                    setLoading(false)
                    return
                }
                await register(email, password, name)
            }
            onOpenChange(false)
            setEmail('')
            setPassword('')
            setName('')
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const switchMode = () => {
        setError('')
        onModeChange(mode === 'login' ? 'register' : 'login')
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'login' ? 'Login' : 'Create Account'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'login'
                            ? 'Enter your credentials to access your account'
                            : 'Create a new account to start shopping'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            disabled={loading}
                        />
                        {mode === 'register' && (
                            <p className="text-xs text-muted-foreground">
                                Password must be at least 8 characters
                            </p>
                        )}
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {mode === 'login' ? 'Login' : 'Create Account'}
                    </Button>

                    <div className="text-center text-sm">
                        <button
                            type="button"
                            onClick={switchMode}
                            className="text-primary hover:underline"
                            disabled={loading}
                        >
                            {mode === 'login'
                                ? "Don't have an account? Sign up"
                                : 'Already have an account? Login'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
