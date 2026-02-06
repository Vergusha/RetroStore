import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { Breadcrumbs } from '../components/Breadcrumbs'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '../components/ui/collapsible'
import { useState } from 'react'

export const Route = createFileRoute('/faq')({
    component: FAQPage,
})

interface FAQItem {
    question: string
    answer: string
}

const faqItems: FAQItem[] = [
    {
        question: 'What types of products do you sell?',
        answer: 'We specialize in retro and modern gaming consoles, including classic systems like the NES, SNES, Sega Genesis, PlayStation 1 & 2, Nintendo 64, and many more. We also have a marketplace where verified sellers can list their own gaming items.',
    },
    {
        question: 'Are all products authentic?',
        answer: 'Yes! All products sold directly by RETRO STORE are verified for authenticity. For marketplace items, our sellers go through a verification process, and we encourage buyers to check seller ratings and reviews before purchasing.',
    },
    {
        question: 'Do consoles come with accessories?',
        answer: 'Each product listing clearly states what is included. Most consoles come with at least one controller and necessary cables. Check the product description for specific details about included accessories.',
    },
    {
        question: 'What condition are the products in?',
        answer: "We categorize our products by condition: New, Like New, Good, Fair, and Poor. Each listing includes detailed information about the item's condition, including any cosmetic or functional issues.",
    },
    {
        question: 'How can I become a seller?',
        answer: "To become a seller on our marketplace, go to your Profile page and click 'Become a Seller'. You'll need to submit a verification request with your information and ID document. Our team reviews requests within 2-3 business days.",
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit cards (Visa, MasterCard, American Express), debit cards, and PayPal. All payments are processed securely through our payment providers.',
    },
    {
        question: 'Can I cancel my order?',
        answer: "Orders can be cancelled if they haven't been shipped yet. Please contact us as soon as possible if you need to cancel. Once an order is shipped, you'll need to wait for delivery and then initiate a return.",
    },
    {
        question: 'Do you offer international shipping?',
        answer: 'Currently, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can see the exact shipping cost during checkout before completing your purchase.',
    },
    {
        question: 'What is your warranty policy?',
        answer: 'All consoles sold directly by RETRO STORE come with a 30-day warranty covering functional defects. Marketplace items may have different warranty terms set by individual sellers.',
    },
    {
        question: 'How do I contact customer support?',
        answer: 'You can reach our customer support team via email at hello@retrostore.com or by phone at +1 (555) 123-4567. We respond to all inquiries within 24-48 hours.',
    },
]

function FAQItemComponent({ item }: { item: FAQItem }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-muted/50 rounded-lg transition-colors">
                <span className="font-medium">{item.question}</span>
                <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
                <p className="text-muted-foreground">{item.answer}</p>
            </CollapsibleContent>
        </Collapsible>
    )
}

function FAQPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-8">
                <Breadcrumbs items={[{ label: 'FAQ', current: true }]} />
            </div>

            {/* Hero Section */}
            <div className="text-center mb-16">
                <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-primary/10">
                        <HelpCircle className="w-12 h-12 text-primary" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Find answers to common questions about our products, shipping, and more
                </p>
            </div>

            {/* FAQ List */}
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Common Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y">
                        {faqItems.map((item, index) => (
                            <FAQItemComponent key={index} item={item} />
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Contact Section */}
            <div className="max-w-3xl mx-auto mt-12 text-center">
                <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                        <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
                        <p className="text-muted-foreground mb-4">
                            Can't find what you're looking for? We're here to help!
                        </p>
                        <p className="text-muted-foreground">
                            Email us at{' '}
                            <a href="mailto:hello@retrostore.com" className="text-primary hover:underline">
                                hello@retrostore.com
                            </a>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
