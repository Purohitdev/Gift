"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"
import { useCheckout } from "@/lib/checkout-context"
import { Loader2 } from "lucide-react"

export default function OrderSummary() {
  const { items, subtotal } = useCart()
  const { placeOrder, isProcessingOrder, shippingAddress } = useCheckout()

  const shipping = 4.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax
  
  // Format delivery address for display
  const formattedAddress = shippingAddress.address && shippingAddress.city ? (
    <div className="text-sm space-y-1 my-3 text-muted-foreground">
      <div>{shippingAddress.fullName}</div>
      <div>{shippingAddress.address}</div>
      <div>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</div>
      <div>Phone: {shippingAddress.phone}</div>
      {shippingAddress.whatsappNumber && (
        <div>WhatsApp: {shippingAddress.whatsappNumber}</div>
      )}
    </div>
  ) : (
    <p className="text-sm text-muted-foreground italic my-2">
      Please complete delivery information
    </p>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Review your order details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-muted-foreground">{item.options}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm">
                  ${(item.salePrice || item.price).toFixed(2)} × {item.quantity}
                </p>
                <p className="font-medium">${((item.salePrice || item.price) * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}

        <Separator className="my-4" />
        
        <div>
          <h4 className="font-medium mb-1">Delivery Information</h4>
          {formattedAddress}
        </div>
        
        <Separator className="my-4" />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between font-medium">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={placeOrder}
          disabled={isProcessingOrder}
        >
          {isProcessingOrder ? (
            <React.Fragment key="processing">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </React.Fragment>
          ) : (
            <React.Fragment key="place-order">
              Place Order
            </React.Fragment>
          )}
        </Button>
        <Link href="/products" className="text-sm text-center text-muted-foreground hover:text-foreground">
          Continue Shopping
        </Link>
      </CardFooter>
    </Card>
  )
}
