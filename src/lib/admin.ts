import { account } from './appwrite'

// Admin emails from environment variables
const ADMIN_EMAILS = import.meta.env.VITE_ADMIN_EMAILS?.split(',').map((email: string) => email.trim()) || []

export const adminService = {
    async isAdmin(): Promise<boolean> {
        try {
            if (ADMIN_EMAILS.length === 0) {
                console.warn('No admin emails configured')
                return false
            }
            const user = await account.get()
            return ADMIN_EMAILS.includes(user.email)
        } catch {
            return false
        }
    },

    async requireAdmin(): Promise<void> {
        const isAdmin = await this.isAdmin()
        if (!isAdmin) {
            throw new Error('Unauthorized: Admin access required')
        }
    }
}
