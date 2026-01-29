import { Link } from '@tanstack/react-router'
import { Home, ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
    label: string
    href?: string
    current?: boolean
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link to="/" className="flex items-center gap-1 hover:text-foreground text-muted-foreground transition-colors">
                <Home className="h-4 w-4" />
                Home
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    {item.current ? (
                        <span className="font-medium text-foreground">{item.label}</span>
                    ) : item.href ? (
                        <Link
                            to={item.href}
                            className="hover:text-foreground text-muted-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-medium text-muted-foreground">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    )
}
