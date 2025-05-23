import { Check } from "lucide-react"

interface ProductHighlightsProps {
  highlights?: string[];
}

export default function ProductHighlights({ highlights = [] }: ProductHighlightsProps) {
  // If no highlights are provided, use default ones
  const defaultHighlights = [
    "Premium quality materials",
    "Handcrafted with care",
    "Customizable design",
    "Fast production time",
    "Secure packaging",
    "100% satisfaction guarantee",
  ];

  const displayHighlights = highlights.length > 0 ? highlights : defaultHighlights;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-10">Product Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 text-left">
          {displayHighlights.map((highlight, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-[#d2cde1d0] rounded-lg transition-all hover:bg-muted/70"
            >
              <div className="h-6 w-6 rounded-full bg-primary/90 flex items-center justify-center mt-1 shrink-0">
                <Check className="h-4 w-4 text-black" />
              </div>
              <span className="text-base sm:text-lg font-medium text-muted-foreground">
                {highlight}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
