import { products } from "@/lib/data"
import ProductCard from "@/components/product/product-card"

export default function TopSellingPage() {
  // Sort products by rating and review count to get "top selling"
  const topSellingProducts = [...products].sort((a, b) => {
    const scoreA = a.rating * a.reviewCount
    const scoreB = b.rating * b.reviewCount
    return scoreB - scoreA
  })

  return (
    <main className="min-h-screen py-12">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Top Selling Products</h1>
          <p className="text-muted-foreground">Our most popular and loved personalized gifts</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topSellingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  )
}
