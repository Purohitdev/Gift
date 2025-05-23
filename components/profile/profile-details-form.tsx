"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

type UserAddress = {
  fullName: string
  email: string
  phone: string
  whatsappNumber: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  addressType: string
}

export default function ProfileDetailsForm() {
  const { isLoaded, user } = useUser()
  const { toast } = useToast()
  
  const [userDetails, setUserDetails] = useState<UserAddress>({
    fullName: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "in",
    addressType: "home",
  })

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize form with user data
  useEffect(() => {
    if (isLoaded && user) {
      // Set email from Clerk user
      setUserDetails(prev => ({
        ...prev,
        email: user.primaryEmailAddress?.emailAddress || "",
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      }))

      // Set first and last name
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      
      // Load saved user address data from localStorage if available
      const savedAddress = localStorage.getItem('userAddress')
      if (savedAddress) {
        try {
          const parsedAddress = JSON.parse(savedAddress)
          setUserDetails(prev => ({ ...prev, ...parsedAddress }))
        } catch (error) {
          console.error('Error parsing saved address:', error)
        }
      }
    }
  }, [isLoaded, user])

  // Update full name when first or last name changes
  useEffect(() => {
    const fullName = `${firstName} ${lastName}`.trim()
    if (fullName) {
      setUserDetails(prev => ({ ...prev, fullName }))
    }
  }, [firstName, lastName])

  const handleChange = (field: keyof UserAddress, value: string) => {
    setUserDetails(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Save to localStorage for simplicity
      localStorage.setItem('userAddress', JSON.stringify(userDetails))
      
      toast({
        title: "Profile updated",
        description: "Your profile details have been saved.",
      })
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error",
        description: "There was an error saving your profile details.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact & Delivery Information</CardTitle>
        <CardDescription>Update your contact information and delivery address</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={userDetails.email}
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
                value={userDetails.phone}
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
                value={userDetails.whatsappNumber}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Address Type</Label>
            <RadioGroup 
              value={userDetails.addressType} 
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
              value={userDetails.address}
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
                value={userDetails.city}
                onChange={(e) => handleChange("city", e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input 
                id="state" 
                placeholder="Enter your state" 
                value={userDetails.state}
                onChange={(e) => handleChange("state", e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip">PIN Code</Label>
            <Input 
              id="zip" 
              placeholder="Enter your PIN code" 
              value={userDetails.zipCode}
              onChange={(e) => handleChange("zipCode", e.target.value)}
              required 
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
