import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/data"
import ProductCard from "@/components/product/product-card"

export default function TrendingProducts() {
  // Get top 4 products by review count
  const trendingProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4)

  return (
    <section className="py-12 md:py-16 bg-pastel-cream/30">
      <div className="container px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold">Trending Now</h2>
          <Link href="/products?sort=rating">
            <Button variant="outline" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
