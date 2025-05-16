"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

type Product = {
  _id: string
  name: string
  img?: string
  images?: { data: Buffer; contentType: string }[]
}

export default function ProductGallery({ product }: { product: Product }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)

  const MAX_ZOOM = 4
  const MIN_ZOOM = 1

  const images: string[] = []

  if (product._id) {
    images.push(`/api/products/${product._id}/image`)
  } else {
    images.push("/placeholder.svg")
  }

  if (product._id && product.images?.length) {
    for (let i = 0; i < product.images.length; i++) {
      images.push(`/api/products/${product._id}/images/${i}`)
    }
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  useEffect(() => {
    if (!isAutoplay || zoomLevel > 1) return

    const interval = setInterval(nextImage, 3000)
    return () => clearInterval(interval)
  }, [isAutoplay, zoomLevel])

  useEffect(() => {
    setZoomLevel(1)
  }, [currentImage])

  return (
    <div className="space-y-4">
      <div
        className={`relative aspect-square overflow-hidden rounded-lg bg-muted cursor-${
          zoomLevel === 1 ? "zoom-in" : "zoom-out"
        }`}
      >
        <Image
          src={images[currentImage]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 ease-in-out"
          style={{ transform: `scale(${zoomLevel})` }}
          priority
        />

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 text-foreground hover:bg-white/90"
          onClick={(e) => {
            e.preventDefault()
            if (zoomLevel === MIN_ZOOM) prevImage()
          }}
          aria-label="Previous image"
          disabled={zoomLevel !== MIN_ZOOM}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 text-foreground hover:bg-white/90"
          onClick={(e) => {
            e.preventDefault()
            if (zoomLevel === MIN_ZOOM) nextImage()
          }}
          aria-label="Next image"
          disabled={zoomLevel !== MIN_ZOOM}
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
              if (zoomLevel === MIN_ZOOM) setIsAutoplay(!isAutoplay)
            }}
            aria-label={isAutoplay ? "Pause slideshow" : "Play slideshow"}
            disabled={zoomLevel !== MIN_ZOOM}
          >
            {isAutoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>

        {/* Zoom Out Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-12 bottom-2 h-8 w-8 rounded-full bg-white/80 text-foreground hover:bg-white/90"
          aria-label="Zoom out"
          onClick={(e) => {
            e.preventDefault()
            setIsAutoplay(false)
            setZoomLevel((prev) => (prev === MIN_ZOOM ? MIN_ZOOM : prev - 1))
          }}
          disabled={zoomLevel === MIN_ZOOM}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        {/* Zoom In Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-white/80 text-foreground hover:bg-white/90"
          aria-label="Zoom in"
          onClick={(e) => {
            e.preventDefault()
            setIsAutoplay(false)
            setZoomLevel((prev) => (prev === MAX_ZOOM ? MAX_ZOOM : prev + 1))
          }}
          disabled={zoomLevel === MAX_ZOOM}
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
                if (zoomLevel === MIN_ZOOM) {
                  setCurrentImage(index)
                  setIsAutoplay(false)
                }
              }}
              aria-label={`Go to image ${index + 1}`}
              disabled={zoomLevel !== MIN_ZOOM}
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
              if (zoomLevel === MIN_ZOOM) {
                setCurrentImage(index)
                setIsAutoplay(false)
              }
            }}
            disabled={zoomLevel !== MIN_ZOOM}
          >
            <Image src={image} alt={`Product thumbnail ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
