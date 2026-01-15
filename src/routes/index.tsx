import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { FeaturedProducts } from '../components/FeaturedProducts'
import { Categories } from '../components/Categories'
import { Footer } from '../components/Footer'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Footer />
    </div>
  )
}
