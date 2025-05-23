"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCheckout } from "@/lib/checkout-context"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { ArrowRight, Save } from "lucide-react"

export default function DeliveryForm() {
  const { shippingAddress, updateShippingAddress } = useCheckout()
  const { isLoaded, isSignedIn, user } = useUser()
  
  // Handle form field changes
  const handleChange = (field: string, value: string) => {
    updateShippingAddress({ [field]: value })
  }
  
  // Split full name into first name and last name for the UI
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [hasLoadedProfile, setHasLoadedProfile] = useState(false)
  
  // Initialize first and last name from full name if exists
  useEffect(() => {
    if (shippingAddress.fullName && !hasLoadedProfile) {
      const nameParts = shippingAddress.fullName.split(" ")
      if (nameParts.length > 1) {
        setFirstName(nameParts[0])
        setLastName(nameParts.slice(1).join(" "))
      } else {
        setFirstName(shippingAddress.fullName)
        setLastName("")
      }
    }
  }, [shippingAddress.fullName, hasLoadedProfile])
  
  // Load saved user address data from user profile
  useEffect(() => {
    if (isLoaded && isSignedIn && !hasLoadedProfile) {
      // Load user profile data from localStorage
      const savedAddress = localStorage.getItem('userAddress')
      if (savedAddress) {
        try {
          const parsedAddress = JSON.parse(savedAddress)
          // Update shipping address with saved profile data
          updateShippingAddress(parsedAddress)
          
          // Set first and last name from the fullName
          if (parsedAddress.fullName) {
            const nameParts = parsedAddress.fullName.split(" ")
            if (nameParts.length > 1) {
              setFirstName(nameParts[0])
              setLastName(nameParts.slice(1).join(" "))
            } else {
              setFirstName(parsedAddress.fullName)
              setLastName("")
            }
          }
          
          setHasLoadedProfile(true)
        } catch (error) {
          console.error('Error loading saved address:', error)
        }
      } else if (user) {
        // If no saved address but user is signed in, use user data
        setFirstName(user.firstName || "")
        setLastName(user.lastName || "")
        updateShippingAddress({ 
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.primaryEmailAddress?.emailAddress || ""
        })
      }
    }
  }, [isLoaded, isSignedIn, user, updateShippingAddress, hasLoadedProfile])
  
  // Update full name when first or last name changes
  const [prevFullName, setPrevFullName] = useState("")
  
  useEffect(() => {
    const fullName = `${firstName} ${lastName}`.trim()
    
    // Only update if the name has actually changed
    if (fullName && fullName !== prevFullName) {
      updateShippingAddress({ fullName })
      setPrevFullName(fullName)
    }
  }, [firstName, lastName, updateShippingAddress])
  const saveUserProfile = () => {
    // Save current shipping address to localStorage
    localStorage.setItem('userAddress', JSON.stringify({
      fullName: shippingAddress.fullName,
      email: shippingAddress.email,
      phone: shippingAddress.phone,
      whatsappNumber: shippingAddress.whatsappNumber,
      address: shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zipCode: shippingAddress.zipCode,
      country: shippingAddress.country,
      addressType: shippingAddress.addressType
    }))
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Delivery Information</CardTitle>
          <CardDescription>Enter your details for delivery</CardDescription>
        </div>
        {isSignedIn && (
          <Button variant="outline" size="sm" onClick={saveUserProfile} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save for future use</span>
            <span className="sm:hidden">Save</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {!isSignedIn && (
          <div className="bg-muted/30 p-3 rounded-md mb-6 text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p>Already have an account? Sign in to use your saved delivery information.</p>
            <Link href="/sign-in" className="text-primary font-medium flex items-center">
              Sign In <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input 
              id="first-name" 
              placeholder="Enter your first name" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input 
              id="last-name" 
              placeholder="Enter your last name" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your email" 
            value={shippingAddress.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="Enter your phone number" 
              value={shippingAddress.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input 
              id="whatsapp" 
              type="tel" 
              placeholder="Enter your WhatsApp number" 
              value={shippingAddress.whatsappNumber}
              onChange={(e) => handleChange("whatsappNumber", e.target.value)}
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Address Type</Label>
          <RadioGroup 
            value={shippingAddress.addressType} 
            onValueChange={(value) => handleChange("addressType", value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="home" id="home" />
              <Label htmlFor="home">Home</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="office" id="office" />
              <Label htmlFor="office">Office</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Textarea 
            id="address" 
            placeholder="Enter your street address" 
            value={shippingAddress.address}
            onChange={(e) => handleChange("address", e.target.value)}
            required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Town/City</Label>
            <Input 
              id="city" 
              placeholder="Enter your town or city" 
              value={shippingAddress.city}
              onChange={(e) => handleChange("city", e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input 
              id="state" 
              placeholder="Enter your state" 
              value={shippingAddress.state}
              onChange={(e) => handleChange("state", e.target.value)}
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zip">PIN Code</Label>
            <Input 
              id="zip" 
              placeholder="Enter your PIN code" 
              value={shippingAddress.zipCode}
              onChange={(e) => handleChange("zipCode", e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select 
              value={shippingAddress.country}
              onValueChange={(value) => handleChange("country", value)}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">India</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Delivery Notes (Optional)</Label>
          <Textarea 
            id="notes" 
            placeholder="Any special instructions for delivery" 
            className="h-24"
            value={shippingAddress.deliveryNotes || ""}
            onChange={(e) => handleChange("deliveryNotes", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
