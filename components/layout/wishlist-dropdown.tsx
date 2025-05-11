"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, X, Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

type WishlistItem = {
  _id: string
  name: string
  price: number
  salePrice: number | null
  img: string
  badge: string | null
  rating: number
  reviewCount: number
}

export default function WishlistDropdown() {
  const { items, itemCount, removeItem } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      salePrice: item.salePrice,
      image: item.image,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Wishlist">
          <div className="relative">
            <Heart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium">
                {itemCount}
              </span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Wishlist ({itemCount})</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
            <Link href="/products" onClick={() => setIsOpen(false)}>
              <Button variant="outline" size="sm">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="max-h-[300px] overflow-auto space-y-3 mb-4">
              {items.map((item) => (
                <div key={item._id} className="flex gap-3 py-2 border-b">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                    <Image src={item.img || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${item._id}`} onClick={() => setIsOpen(false)}>
                      <h4 className="text-sm font-medium hover:text-primary">{item.name}</h4>
                    </Link>
                    <p className="text-xs text-muted-foreground">{item.badge}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-medium">
                        {item.salePrice ? (
                          <>
                            <span>${item.salePrice.toFixed(2)}</span>{" "}
                            <span className="text-xs text-muted-foreground line-through">${item.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span>${item.price.toFixed(2)}</span>
                        )}
                      </p>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleAddToCart(item)}
                          title="Add to cart"
                        >
                          <ShoppingCart className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeItem(item._id)}
                          title="Remove from wishlist"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Link href="/wishlist" className="flex-1" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  View Wishlist
                </Button>
              </Link>
              <Link href="/products" className="flex-1" onClick={() => setIsOpen(false)}>
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
