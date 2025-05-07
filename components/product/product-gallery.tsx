

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

type Product = {
  name: string
  img?: string
  images?: string[]
}

export default function ProductGallery({ product }: { product: Product }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  const images: string[] = product.images?.length
    ? product.images
    : [product.img || "/placeholder.svg"]

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  useEffect(() => {
    if (!isAutoplay) return

    const interval = setInterval(nextImage, 3000)
    return () => clearInterval(interval)
  }, [isAutoplay])

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={images[currentImage]}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-300"
          priority
        />

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 text-foreground hover:bg-white/90"
          onClick={(e) => {
            e.preventDefault()
            prevImage()
            setIsAutoplay(false)
          }}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 text-foreground hover:bg-white/90"
          onClick={(e) => {
            e.preventDefault()
            nextImage()
            setIsAutoplay(false)
          }}
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="absolute bottom-2 left-2 flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 text-foreground hover:bg-white/90"
            onClick={(e) => {
              e.preventDefault()
              setIsAutoplay(!isAutoplay)
            }}
            aria-label={isAutoplay ? "Pause slideshow" : "Play slideshow"}
          >
            {isAutoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-white/80 text-foreground hover:bg-white/90"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
          {images.map((image: string, index: number) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${
                currentImage === index ? "bg-primary" : "bg-white/50"
              }`}
              onClick={(e) => {
                e.preventDefault()
                setCurrentImage(index)
                setIsAutoplay(false)
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((image: string, index: number) => (
          <button
            key={index}
            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md ${
              currentImage === index ? "ring-2 ring-primary" : "ring-1 ring-border"
            }`}
            onClick={() => {
              setCurrentImage(index)
              setIsAutoplay(false)
            }}
          >
            <Image
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
