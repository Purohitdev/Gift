"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import SimpleCheckoutForm, { CheckoutFormData } from "@/components/checkout/SimpleCheckoutForm"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutPage() {
  const { items, subtotal, shipping, tax, total, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)

  // Redirect to cart if cart is empty
  useEffect(() => {
    const timer = setTimeout(() => {
      if (items.length === 0 && typeof window !== 'undefined' && !localStorage.getItem("cart")) {
        router.push("/cart")
      }
    }, 200); // Slightly increased delay to ensure cart context has time to load from localStorage
    return () => clearTimeout(timer)
  }, [items, router])

  const handlePlaceOrder = async (formData: CheckoutFormData) => {
    setIsProcessingOrder(true)
    try {
      // Attempt to extract delivery priority from the first item's options
      let deliveryPriority = "standard"; // Default value
      if (items.length > 0 && items[0].options) {
        const optionsString = items[0].options;
        const deliveryMatch = optionsString.match(/Delivery: (\w+)/i);
        if (deliveryMatch && deliveryMatch[1]) {
          const priority = deliveryMatch[1].toLowerCase();
          if (["standard", "express", "rush"].includes(priority)) {
            deliveryPriority = priority;
          }
        }
      }

      const orderData = {
        items: items.map(item => ({
          product: item.id, // This should be the product ID
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          salePrice: item.salePrice,
          image: item.image, // This should be the product image URL
          options: typeof item.options === 'string' ? item.options : JSON.stringify(item.options),
        })),
        shippingAddress: formData, // formData now includes email and whatsappNumber
        paymentMethod: "cod", // Defaulting to COD for simplicity
        subtotal,
        shipping,
        tax,
        total,
        deliveryNotes: formData.deliveryNotes,
        deliveryPriority: deliveryPriority,
        // user: userId, // TODO: Add user ID if available (e.g., from auth context)
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to create order")
      }

      const order = await response.json()

      toast({
        title: "Order Placed!",
        description: `Your order #${order?.data?._id || order?._id || ''} has been placed successfully.`,
      })
      clearCart()
      router.push(`/order-confirmation/${order?.data?._id || order?._id}`)

    } catch (error: any) {
      console.error("Place order error:", error)
      toast({
        title: "Order Failed",
        description: error.message || "There was an issue placing your order.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingOrder(false)
    }
  }

  // Initial check for empty cart to prevent flash of checkout page
  if (items.length === 0 && (typeof window !== 'undefined' && !localStorage.getItem("cart"))) {
    return (
      <main className="min-h-screen py-8 md:py-12 flex items-center justify-center">
        <div className="container px-4 text-center">
          <ShoppingBag className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="container px-4">
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-center">
          Checkout
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <SimpleCheckoutForm onSubmit={handlePlaceOrder} isProcessing={isProcessingOrder} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.length > 0 ? (
                  <>
                    <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                      {items.map(item => (
                        <div key={`${item.id}-${item.options}`} className="flex items-center gap-3">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{item.name}</h4>
                            {item.options && (
                              <p className="text-xs text-muted-foreground truncate" title={item.options}>
                                {item.options} 
                              </p>
                            )}
                            <p className="text-xs">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium">
                            ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-base font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Your cart is currently empty.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
