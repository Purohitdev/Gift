"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/data"
import ProductCard from "@/components/product/product-card"

export default function FeaturedProducts() {
  return (
    <section className="py-12 md:py-16 bg-pastel-cream/50">
      <div className="container px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular personalized gifts that make every occasion special
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">View All Products</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
