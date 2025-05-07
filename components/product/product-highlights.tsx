import { Check } from "lucide-react"

export default function ProductHighlights() {
  const highlights = [
    "Premium quality materials",
    "Handcrafted with care",
    "Customizable design",
    "Fast production time",
    "Secure packaging",
    "100% satisfaction guarantee",
  ]

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-serif font-bold mb-6 text-center">Product Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
