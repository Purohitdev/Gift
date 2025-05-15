import Image from "next/image"
import { Star } from "lucide-react"
import { testimonials } from "@/lib/data"

export default function TestimonialsPage() {
  // In a real app, you would have more testimonials
  const allTestimonials = [
    ...testimonials,
    {
      id: 5,
      name: "Jennifer Smith",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "I ordered a custom photo album for my parents' 50th anniversary and it exceeded all my expectations. The quality is outstanding and the customer service was exceptional throughout the process.",
    },
    {
      id: 6,
      name: "Robert Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 4,
      text: "The personalized wall art I ordered was beautiful. My only suggestion would be to offer more size options, but overall I'm very satisfied with my purchase.",
    },
    {
      id: 7,
      name: "Lisa Thompson",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "I've ordered multiple gifts from Gifty and have always been impressed with the quality and attention to detail. Their customer service is also top-notch!",
    },
    {
      id: 8,
      name: "Mark Davis",
      avatar: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "The custom keychain I ordered arrived quickly and looked even better than I expected. Will definitely be ordering more gifts in the future!",
    },
  ]

  return (
    <main className="min-h-screen py-12 bg-gradient-to-b from-[#ffe9e3a8] via-[#faedcda8] to-[#fde2e2a8]">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Customer Testimonials</h1>
          <p className="text-muted-foreground">
            Don't just take our word for it. Here's what our customers have to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {allTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white/60 rounded-lg p-6 shadow-pastel h-full flex flex-col">
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
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-serif font-bold mb-6">Share Your Experience</h2>
          <p className="text-muted-foreground mb-6">
            We'd love to hear about your experience with Gifty. Your feedback helps us improve and serves as a guide for
            future customers.
          </p>
          <div className="bg-pastel-lavender/10 rounded-lg p-6 text-center">
            <p className="font-medium mb-2">Have you purchased from us?</p>
            <p className="text-sm text-muted-foreground mb-4">
              We'd appreciate it if you could take a moment to share your thoughts.
            </p>
            <a
              href="#"
              className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
            >
              Write a Review
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
