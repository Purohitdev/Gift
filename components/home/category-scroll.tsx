"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { categories } from "@/lib/data"

export default function CategoryScroll() {
  const scrollRef = useRef<HTMLDivElement>(null)

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
            <Link key={category.id} href={category.link} className="flex-shrink-0 snap-start py-2">
              <div className="flex flex-col items-center group">
                <div className="relative h-32 w-32 md:h-60 md:w-60 rounded-full overflow-hidden mb-3 border-2 border-pastel-lavender shadow-pastel transition-transform duration-300 group-hover:scale-105">
                  <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
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
