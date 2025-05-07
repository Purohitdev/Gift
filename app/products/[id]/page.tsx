"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import ProductGallery from "@/components/product/product-gallery"
import ProductInfo from "@/components/product/product-info"
import ProductHighlights from "@/components/product/product-highlights"
import SampleWorks from "@/components/product/sample-works"
import FaqSection from "@/components/product/faq-section"
import FomoPopup from "@/components/product/fomo-popup"
import RelatedProducts from "@/components/product/related-products"
import { products } from "@/lib/data"

export default function ProductDetailPage() {
  const params = useParams()

  // In a real app, you would fetch this data from an API
  const productId = Number.parseInt(params.id as string)
  const product = products.find((p) => p.id === productId) || products[0]

  // Save recently viewed products to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")

        // Add current product to the beginning if it's not already there
        if (!recentlyViewed.includes(productId)) {
          const newRecentlyViewed = [productId, ...recentlyViewed].slice(0, 10) // Keep only 10 most recent
          localStorage.setItem("recentlyViewed", JSON.stringify(newRecentlyViewed))
        } else {
          // Move to the beginning if already in the list
          const filteredViewed = recentlyViewed.filter((id: number) => id !== productId)
          const newRecentlyViewed = [productId, ...filteredViewed].slice(0, 10)
          localStorage.setItem("recentlyViewed", JSON.stringify(newRecentlyViewed))
        }
      } catch (error) {
        console.error("Failed to update recently viewed products:", error)
      }
    }
  }, [productId])

  return (
    <main className="min-h-screen pb-16">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>

        <ProductHighlights />
        <SampleWorks />
        <FaqSection />
      </div>
      <RelatedProducts currentProductId={productId} />
      <FomoPopup />
    </main>
  )
}
