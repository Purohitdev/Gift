// import Link from "next/link"
// import Image from "next/image"
// import { ArrowRight } from "lucide-react"
// import { Button } from "@/components/ui/button"

// export default function FeaturedCollections() {
//   const collections = [
//     {
//       id: 1,
//       title: "Anniversary Gifts",
//       description: "Celebrate your special day with personalized gifts that capture your love story.",
//       image: "/placeholder.svg?height=600&width=400",
//       link: "/products?category=frames",
//     },
//     {
//       id: 2,
//       title: "Birthday Surprises",
//       description: "Make their birthday extra special with custom gifts they'll cherish forever.",
//       image: "/placeholder.svg?height=600&width=400",
//       link: "/products?category=mugs",
//     },
//     {
//       id: 3,
//       title: "Home Decor",
//       description: "Transform your space with personalized decor that tells your story.",
//       image: "/placeholder.svg?height=600&width=400",
//       link: "/products?category=wall-art",
//     },
//   ]

//   return (
//     <section className="py-12 md:py-16">
//       <div className="container px-4">
//         <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-center">Featured Collections</h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {collections.map((collection) => (
//             <div key={collection.id} className="group relative overflow-hidden rounded-lg shadow-pastel">
//               <div className="relative h-80 w-full">
//                 <Image
//                   src={collection.image || "/placeholder.svg"}
//                   alt={collection.title}
//                   fill
//                   className="object-cover transition-transform duration-500 group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
//               </div>
//               <div className="absolute bottom-0 left-0 right-0 p-6">
//                 <h3 className="text-xl font-serif font-bold text-white mb-2">{collection.title}</h3>
//                 <p className="text-white/80 mb-4 text-sm">{collection.description}</p>
//                 <Link href={collection.link}>
//                   <Button variant="outline" className="bg-white text-foreground hover:bg-white/90 gap-2">
//                     Explore Collection
//                     <ArrowRight className="h-4 w-4" />
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }
