"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useToast } from "@/hooks/use-toast"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  salePrice?: number | null
  img?: Buffer
  images?: { data: Buffer, contentType: string }[]
  category: string
  badge?: string | null
  rating: number
  reviewCount: number
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const inWishlist = isInWishlist(product._id)

  const productImages = []
  
  // Add main image
  productImages.push(`/api/products/${product._id}/image`)
  
  // Add additional images
  if (product.images?.length) {
    for (let i = 0; i < product.images.length; i++) {
      productImages.push(`/api/products/${product._id}/images/${i}`)
    }
  }

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isHovered, productImages.length])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()

    addItem({      id: product._id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice ?? null,
      image: `/api/products/${product._id}/image`,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (inWishlist) {
      removeFromWishlist(product._id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist({ 
        ...product, 
        salePrice: product.salePrice ?? null, 
        badge: product.badge ?? null,
        img: `/api/products/${product._id}/image`
      })
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  const handleCardClick = () => {
    router.push(`/products/${product._id}`)
  }

  return (
    <div
      className="group relative bg-white/60 rounded-lg overflow-hidden shadow-pastel transition-all duration-300 hover:shadow-lg cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={productImages[currentImageIndex]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.badge && (
          <Badge
            className={`absolute top-2 left-2 ${
              product.badge === "Sale"
                ? "bg-accent text-accent-foreground"
                : product.badge === "New"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {product.badge}
          </Badge>
        )}

        {/* Image indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
          {productImages.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-1.5 rounded-full ${currentImageIndex === index ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>

        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            size="sm"
            className="bg-white text-foreground hover:bg-white/90"
            aria-label="Add to cart"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            size="icon"
            variant={inWishlist ? "default" : "outline"}
            className={`h-9 w-9 ${
              inWishlist
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "bg-white text-foreground hover:bg-white/90"
            }`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 transition-colors group-hover:text-primary">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="font-bold text-lg">${product.salePrice}</span>
                <span className="text-sm text-muted-foreground line-through">${product.price}</span>
              </>
            ) : (
              <span className="font-bold text-lg">${product.price}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
