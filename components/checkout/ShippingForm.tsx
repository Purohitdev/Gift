"use client"

import { useCheckout } from "@/lib/checkout-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ShippingForm() {
  const { shippingAddress, updateShippingAddress, errors } = useCheckout()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateShippingAddress({ [e.target.name]: e.target.value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" value={shippingAddress.fullName} onChange={handleChange} />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={shippingAddress.email} onChange={handleChange} />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" value={shippingAddress.phone} onChange={handleChange} />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input id="whatsappNumber" name="whatsappNumber" type="tel" value={shippingAddress.whatsappNumber} onChange={handleChange} />
            {errors.whatsappNumber && <p className="text-sm text-red-500">{errors.whatsappNumber}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" value={shippingAddress.address} onChange={handleChange} />
          {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" value={shippingAddress.city} onChange={handleChange} />
            {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State / Province</Label>
            <Input id="state" name="state" value={shippingAddress.state} onChange={handleChange} />
            {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip / Postal Code</Label>
            <Input id="zipCode" name="zipCode" value={shippingAddress.zipCode} onChange={handleChange} />
            {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" value={shippingAddress.country} onChange={handleChange} />
          {/* You might want to use a Select component for countries */}
          {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="deliveryNotes">Delivery Notes (Optional)</Label>
          <Textarea id="deliveryNotes" name="deliveryNotes" value={shippingAddress.deliveryNotes || ''} onChange={handleChange} />
        </div>
      </CardContent>
    </Card>
  )
}
