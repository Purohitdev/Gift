import Image from "next/image"
import Link from "next/link"
import { Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { instagramPosts } from "@/lib/data"

export default function InstagramFeed() {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Follow Us on Instagram</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            @gifty_shop • See how our customers style their personalized gifts
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post) => (
            <Link
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group overflow-hidden rounded-lg aspect-square"
            >
              <Image
                src={post.image || "/placeholder.svg"}
                alt="Instagram post"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Instagram className="h-6 w-6 text-white" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" className="gap-2" asChild>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-4 w-4" />
              Follow Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
