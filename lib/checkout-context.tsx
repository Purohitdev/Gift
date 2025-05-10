"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "./cart-context"

// Define the types for our context
type ShippingAddress = {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  addressType: string
  deliveryNotes?: string
}

type PaymentDetails = {
  method: "online" | "cod"
  cardNumber?: string
  expiry?: string
  cvv?: string
  nameOnCard?: string
}

type CheckoutContextType = {
  shippingAddress: ShippingAddress
  paymentDetails: PaymentDetails
  updateShippingAddress: (data: Partial<ShippingAddress>) => void
  updatePaymentDetails: (data: Partial<PaymentDetails>) => void
  isProcessingOrder: boolean
  placeOrder: () => Promise<void>
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
  
  // State for shipping address and payment details
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "us",
    addressType: "home",
  })
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: "online",
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  })
  
  // Function to update shipping address
  const updateShippingAddress = (data: Partial<ShippingAddress>) => {
    setShippingAddress(prev => ({ ...prev, ...data }))
  }
  
  // Function to update payment details
  const updatePaymentDetails = (data: Partial<PaymentDetails>) => {
    setPaymentDetails(prev => ({ ...prev, ...data }))
  }
  
  // Function to place an order
  const placeOrder = async () => {
    // Validate form data
    if (!validateFormData()) {
      return
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
          options: item.options
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone
        },
        paymentMethod: paymentDetails.method,
        subtotal,
        shipping,
        tax,
        total,
        deliveryNotes: shippingAddress.deliveryNotes,
        deliveryPriority: "standard",
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
      
      // Mock payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create the order in the database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create order')
      }
      
      const order = await response.json()
      
      // Mock payment processing (always successful in this mock version)
      const paymentResponse = await mockPaymentProcessing(paymentDetails, total)
      
      if (paymentResponse.success) {
        // Update the order with payment status
        await fetch(`/api/orders/${order._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            paymentStatus: 'paid'
          })
        })
        
        // Show success message
        toast({
          title: "Order placed successfully!",
          description: `Your order #${order._id.substring(0, 8)} has been placed successfully.`,
        })
        
        // Clear the cart
        clearCart()
        
        // Redirect to order confirmation - Use a more direct approach with window.location
        // This ensures the redirect happens even if there are pending promises or state updates
        window.location.href = `/order-confirmation/${order._id}`
      } else {
        // Handle payment failure
        toast({
          title: "Payment failed",
          description: "There was an issue processing your payment. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast({
        title: "Something went wrong",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsProcessingOrder(false)
    }
  }
  
  // Mock payment processing function (always returns success for now)
  const mockPaymentProcessing = async (paymentDetails: PaymentDetails, amount: number) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Validate card number format (mock validation)
    const isCardValid = paymentDetails.cardNumber?.replace(/\s/g, '').length === 16
    
    // Always return success for the mock implementation
    return {
      success: true,
      transactionId: `txn_${Math.random().toString(36).substring(2, 10)}`,
      amount,
      paymentMethod: paymentDetails.method
    }
  }
  
  // Validate form data
  const validateFormData = () => {
    // Check if shipping address is complete
    if (
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode
    ) {
      toast({
        title: "Missing shipping information",
        description: "Please fill in all required shipping details",
        variant: "destructive"
      })
      return false
    }
    
    // Check if payment details are complete
    if (paymentDetails.method === "online") {
      if (
        !paymentDetails.cardNumber ||
        !paymentDetails.expiry ||
        !paymentDetails.cvv ||
        !paymentDetails.nameOnCard
      ) {
        toast({
          title: "Missing payment information",
          description: "Please fill in all required payment details",
          variant: "destructive"
        })
        return false
      }
    } else if (paymentDetails.method === "cod") {
      if (
        !paymentDetails.cardNumber ||
        !paymentDetails.expiry ||
        !paymentDetails.cvv ||
        !paymentDetails.nameOnCard
      ) {
        toast({
          title: "Missing advance payment information",
          description: "Please fill in all required advance payment details",
          variant: "destructive"
        })
        return false
      }
    }
    
    return true
  }
  
  return (
    <CheckoutContext.Provider
      value={{
        shippingAddress,
        paymentDetails,
        updateShippingAddress,
        updatePaymentDetails,
        isProcessingOrder,
        placeOrder
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}