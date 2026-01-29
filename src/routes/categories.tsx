import { createFileRoute } from '@tanstack/react-router'
import { Categories } from '../components/Categories'
import { Breadcrumbs } from '../components/Breadcrumbs'

export const Route = createFileRoute('/categories')({
    component: CategoriesPage,
})

function CategoriesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Game Categories</h1>
                <p className="text-muted-foreground">
                    Browse our collection by your favorite gaming genres and platforms
                </p>
                <Breadcrumbs items={[{ label: 'Categories', current: true }]} />
            </div>
            <Categories />
        </div>
    )
}
