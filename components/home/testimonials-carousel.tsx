// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { ChevronLeft, ChevronRight, Star } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { testimonials } from "@/lib/data"

// export default function TestimonialsCarousel() {
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [visibleTestimonials, setVisibleTestimonials] = useState<number[]>([])

//   const getVisibleCount = () => {
//     if (typeof window !== "undefined") {
//       if (window.innerWidth >= 1280) return 3
//       if (window.innerWidth >= 768) return 2
//       return 1
//     }
//     return 1
//   }

//   const updateVisibleTestimonials = () => {
//     const count = getVisibleCount()
//     const visible = []
//     for (let i = 0; i < count; i++) {
//       const index = (currentIndex + i) % testimonials.length
//       visible.push(index)
//     }
//     setVisibleTestimonials(visible)
//   }

//   useEffect(() => {
//     updateVisibleTestimonials()

//     const handleResize = () => {
//       updateVisibleTestimonials()
//     }

//     window.addEventListener("resize", handleResize)
//     return () => window.removeEventListener("resize", handleResize)
//   }, [currentIndex])

//   const nextSlide = () => {
//     setCurrentIndex((prev) => (prev + 1) % testimonials.length)
//   }

//   const prevSlide = () => {
//     setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
//   }

//   useEffect(() => {
//     const interval = setInterval(() => {
//       nextSlide()
//     }, 6000)
//     return () => clearInterval(interval)
//   }, [])

//   return (
//     <section className="py-12 md:py-16">
//       <div className="container px-4">
//         <div className="text-center mb-10">
//           <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">What Our Customers Say</h2>
//           <p className="text-muted-foreground max-w-2xl mx-auto">Read testimonials from our happy customers</p>
//         </div>

//         <div className="relative">
//           <div className="flex overflow-hidden">
//             <div
//               className="flex transition-transform duration-500 ease-in-out w-full"
//               style={{ transform: `translateX(-${currentIndex * (100 / getVisibleCount())}%)` }}
//             >
//               {testimonials.map((testimonial, index) => (
//                 <div key={testimonial.id} className="w-full md:w-1/2 xl:w-1/3 flex-shrink-0 px-4">
//                   <div className="bg-white/60 rounded-lg p-6 shadow-pastel h-full flex flex-col">
//                     <div className="flex items-center mb-4">
//                       <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
//                         <Image
//                           src={testimonial.avatar || "/placeholder.svg"}
//                           alt={testimonial.name}
//                           fill
//                           className="object-cover"
//                         />
//                       </div>
//                       <div>
//                         <h3 className="font-medium">{testimonial.name}</h3>
//                         <div className="flex">
//                           {[...Array(5)].map((_, i) => (
//                             <Star
//                               key={i}
//                               className={`h-4 w-4 ${
//                                 i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
//                               }`}
//                             />
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     <p className="text-muted-foreground flex-grow">"{testimonial.text}"</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 text-foreground hover:bg-white shadow-pastel"
//             onClick={prevSlide}
//             aria-label="Previous testimonial"
//           >
//             <ChevronLeft className="h-6 w-6" />
//           </Button>

//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 text-foreground hover:bg-white shadow-pastel"
//             onClick={nextSlide}
//             aria-label="Next testimonial"
//           >
//             <ChevronRight className="h-6 w-6" />
//           </Button>
//         </div>

//         <div className="mt-8 text-center">
//           <Link href="/testimonials">
//           <Button variant="outline" className="mt-4 md:mt-0 bg-white/40 border-[#12121253]">
//           View All Testimonials</Button>
            
//           </Link>
//         </div>
//       </div>
//     </section>
//   )
// }


"use client"

import Marquee from "react-fast-marquee"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { testimonials } from "@/lib/data"

export default function TestimonialsCarousel() {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Read testimonials from our happy customers</p>
        </div>

        <Marquee pauseOnHover gradient={false} speed={40}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-[90vw] sm:w-[45vw] xl:w-[30vw] px-4">
              <div className="bg-white/60 rounded-lg p-6 shadow-pastel h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground flex-grow">"{testimonial.text}"</p>
              </div>
            </div>
          ))}
        </Marquee>

        <div className="mt-8 text-center">
          <Link href="/testimonials">
            <Button variant="outline" className="mt-4 md:mt-0 bg-white/40 border-[#12121253]">
              View All Testimonials
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
