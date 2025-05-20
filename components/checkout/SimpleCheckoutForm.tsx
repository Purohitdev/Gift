"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export interface CheckoutFormData {
  fullName: string
  email: string
  phone: string
  whatsappNumber: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  deliveryNotes?: string
}

interface SimpleCheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => Promise<void>
  isProcessing: boolean
}

const initialFormData: CheckoutFormData = {
  fullName: "",
  email: "",
  phone: "",
  whatsappNumber: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US", // Default country
  deliveryNotes: "",
}

export default function SimpleCheckoutForm({ onSubmit, isProcessing }: SimpleCheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {}
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.whatsappNumber.trim()) newErrors.whatsappNumber = "WhatsApp number is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (!formData.zipCode.trim()) newErrors.zipCode = "Zip code is required"
    if (!formData.country.trim()) newErrors.country = "Country is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      await onSubmit(formData)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping & Contact Information</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
              {errors.fullName && <p className="text-sm text-red-500 pt-1">{errors.fullName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
              {errors.email && <p className="text-sm text-red-500 pt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
              {errors.phone && <p className="text-sm text-red-500 pt-1">{errors.phone}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input id="whatsappNumber" name="whatsappNumber" type="tel" value={formData.whatsappNumber} onChange={handleChange} />
              {errors.whatsappNumber && <p className="text-sm text-red-500 pt-1">{errors.whatsappNumber}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} />
            {errors.address && <p className="text-sm text-red-500 pt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleChange} />
              {errors.city && <p className="text-sm text-red-500 pt-1">{errors.city}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State / Province</Label>
              <Input id="state" name="state" value={formData.state} onChange={handleChange} />
              {errors.state && <p className="text-sm text-red-500 pt-1">{errors.state}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip / Postal Code</Label>
              <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} />
              {errors.zipCode && <p className="text-sm text-red-500 pt-1">{errors.zipCode}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" value={formData.country} onChange={handleChange} />
            {/* Consider using a Select component for countries for better UX */}
            {errors.country && <p className="text-sm text-red-500 pt-1">{errors.country}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryNotes">Delivery Notes (Optional)</Label>
            <Textarea id="deliveryNotes" name="deliveryNotes" value={formData.deliveryNotes} onChange={handleChange} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isProcessing ? "Processing..." : "Place Order"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

