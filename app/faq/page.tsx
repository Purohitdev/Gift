"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { faqs } from "@/lib/data"

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Group FAQs by category (in a real app, FAQs would have categories)
  const categories = [
    { name: "Ordering & Customization", faqs: filteredFaqs.slice(0, 2) },
    { name: "Shipping & Delivery", faqs: filteredFaqs.slice(2, 4) },
    { name: "Returns & Refunds", faqs: filteredFaqs.slice(4) },
  ]

  return (
    <main className="min-h-screen py-12">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mb-6">Find answers to common questions about our products and services</p>

          <div className="flex max-w-md mx-auto">
            <Input
              type="search"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-r-none"
            />
            <Button className="rounded-l-none bg-primary hover:bg-primary/90 text-primary-foreground">Search</Button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <h2 className="text-xl font-serif font-bold mb-4">{category.name}</h2>
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 2 + faqIndex
                  return (
                    <div key={faq.id} className="border rounded-lg overflow-hidden">
                      <button
                        className="flex items-center justify-between w-full p-4 text-left"
                        onClick={() => toggleFaq(globalIndex)}
                      >
                        <h3 className="font-medium">{faq.question}</h3>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${
                            openIndex === globalIndex ? "transform rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`px-4 overflow-hidden transition-all ${
                          openIndex === globalIndex ? "max-h-40 pb-4" : "max-h-0"
                        }`}
                      >
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="mt-12 bg-pastel-cream/50 rounded-lg p-6 text-center">
            <h2 className="text-xl font-serif font-bold mb-2">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-4">
              Can't find the answer you're looking for? Please contact our customer support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Contact Support</Button>
              <Button variant="outline">Email Us</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
