"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FomoPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentPopup, setCurrentPopup] = useState(0)

  const popups = [
    {
      name: "Sarah from New York",
      action: "just purchased",
      product: "Custom Photo Frame",
      time: "2 minutes ago",
    },
    {
      name: "Michael from California",
      action: "added to cart",
      product: "Personalized Mug",
      time: "5 minutes ago",
    },
    {
      name: "Emily from Texas",
      action: "just purchased",
      product: "Custom Keychain",
      time: "8 minutes ago",
    },
  ]

  useEffect(() => {
    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 5000)

    // Hide popup after 8 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 13000)

    // Rotate through popups
    const rotateTimer = setInterval(() => {
      setCurrentPopup((prev) => (prev + 1) % popups.length)
      setIsVisible(true)

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false)
      }, 5000)
    }, 15000)

    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
      clearInterval(rotateTimer)
    }
  }, [])

  if (!isVisible) return null

  const popup = popups[currentPopup]

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-xs bg-white rounded-lg shadow-lg p-4 border border-pastel-lavender animate-in slide-in-from-bottom-4 duration-300">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-3 w-3" />
      </Button>
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-pastel-lavender/30 flex items-center justify-center text-lg font-bold">
          {popup.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm">
            <span className="font-medium">{popup.name}</span> {popup.action}{" "}
            <span className="font-medium">{popup.product}</span>
          </p>
          <p className="text-xs text-muted-foreground">{popup.time}</p>
        </div>
      </div>
    </div>
  )
}
