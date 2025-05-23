"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { faqs } from "@/lib/data"

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-serif font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="border rounded-lg overflow-hidden">
              <button
                className="flex items-center justify-between w-full p-4 text-left bg-white/80"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="font-medium">{faq.question}</h3>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${openIndex === index ? "transform rotate-180" : ""}`}
                />
              </button>
              <div
                className={`px-4 overflow-hidden transition-all bg-white/50 ${openIndex === index ? "max-h-40 pb-4" : "max-h-0"}`}
              >
                <p className="text-muted-foreground py-2">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
