"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ProductGallery from "@/components/product/product-gallery"
import ProductInfo from "@/components/product/product-info"
import ProductHighlights from "@/components/product/product-highlights"
// import SampleWorks from "@/components/product/sample-works"
import FaqSection from "@/components/product/faq-section"
import FomoPopup from "@/components/product/fomo-popup"
import RelatedProducts from "@/components/product/related-products"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${productId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }
        
        const data = await response.json()
        setProduct(data)
        
        // Save recently viewed products to localStorage
        try {
          const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
          
          // Add current product to the beginning if it's not already there
          if (!recentlyViewed.includes(productId)) {
            const newRecentlyViewed = [productId, ...recentlyViewed].slice(0, 10) // Keep only 10 most recent
            localStorage.setItem("recentlyViewed", JSON.stringify(newRecentlyViewed))
          } else {
            // Move to the beginning if already in the list
            const filteredViewed = recentlyViewed.filter((id: string) => id !== productId)
            const newRecentlyViewed = [productId, ...filteredViewed].slice(0, 10)
            localStorage.setItem("recentlyViewed", JSON.stringify(newRecentlyViewed))
          }
        } catch (error) {
          console.error("Failed to update recently viewed products:", error)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('Failed to load product. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  if (loading) {
    return (
      <div className=" container px-4 py-8 min-h-screen bg-gradient-to-b from-[#ffe9e3a8] via-[#faedcda8] to-[#fde2e2a8]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/4 mt-6"></div>
            <div className="h-12 bg-gray-200 rounded w-full mt-6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen container px-4 py-8 flex items-center justify-center ">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The product you're looking for doesn't exist or has been removed."}</p>
          <a href="/products" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md">
            Browse Products
          </a>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen pb-16 bg-gradient-to-b from-[#ffe9e3a8] via-[#faedcda8] to-[#fde2e2a8]">
      <div className="container px-4 py-8">        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>

        <ProductHighlights highlights={product.highlights} />
        {/* <SampleWorks /> */}
              <RelatedProducts currentProductId={productId} />

        <FaqSection />
      </div>
      <FomoPopup />
    </main>
  )
}
