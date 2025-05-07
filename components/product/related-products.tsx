"use client"

import { products } from "@/lib/data"
import ProductCard from "@/components/product/product-card"

export default function RelatedProducts({ currentProductId }: { currentProductId: number }) {
  // Get current product to find its category
  const currentProduct = products.find((p) => p.id === currentProductId)

  // Filter related products (same category, excluding current product)
  const relatedProducts = currentProduct
    ? products
        .filter((p) => p.category === currentProduct.category && p.id !== currentProductId)
        .slice(0, 4) // Limit to 4 products
    : []

  // If not enough related products in same category, add some other products
  if (relatedProducts.length < 4) {
    const otherProducts = products
      .filter((p) => p.id !== currentProductId && !relatedProducts.some((rp) => rp.id === p.id))
      .slice(0, 4 - relatedProducts.length)

    relatedProducts.push(...otherProducts)
  }

  return (
    <section className="py-12 border-t">
      <div className="container px-4">
        <h2 className="text-2xl font-serif font-bold mb-8">You May Also Like</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
