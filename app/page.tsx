import HeroSlider from "@/components/home/hero-slider"
import CategoryScroll from "@/components/home/category-scroll"
import FeaturedProducts from "@/components/home/featured-products"
import TestimonialsCarousel from "@/components/home/testimonials-carousel"
import HowItWorks from "@/components/home/how-it-works"
// import InstagramFeed from "@/components/home/instagram-feed"
import WhatsappButton from "@/components/layout/whatsapp-button"
import TrendingProducts from "@/components/home/trending-products"
import FaqSection from "@/components/product/faq-section"
import SupportSection from "@/components/home/SupportSection"

export default function HomePage() {
  return (
<main className="min-h-screen bg-gradient-to-b from-[#ffe9e3a8] via-[#faedcda8] to-[#fde2e2a8]">
      <HeroSlider />
      <CategoryScroll />
      <FeaturedProducts />
      <TrendingProducts />
      <TestimonialsCarousel />
            <FaqSection/>
           

      <HowItWorks />
       <SupportSection/>
      {/* <InstagramFeed /> */}

      <WhatsappButton />
    </main>
  )
}
