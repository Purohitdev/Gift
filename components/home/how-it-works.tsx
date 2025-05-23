import { Gift, Pencil, Package } from "lucide-react"
import { howItWorks } from "@/lib/data"

export default function HowItWorks() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Gift":
        return <Gift className="h-8 w-8 text-primary" />
      case "Pencil":
        return <Pencil className="h-8 w-8 text-primary" />
      case "Package":
        return <Package className="h-8 w-8 text-primary" />
      default:
        return <Gift className="h-8 w-8 text-primary" />
    }
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Creating your personalized gift is easy with our simple process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white/60 mb-4">
                  {getIcon(step.icon)}
                </div>
                <div className="absolute top-8 left-full h-0.5 bg-pastel-lavender/50 w-full hidden md:block">
                  {index < howItWorks.length - 1 && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 h-2 w-2 rounded-full bg-pastel-lavender"></div>
                  )}
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
