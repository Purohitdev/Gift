"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type WishlistItem = {
  id: number
  name: string
  price: number
  salePrice: number | null
  image: string
  category: string
  description: string
  rating: number
  reviewCount: number
  badge: string | null
}

type WishlistContextType = {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: number) => void
  clearWishlist: () => void
  isInWishlist: (id: number) => boolean
  itemCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Initialize wishlist from localStorage when component mounts
  useEffect(() => {
    setMounted(true)
    const storedWishlist = localStorage.getItem("wishlist")
    if (storedWishlist) {
      try {
        setItems(JSON.parse(storedWishlist))
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error)
        setItems([])
      }
    }
  }, [])

  // Update localStorage when wishlist changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("wishlist", JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (newItem: WishlistItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id)

      if (existingItemIndex > -1) {
        // Item already exists in wishlist, don't add it again
        return prevItems
      } else {
        // Item doesn't exist, add it
        return [...prevItems, newItem]
      }
    })
  }

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const clearWishlist = () => {
    setItems([])
  }

  const isInWishlist = (id: number) => {
    return items.some((item) => item.id === id)
  }

  const itemCount = items.length

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearWishlist,
        isInWishlist,
        itemCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
