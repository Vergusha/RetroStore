import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { adminService } from '../lib/admin'

interface AdminRouteProps {
    children: React.ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
    const { user, loading } = useAuth()
    const navigate = useNavigate()
    const [isAdmin, setIsAdmin] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        async function checkAdmin() {
            if (!loading) {
                if (!user) {
                    navigate({ to: '/' })
                    return
                }

                try {
                    const adminStatus = await adminService.isAdmin()
                    setIsAdmin(adminStatus)

                    if (!adminStatus) {
                        navigate({ to: '/' })
                    }
                } catch (error) {
                    navigate({ to: '/' })
                } finally {
                    setChecking(false)
                }
            }
        }

        checkAdmin()
    }, [user, loading, navigate])

    if (loading || checking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                    <p className="text-muted-foreground">Checking permissions...</p>
                </div>
            </div>
        )
    }

    if (!isAdmin) {
        return null
    }

    return <>{children}</>
}
