import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '../components/Hero'
import { FeaturedProducts } from '../components/FeaturedProducts'
import { Categories } from '../components/Categories'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
    </>
  )
}
