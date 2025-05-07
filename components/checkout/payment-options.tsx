"use client"

import { useState } from "react"
import { CreditCard, Landmark } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentOptions() {
  const [paymentMethod, setPaymentMethod] = useState("online")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Choose how you want to pay</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
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
                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name-on-card">Name on Card</Label>
                    <Input id="name-on-card" placeholder="John Doe" />
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
                      <span className="font-medium">Advance Payment: $19.99</span> (30% of total)
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Remaining Amount: $46.64</span> (to be paid at delivery)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-number-cod">Card Number</Label>
                    <Input id="card-number-cod" placeholder="1234 5678 9012 3456" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry-cod">Expiry Date</Label>
                      <Input id="expiry-cod" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv-cod">CVV</Label>
                      <Input id="cvv-cod" placeholder="123" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name-on-card-cod">Name on Card</Label>
                    <Input id="name-on-card-cod" placeholder="John Doe" />
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
