"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Clock, Package, CheckCircle, Truck, ShoppingBag, FileText, ExternalLink } from "lucide-react"

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
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  estimatedDelivery: string
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/orders")
        
        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }
        
        const data = await response.json()
        setOrders(data.orders || [])
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("Could not load order history. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrders()
  }, [])

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true
    if (activeTab === "processing") return order.orderStatus === "processing"
    if (activeTab === "shipped") return order.orderStatus === "shipped"
    if (activeTab === "delivered") return order.orderStatus === "delivered"
    return true
  })

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-100">Processing</Badge>
      case "shipped":
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-100">Shipped</Badge>
      case "delivered":
        return <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100">Delivered</Badge>
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-700 hover:bg-red-100">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <ShoppingBag className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 md:py-12">
        <div className="container px-4">
          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-6">My Orders</h1>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-pastel overflow-hidden animate-pulse">
                <div className="p-6">
                  <div className="h-7 bg-gray-200 w-1/4 mb-4 rounded"></div>
                  <div className="h-5 bg-gray-200 w-1/3 mb-6 rounded"></div>
                  <div className="h-24 bg-gray-200 w-full mb-4 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 md:py-12">
        <div className="container px-4">
          <div className="text-center py-12">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mb-6">
              <ShoppingBag className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-xl font-medium mb-4">Error Loading Orders</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="container px-4">
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-6">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
              <ShoppingBag className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-medium mb-4">No orders found</h2>
            <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Orders</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                  <TabsTrigger value="shipped">Shipped</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={activeTab} className="space-y-6 mt-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No {activeTab} orders found.</p>
                  </div>
                ) : (
                  filteredOrders.map(order => (
                    <Card key={order._id} className="overflow-hidden">
                      <CardHeader className="bg-gray-50 p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <CardTitle className="text-lg mb-1">
                              Order #{order._id.substring(0, 8)}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Placed on {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 mt-3 md:mt-0">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.orderStatus)}
                              {getStatusBadge(order.orderStatus)}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/order-confirmation/${order._id}`)}
                              className="gap-1"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Details
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                          <div className="md:col-span-8">
                            <div className="space-y-4">
                              {order.items.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                    <Image 
                                      src={item.image || "/placeholder.svg"} 
                                      alt={item.name} 
                                      fill 
                                      className="object-cover" 
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium truncate">{item.name}</h4>
                                    {item.options && 
                                      <p className="text-sm text-muted-foreground">{item.options}</p>
                                    }
                                    <div className="flex items-center text-sm mt-1">
                                      <span>${(item.salePrice || item.price).toFixed(2)} × {item.quantity}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {order.items.length > 2 && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  + {order.items.length - 2} more item(s)
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="md:col-span-4 flex flex-col justify-between">
                            <div className="space-y-1 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total:</span>
                                <span className="font-medium">${order.total.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Payment:</span>
                                <span>{order.paymentStatus === "paid" ? 
                                  <span className="text-green-600">Paid</span> : 
                                  <span className="text-amber-600">Pending</span>
                                }</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <Link href={`/order-confirmation/${order._id}`}>
                                <Button variant="outline" size="sm" className="w-full">
                                  <FileText className="h-4 w-4 mr-2" />
                                  View Order
                                </Button>
                              </Link>
                              
                              {order.paymentStatus === "paid" && (
                                <Link href={`/order-confirmation/${order._id}#invoice`}>
                                  <Button variant="outline" size="sm" className="w-full">
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Invoice
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <Separator className="mb-4" />
                        
                        <div className="flex flex-col sm:flex-row justify-between text-sm">
                          <div className="mb-2 sm:mb-0">
                            <span className="text-muted-foreground mr-1">Delivery:</span>
                            <span>{formatDate(order.estimatedDelivery)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground mr-1">Ship to:</span>
                            <span>{order.shippingAddress.fullName}, {order.shippingAddress.city}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </main>
  )
}