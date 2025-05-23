"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "./cart-context" // Assuming CartItem has an 'options' field

// Define the types for our context
type ShippingAddress = {
  fullName: string
  email: string
  phone: string
  whatsappNumber: string // Retained as per user's previous setup
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  deliveryNotes?: string
}

type PaymentDetails = {
  method: "cod" | "online_mock" // Simplified payment methods
}

type CheckoutContextType = {
  shippingAddress: ShippingAddress
  paymentDetails: PaymentDetails
  updateShippingAddress: (data: Partial<ShippingAddress>) => void
  updatePaymentDetails: (data: Partial<PaymentDetails>) => void
  isProcessingOrder: boolean
  placeOrder: () => Promise<void>
  errors: Partial<Record<keyof ShippingAddress | 'payment', string>>
}

// Create the context with a default value
const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

// Custom hook to use the context
export function useCheckout() {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider")
  }
  return context
}

// Provider component to wrap around components that need access to the context
export function CheckoutProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { toast } = useToast()
  const { items, subtotal, total, shipping, tax, clearCart } = useCart()
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress | 'payment', string>>>({})

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
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
  })

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: "cod", // Default to Cash on Delivery
  })

  // Function to update shipping address
  const updateShippingAddress = useCallback(
    (data: Partial<ShippingAddress>) => {
      setShippingAddress(prev => ({ ...prev, ...data }))
      // Clear errors for fields being updated
      if (Object.keys(data).some(key => errors[key as keyof ShippingAddress])) {
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          Object.keys(data).forEach(key => delete newErrors[key as keyof ShippingAddress]);
          return newErrors;
        });
      }
    },
    [errors] // Add errors to dependency array
  )

  // Function to update payment details
  const updatePaymentDetails = useCallback(
    (data: Partial<PaymentDetails>) => {
      setPaymentDetails(prev => ({ ...prev, ...data }))
    },
    []
  )

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress | 'payment', string>> = {};
    if (!shippingAddress.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!shippingAddress.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\\S+@\\S+\\.\\S+/.test(shippingAddress.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!shippingAddress.phone.trim()) newErrors.phone = "Phone number is required";
    if (!shippingAddress.whatsappNumber.trim()) newErrors.whatsappNumber = "WhatsApp number is required"; // Assuming this is still a required field
    if (!shippingAddress.address.trim()) newErrors.address = "Address is required";
    if (!shippingAddress.city.trim()) newErrors.city = "City is required";
    if (!shippingAddress.state.trim()) newErrors.state = "State is required";
    if (!shippingAddress.zipCode.trim()) newErrors.zipCode = "Zip code is required";
    if (!shippingAddress.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Function to place an order
  const placeOrder = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      return;
    }

    setIsProcessingOrder(true)

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          product: item.id, 
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          salePrice: item.salePrice,
          image: item.image,
          // Ensure item.options is stringified if it's an object, as the Order model expects a String
          options: typeof item.options === 'string' ? item.options : JSON.stringify(item.options), 
        })),
        shippingAddress: { // Ensure all fields match the Order model
          fullName: shippingAddress.fullName,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
          whatsappNumber: shippingAddress.whatsappNumber, // Include if in your Order model
          email: shippingAddress.email, // Include if in your Order model
        },
        paymentMethod: paymentDetails.method,
        subtotal,
        shipping,
        tax,
        total,
        deliveryNotes: shippingAddress.deliveryNotes,
        // Defaulting these as per your original context, adjust if needed
        deliveryPriority: "standard", 
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() 
      }
      
      // Create the order in the database
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to create order. Please try again." }))
        throw new Error(errorData.message || "Failed to create order")
      }

      const orderResponse = await response.json()
      // The actual order data might be nested under a 'data' property or be the direct response
      const orderId = orderResponse?.data?._id || orderResponse?._id;

      if (!orderId) {
        throw new Error("Order ID not found in response.")
      }

      toast({
        title: "Order Placed!",
        description: `Your order #${orderId.substring(0,8)} has been placed successfully.`,
      })
      clearCart()
      router.push(`/order-confirmation/${orderId}`) // Navigate to order confirmation
    } catch (error: any) {
      console.error("Place order error:", error)
      toast({
        title: "Order Failed",
        description: error.message || "There was an issue placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingOrder(false)
    }
  }

  return (
    <CheckoutContext.Provider
      value={{
        shippingAddress,
        paymentDetails,
        updateShippingAddress,
        updatePaymentDetails,
        isProcessingOrder,
        placeOrder,
        errors
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}