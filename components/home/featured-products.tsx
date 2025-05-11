"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product/product-card"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products?sort=featured&limit=8')
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured products')
        }
        
        const data = await response.json()
        setProducts(data.products.slice(0, 4))
      } catch (error) {
        console.error('Error fetching featured products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Our most popular and highly rated gifts</p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="mt-4 md:mt-0">
              View All Products
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-md bg-gray-200 h-64 mb-3"></div>
                <div className="bg-gray-200 h-5 w-3/4 mb-2 rounded"></div>
                <div className="bg-gray-200 h-4 w-1/2 mb-3 rounded"></div>
                <div className="flex justify-between items-center">
                  <div className="bg-gray-200 h-6 w-1/4 rounded"></div>
                  <div className="bg-gray-200 h-9 w-1/3 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
