import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <main className="min-h-screen py-12  bg-gradient-to-b from-[#ffe9e3a8] via-[#faedcda8] to-[#fde2e2a8]">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">About Gifty</h1>
          <p className="text-muted-foreground">Creating personalized gifts with love and care since 2015</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-serif font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Gifty began with a simple idea: to help people create meaningful, personalized gifts for their loved ones.
              What started as a small workshop in a garage has grown into a beloved brand trusted by thousands of
              customers worldwide.
            </p>
            <p className="text-muted-foreground mb-4">
              Our founder, Sarah Johnson, was inspired to start Gifty after struggling to find a meaningful gift for her
              parents' anniversary. She created a custom photo frame that told their love story, and the joy it brought
              them sparked the beginning of our journey.
            </p>
            <p className="text-muted-foreground">
              Today, we continue to pour our hearts into every product we create, ensuring each gift carries the same
              love and thoughtfulness as Sarah's first creation.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-pastel">
            <Image src="https://i.pinimg.com/736x/97/50/a4/9750a463a01275a188fdef47fbae54f1.jpg" alt="Our workshop" fill className="object-cover" />
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/80">
              <CardContent className="pt-6">
                <h3 className="text-xl font-serif font-bold mb-2">Quality</h3>
                <p className="text-muted-foreground">
                  We use only the finest materials and craftsmanship to ensure our products stand the test of time, just
                  like the memories they represent.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/80">
              <CardContent className="pt-6">
                <h3 className="text-xl font-serif font-bold mb-2">Personalization</h3>
                <p className="text-muted-foreground">
                  We believe that the most meaningful gifts are those that reflect the unique relationships and moments
                  they celebrate.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/80">
              <CardContent className="pt-6">
                <h3 className="text-xl font-serif font-bold mb-2">Customer Care</h3>
                <p className="text-muted-foreground">
                  We're dedicated to providing exceptional service and support, ensuring your gifting experience is as
                  special as the occasion itself.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4 border-2 border-pastel-lavender shadow-pastel">
                  <Image
                    src={`/placeholder.svg?height=300&width=300&text=Team Member ${i}`}
                    alt={`Team member ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-lg">
                  {i === 1 ? "Sarah Johnson" : i === 2 ? "Michael Chen" : i === 3 ? "Emily Rodriguez" : "David Kim"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {i === 1
                    ? "Founder & CEO"
                    : i === 2
                      ? "Head of Design"
                      : i === 3
                        ? "Customer Experience"
                        : "Production Manager"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
