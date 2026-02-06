import { useState } from 'react'
import { Send, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function Newsletter() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return

        setStatus('loading')
        // Simulate subscription
        setTimeout(() => {
            setStatus('success')
            setEmail('')
            setTimeout(() => setStatus('idle'), 3000)
        }, 1000)
    }

    return (
        <section className="py-16 bg-primary/5 border-y">
            <div className="container mx-auto px-4">
                <div className="max-w-xl mx-auto text-center space-y-6">
                    <h3 className="text-2xl md:text-3xl font-bold">
                        Stay in the Loop
                    </h3>
                    <p className="text-muted-foreground">
                        Get notified about new arrivals, rare finds, and exclusive deals.
                        No spam, unsubscribe anytime.
                    </p>

                    {status === 'success' ? (
                        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 py-3">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Thanks for subscribing!</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="flex-1 h-11 rounded-xl"
                            />
                            <Button
                                type="submit"
                                disabled={status === 'loading'}
                                className="h-11 px-6 rounded-xl"
                            >
                                {status === 'loading' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Subscribe
                                        <Send className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}
