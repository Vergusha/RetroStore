import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService, type User } from '../lib/auth'

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, name: string) => Promise<void>
    logout: () => Promise<void>
    loginWithGithub: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkUser()
    }, [])

    async function checkUser() {
        try {
            const currentUser = await authService.getCurrentUser()
            setUser(currentUser)
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    async function login(email: string, password: string) {
        await authService.login(email, password)
        await checkUser()
    }

    async function register(email: string, password: string, name: string) {
        await authService.register(email, password, name)
        await checkUser()
    }

    async function logout() {
        await authService.logout()
        setUser(null)
    }

    async function loginWithGithub() {
        await authService.loginWithGithub()
        // After OAuth redirect, user will be set by checkUser
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGithub }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
