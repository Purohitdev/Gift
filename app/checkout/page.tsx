"use client"

import DeliveryForm from "@/components/checkout/delivery-form"
import OrderSummary from "@/components/checkout/order-summary"
import PaymentOptions from "@/components/checkout/payment-options"
import DeliveryEstimate from "@/components/checkout/delivery-estimate"
import { CheckoutProvider } from "@/lib/checkout-context"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {
  const { items } = useCart()
  const router = useRouter()
  
  // Redirect to cart if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])
  
  if (items.length === 0) {
    return (
      <main className="min-h-screen py-8 md:py-12">
        <div className="container px-4">
          <div className="text-center py-12">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
              <ShoppingBag className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some items to your cart before checkout.</p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Shop Now</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <CheckoutProvider>
      <main className="min-h-screen py-8 md:py-12">
        <div className="container px-4">
          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-center">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <DeliveryForm />
              <PaymentOptions />
            </div>

            <div className="space-y-6">
              <OrderSummary />
              <DeliveryEstimate />
            </div>
          </div>
        </div>
      </main>
    </CheckoutProvider>
  )
}
