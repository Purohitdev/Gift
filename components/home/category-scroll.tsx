"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Category {
  _id: string;
  id: number;
  name: string;
  image?: {
    data: Buffer;
    contentType: string;
  } | string;
  imageUrl?: string;
  link: string;
}

export default function CategoryScroll() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/categories')
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount = 300

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  if (loading) {
    return (
      <section className="py-12 bg-pastel-cream/30">
        <div className="container px-4">
          <h2 className="text-2xl font-serif font-bold mb-8 text-center">Shop by Category</h2>
          <div className="flex overflow-x-auto space-x-6 pb-4 px-2 -mx-4 scrollbar-thin scrollbar-thumb-pastel-lavender scrollbar-track-transparent">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse min-w-[150px] flex-shrink-0">
                <div className="bg-gray-200 h-28 w-28 rounded-full mb-3 mx-auto"></div>
                <div className="bg-gray-200 h-5 w-24 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold">Shop by Category</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => scroll("left")} aria-label="Scroll left">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")} aria-label="Scroll right">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 pb-4" ref={scrollRef}>
          {categories.map((category) => (
            <Link key={category._id} href={category.link} className="flex-shrink-0 snap-start py-2">
              <div className="flex flex-col items-center group">                <div className="relative h-32 w-32 md:h-60 md:w-60 rounded-full overflow-hidden mb-3 border-2 border-pastel-lavender shadow-pastel transition-transform duration-300 group-hover:scale-105">
                  <Image src={`/api/categories/${category.id}/image`} alt={category.name} fill className="object-cover" />
                </div>
                <h3 className="text-sm md:text-base font-medium text-center">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
