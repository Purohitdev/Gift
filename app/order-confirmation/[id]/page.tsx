"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CheckCircle, Truck, ShoppingBag, ArrowLeft, Clock } from "lucide-react"
import InvoiceComponent from "@/components/checkout/invoice"

type OrderItem = {
  name: string
  quantity: number
  price: number
  salePrice: number | null
  image: string
  options?: string
}

type Order = {
  _id: string
  orderStatus: string
  paymentStatus: string
  paymentMethod: string
  shippingAddress: {
    fullName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
    landmark?: string; // Added landmark
  }
  customImage?: {
    data: string;
    description: string;
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  estimatedDelivery: string
  createdAt: string
}

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch order")
        }
        
        const data = await response.json()
        setOrder(data)
      } catch (err) {
        setError("Could not load order details. Please try again later.")
        console.error("Error fetching order:", err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrder()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen py-8 md:py-12">
        <div className="container px-4">
          <div className="text-center py-12">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mb-6">
              <ShoppingBag className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-xl font-medium mb-4">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">{error || "The order you're looking for could not be found."}</p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString()
  const estimatedDeliveryDate = new Date(order.estimatedDelivery).toLocaleDateString()
  
  // Get order status information
  const getOrderStatusInfo = () => {
    switch (order.orderStatus) {
      case "processing":
        return {
          icon: <Clock className="h-8 w-8 text-amber-500" />,
          text: "Processing",
          description: "Your order is being processed",
          color: "bg-amber-100"
        }
      case "shipped":
        return {
          icon: <Truck className="h-8 w-8 text-blue-500" />,
          text: "Shipped",
          description: "Your order is on the way",
          color: "bg-blue-100"
        }
      case "delivered":
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-500" />,
          text: "Delivered",
          description: "Your order has been delivered",
          color: "bg-green-100"
        }
      case "cancelled":
        return {
          icon: <ShoppingBag className="h-8 w-8 text-red-500" />,
          text: "Cancelled",
          description: "Your order has been cancelled",
          color: "bg-red-100"
        }
      default:
        return {
          icon: <Clock className="h-8 w-8 text-amber-500" />,
          text: "Processing",
          description: "Your order is being processed",
          color: "bg-amber-100"
        }
    }
  }
  
  const statusInfo = getOrderStatusInfo()

  return (
    <main className="min-h-screen py-8 md:py-12 bg-gradient-to-b from-[#ffe9e3a8] via-[#faedcda8] to-[#fde2e2a8]">
      <div className="container px-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">Order Confirmation</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${statusInfo.color}`}>
                    {statusInfo.icon}
                  </div>
                  <div>
                    <CardTitle>Thank you for your order!</CardTitle>
                    <CardDescription>
                      Order #{order._id.substring(0, 8)} • Placed on {orderDate}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Order Status: {statusInfo.text}</h3>
                  <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
                  <div className="mt-4 h-2 w-full bg-gray-100 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        order.orderStatus === "processing" ? "w-1/4 bg-amber-500" : 
                        order.orderStatus === "shipped" ? "w-2/4 bg-blue-500" :
                        order.orderStatus === "delivered" ? "w-full bg-green-500" :
                        "w-0"
                      }`}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>Order Placed</span>
                    <span>Processing</span>
                    <span>Shipped</span>
                    <span>Delivered</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Items in your order</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          {item.options && <p className="text-sm text-muted-foreground">{item.options}</p>}
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm">
                              ₹{(item.salePrice || item.price).toFixed(2)} × {item.quantity}
                            </p>
                            <p className="font-medium">₹{((item.salePrice || item.price) * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.address}</p>
                    {order.shippingAddress.landmark && <p>{order.shippingAddress.landmark}</p>}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    <p>{order.shippingAddress.phone}</p>
                  </div>                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Payment Information</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Method:</span>{" "}
                      {order.paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span className={
                        order.paymentStatus === "paid" ? "text-green-600" : 
                        order.paymentStatus === "pending" ? "text-amber-600" : 
                        "text-red-600"
                      }>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
                
                {order.customImage?.data && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Your Custom Image</h4>
                      <div className="border rounded-md p-3">
                        <img 
                          src={order.customImage.data} 
                          alt="Your uploaded image" 
                          className="max-h-40 rounded-md object-contain mb-2" 
                        />
                        {order.customImage.description && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Description:</span> {order.customImage.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Delivery Information</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Estimated Delivery Date:</span>{" "}
                      {estimatedDeliveryDate}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Shipping</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Invoice Component */}
            {order && ( // Render if order data is available
              <InvoiceComponent order={order} />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}