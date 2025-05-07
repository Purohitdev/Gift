import HeroSlider from "@/components/home/hero-slider"
import CategoryScroll from "@/components/home/category-scroll"
import FeaturedProducts from "@/components/home/featured-products"
import TestimonialsCarousel from "@/components/home/testimonials-carousel"
import HowItWorks from "@/components/home/how-it-works"
import InstagramFeed from "@/components/home/instagram-feed"
import WhatsappButton from "@/components/layout/whatsapp-button"
import TrendingProducts from "@/components/home/trending-products"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSlider />
      <CategoryScroll />
      <FeaturedProducts />
      <TrendingProducts />
      <TestimonialsCarousel />
      <HowItWorks />
      <InstagramFeed />
      <WhatsappButton />
    </main>
  )
}
