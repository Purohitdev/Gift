"use client"

import { useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SampleWorks() {
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

  // Sample works - in a real app, this would come from your data
  const samples = [
    "https://i.pinimg.com/736x/c2/13/cd/c213cd7d99c048039d05257374686719.jpg",
    "https://i.pinimg.com/736x/3d/24/75/3d2475a34898e22e6e7b5b833079ea75.jpg",
    "https://i.pinimg.com/736x/cb/96/c5/cb96c51d8a7d4ad615fd232301a8f83b.jpg",
    "https://i.pinimg.com/736x/16/e3/6f/16e36f4679ff4d5411ff3efbc5142c0a.jpg",
    "https://i.pinimg.com/736x/ee/30/34/ee3034255fbfc8a3357acc2f87edc423.jpg",
  ]

  return (
    <section className="py-12 bg-pastel-cream/30 rounded-lg">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold">Sample Works</h2>
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
          {samples.map((sample, index) => (
            <div key={index} className="flex-shrink-0 snap-start w-[250px] md:w-[300px]">
              <div className="bg-white rounded-lg overflow-hidden shadow-pastel">
                <div className="relative aspect-square">
                  <Image
                    src={sample || "/placeholder.svg"}
                    alt={`Sample work ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">Customer Design #{index + 1}</h3>
                  <p className="text-sm text-muted-foreground">
                    {index % 2 === 0 ? "Anniversary Gift" : "Birthday Present"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
