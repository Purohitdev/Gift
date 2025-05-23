"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, total } = useCart()

  const shipping = subtotal > 0 ? 4.99 : 0
  const tax = subtotal * 0.08

  return (
    <main className="min-h-screen py-8 md:py-12 bg-gradient-to-b from-[#ffe9e3a8] via-[#faedcda8] to-[#fde2e2a8] ">
      <div className="container px-4">
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-center">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
              <ShoppingBag className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white/80 rounded-lg shadow-pastel overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium mb-4">Cart Items ({items.length})</h2>

                  <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-muted-foreground">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>

                  <Separator className="mb-6" />

                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                        <div className="col-span-6 flex gap-4 mb-4 md:mb-0">
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link href={`/products/${item.id}`}>
                              <h3 className="font-medium hover:text-primary">{item.name}</h3>
                            </Link>
                            {item.options && <p className="text-sm text-muted-foreground">{item.options}</p>}
                            <button
                              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 mt-1 md:hidden"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="col-span-2 text-center mb-4 md:mb-0">
                          <div className="md:hidden text-sm text-muted-foreground mb-1">Price:</div>
                          <div>₹{(item.salePrice || item.price).toFixed(2)}</div>
                        </div>

                        <div className="col-span-2 flex justify-center mb-4 md:mb-0">
                          <div className="md:hidden text-sm text-muted-foreground mb-1 mr-2">Quantity:</div>
                          <div className="flex items-center">
                            <button
                              className="h-8 w-8 flex items-center justify-center rounded-l-md border border-r-0 text-sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                              className="h-8 w-12 text-center rounded-none border-y"
                            />
                            <button
                              className="h-8 w-8 flex items-center justify-center rounded-r-md border border-l-0 text-sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="col-span-2 text-right mb-4 md:mb-0 flex md:block items-center justify-between">
                          <div className="md:hidden text-sm text-muted-foreground">Total:</div>
                          <div className="font-medium">
                            ₹{((item.salePrice || item.price) * item.quantity).toFixed(2)}
                          </div>
                          <button
                            className="text-muted-foreground hover:text-red-500 hidden md:inline-flex"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white/80 rounded-lg shadow-pastel overflow-hidden sticky top-24">
                <div className="p-6">
                  <h2 className="text-lg font-medium mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-3">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Link href="/products">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
