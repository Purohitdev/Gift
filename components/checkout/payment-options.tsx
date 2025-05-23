"use client"

import { useEffect, useState, useRef } from "react"
import { CreditCard, Landmark } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCheckout } from "@/lib/checkout-context"
import { useCart } from "@/lib/cart-context"

export default function PaymentOptions() {
  const { paymentDetails, updatePaymentDetails } = useCheckout()
  const { total } = useCart()
  
  // Local state for payment method and card details
  const [paymentMethod, setPaymentMethod] = useState(paymentDetails.method)
  const [cardNumber, setCardNumber] = useState(paymentDetails.cardNumber || "")
  const [expiry, setExpiry] = useState(paymentDetails.expiry || "")
  const [cvv, setCvv] = useState(paymentDetails.cvv || "")
  const [nameOnCard, setNameOnCard] = useState(paymentDetails.nameOnCard || "")

  // Track if this is the initial render
  const initialRender = useRef(true)

  // Calculate advance payment for COD (30%)
  const advancePayment = (total * 0.3).toFixed(2)
  const remainingAmount = (total * 0.7).toFixed(2)

  // Update payment method in context when it changes
  useEffect(() => {
    // Skip the first render to prevent unnecessary updates
    if (initialRender.current) {
      initialRender.current = false
      return
    }
    
    // Only update if the value actually changed
    if (paymentMethod !== paymentDetails.method) {
      updatePaymentDetails({ method: paymentMethod as "online" | "cod" })
    }
  }, [paymentMethod, paymentDetails.method, updatePaymentDetails])

  // Sync card details with context - using a debounce pattern
  useEffect(() => {
    // Skip the first render to prevent unnecessary updates
    if (initialRender.current) {
      return
    }

    // Use a timeout to debounce updates
    const timeoutId = setTimeout(() => {
      // Only update if values actually changed
      const needsUpdate = 
        cardNumber !== paymentDetails.cardNumber ||
        expiry !== paymentDetails.expiry ||
        cvv !== paymentDetails.cvv ||
        nameOnCard !== paymentDetails.nameOnCard
        
      if (needsUpdate) {
        updatePaymentDetails({
          cardNumber,
          expiry,
          cvv,
          nameOnCard
        })
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [cardNumber, expiry, cvv, nameOnCard, paymentDetails, updatePaymentDetails])

  // Handle card details change - only updates local state
  const handleCardDetailsChange = (field: string, value: string) => {
    switch (field) {
      case "cardNumber":
        setCardNumber(value)
        break
      case "expiry":
        setExpiry(value)
        break
      case "cvv":
        setCvv(value)
        break
      case "nameOnCard":
        setNameOnCard(value)
        break
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Choose how you want to pay</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "online" | "cod")} className="space-y-4">
          <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer [&:has(:checked)]:bg-primary/5 [&:has(:checked)]:border-primary">
            <RadioGroupItem value="online" id="online" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Pay Online (100%)</span>
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Pay the full amount now using credit/debit card or other online payment methods
              </p>

              {paymentMethod === "online" && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input 
                      id="card-number" 
                      placeholder="1234 5678 9012 3456" 
                      value={cardNumber}
                      onChange={(e) => handleCardDetailsChange("cardNumber", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY" 
                        value={expiry}
                        onChange={(e) => handleCardDetailsChange("expiry", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123" 
                        value={cvv}
                        onChange={(e) => handleCardDetailsChange("cvv", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name-on-card">Name on Card</Label>
                    <Input 
                      id="name-on-card" 
                      placeholder="John Doe" 
                      value={nameOnCard}
                      onChange={(e) => handleCardDetailsChange("nameOnCard", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3 border rounded-lg p-4 cursor-pointer [&:has(:checked)]:bg-primary/5 [&:has(:checked)]:border-primary">
            <RadioGroupItem value="cod" id="cod" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                <Landmark className="h-5 w-5" />
                <span className="font-medium">Cash on Delivery (30% Advance)</span>
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Pay 30% advance now and the remaining amount when your order is delivered
              </p>

              {paymentMethod === "cod" && (
                <div className="mt-4 space-y-4">
                  <div className="p-3 bg-primary/10 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Advance Payment: ${advancePayment}</span> (30% of total)
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Remaining Amount: ${remainingAmount}</span> (to be paid at delivery)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-number-cod">Card Number</Label>
                    <Input 
                      id="card-number-cod" 
                      placeholder="1234 5678 9012 3456" 
                      value={cardNumber}
                      onChange={(e) => handleCardDetailsChange("cardNumber", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry-cod">Expiry Date</Label>
                      <Input 
                        id="expiry-cod" 
                        placeholder="MM/YY" 
                        value={expiry}
                        onChange={(e) => handleCardDetailsChange("expiry", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv-cod">CVV</Label>
                      <Input 
                        id="cvv-cod" 
                        placeholder="123" 
                        value={cvv}
                        onChange={(e) => handleCardDetailsChange("cvv", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name-on-card-cod">Name on Card</Label>
                    <Input 
                      id="name-on-card-cod" 
                      placeholder="John Doe" 
                      value={nameOnCard}
                      onChange={(e) => handleCardDetailsChange("nameOnCard", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
