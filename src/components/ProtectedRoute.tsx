import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && !user) {
            navigate({ to: '/' })
        }
    }, [user, loading, navigate])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return <>{children}</>
}
