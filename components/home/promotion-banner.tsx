import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PromotionBanner() {
  return (
    <section className="py-12 md:py-16 bg-primary/10">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Special Offer</h2>
            <p className="text-lg mb-6">
              Get <span className="font-bold">20% OFF</span> on all personalized photo frames this week!
            </p>
            <p className="text-muted-foreground mb-8">
              Use code <span className="font-mono font-bold">FRAME20</span> at checkout. Valid until June 15, 2023.
            </p>
            <Link href="/products?category=frames">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Shop Frames Now</Button>
            </Link>
          </div>
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gradient-to-r from-pastel-lavender/30 to-pastel-pink/30 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-40 h-40 md:w-56 md:h-56 transform rotate-12 shadow-xl">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Photo Frame"
                  className="absolute inset-0 w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="absolute top-4 right-4 bg-accent text-accent-foreground rounded-full h-16 w-16 flex items-center justify-center text-lg font-bold">
                -20%
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
