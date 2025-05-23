"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import ProductCard from "@/components/product/product-card"

export default function RelatedProducts({ currentProductId }: { currentProductId: string }) {
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true)
        // Fetch the current product first to get its category
        const productResponse = await fetch(`/api/products/${currentProductId}`)
        
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product')
        }
        
        const product = await productResponse.json()
        
        // Then fetch products in the same category
        const relatedResponse = await fetch(`/api/products?category=${product.category}&limit=6`)
        
        if (!relatedResponse.ok) {
          throw new Error('Failed to fetch related products')
        }
        
        const data = await relatedResponse.json()
        
        // Filter out the current product
        const filtered = data.products.filter((p: any) => p._id !== currentProductId)
        
        // Limit to 4 products
        setRelatedProducts(filtered.slice(0, 4))
      } catch (error) {
        console.error('Error fetching related products:', error)
        setRelatedProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    if (currentProductId) {
      fetchRelatedProducts()
    }
  }, [currentProductId])
  
  if (loading) {
    return (
      <div className="py-16 bg-pastel-cream/30">
        <div className="container px-4">
          <h2 className="text-2xl font-serif font-bold mb-8 text-center">You Might Also Like</h2>
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
        </div>
      </div>
    )
  }
  
  if (relatedProducts.length === 0) {
    return null
  }
  
  return (
    <div className="py-16 bg-pastel-cream/30">
      <div className="container px-4">
        <h2 className="text-2xl font-serif font-bold mb-8 text-center">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}
