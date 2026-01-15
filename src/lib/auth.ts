import { account } from './appwrite'
import { ID } from 'appwrite'

export interface User {
    $id: string
    email: string
    name: string
}

export const authService = {
    // Register new user
    async register(email: string, password: string, name: string): Promise<User> {
        try {
            const user = await account.create(ID.unique(), email, password, name)
            // Auto login after registration
            await this.login(email, password)
            return user as User
        } catch (error) {
            console.error('Registration error:', error)
            throw error
        }
    },

    // Login user
    async login(email: string, password: string): Promise<any> {
        try {
            return await account.createEmailPasswordSession(email, password)
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    },

    // Logout user
    async logout(): Promise<void> {
        try {
            await account.deleteSession('current')
        } catch (error) {
            console.error('Logout error:', error)
            throw error
        }
    },

    // Get current user
    async getCurrentUser(): Promise<User | null> {
        try {
            const user = await account.get()
            return user as User
        } catch (error) {
            return null
        }
    },

    // Check if user is logged in
    async isLoggedIn(): Promise<boolean> {
        try {
            await account.get()
            return true
        } catch {
            return false
        }
    }
}
