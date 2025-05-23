"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CartDropdown() {
  const { items, itemCount, subtotal, removeItem, updateQuantity } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Cart">
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
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
          <h3 className="font-medium">Shopping Cart ({itemCount})</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
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
                <div key={item.id} className="flex gap-3 py-2 border-b">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${item.id}`} onClick={() => setIsOpen(false)}>
                      <h4 className="text-sm font-medium hover:text-primary">{item.name}</h4>
                    </Link>
                    {item.options && <p className="text-xs text-muted-foreground">{item.options}</p>}
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1">
                        <button
                          className="h-5 w-5 flex items-center justify-center rounded-full border text-xs"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="text-xs px-1">{item.quantity}</span>
                        <button
                          className="h-5 w-5 flex items-center justify-center rounded-full border text-xs"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Shipping, taxes, and discounts calculated at checkout
              </p>
              <div className="flex gap-2">
                <Link href="/cart" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
