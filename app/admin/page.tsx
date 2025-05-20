"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsList from "@/components/admin/products-list";
import { PlusCircle } from "lucide-react";

function Dialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-0 max-w-4xl w-full max-h-[90vh] overflow-auto relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-full p-2 transition-colors" 
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        </button>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

const allowedEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase());

type Order = {
  id: string;
  _id?: string;
  items: {
    product: string;
    name: string;
    quantity: number;
    price: number;
    salePrice: number;
    image: string;
    options: string;
    _id: string;
  }[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email: string;
    whatsappNumber: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  deliveryNotes: string;
  deliveryPriority: string;
  createdAt: string;
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("products");
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
      if (!email || !allowedEmails.includes(email)) {
        router.replace("/unauthorized");
      }
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (activeTab === "orders") {
      setOrdersLoading(true);
      setOrdersError(null);
      fetch("/api/orders")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch orders");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setOrders(data);
          } else if (Array.isArray(data.orders)) {
            setOrders(data.orders);
          } else {
            setOrders([]);
          }
        })
        .catch((err) => setOrdersError(err.message))
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab]);

  if (!isLoaded) return <div>Loading...</div>;

  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  if (!email || !allowedEmails.includes(email)) return null;

  return (
    <div className="py-10 container text-gray-800">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          {activeTab === "products" && (
            <Button asChild>
              <Link href="/admin/products/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          )}
        </div>

        <Tabs
          defaultValue="products"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <ProductsList />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            {ordersLoading ? (
              <div className="flex justify-center items-center h-[400px]">
                Loading orders...
              </div>
            ) : ordersError ? (
              <div className="text-red-500">{ordersError}</div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] border rounded-md bg-gray-50">
                <h3 className="text-xl font-medium text-gray-500">
                  No orders found
                </h3>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-md">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b">Order ID</th>
                      <th className="px-4 py-2 border-b">Customer</th>
                      <th className="px-4 py-2 border-b">Total</th>
                      <th className="px-4 py-2 border-b">Status</th>
                      <th className="px-4 py-2 border-b">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-4 py-2 border-b">{order._id}</td>
                        <td className="px-4 py-2 border-b">{order.shippingAddress.fullName}</td>
                        <td className="px-4 py-2 border-b">${order.total.toFixed(2)}</td>
                        <td className="px-4 py-2 border-b">{order.orderStatus}</td>
                        <td className="px-4 py-2 border-b">
                          {new Date(order.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
                  {selectedOrder && (
                    <div>
                      <h2 className="text-xl font-bold mb-2">Order Details</h2>
                      <div className="mb-2">
                        <strong>Order ID:</strong> {selectedOrder._id}
                      </div>
                      <div className="mb-2">
                        <strong>Customer:</strong> {selectedOrder.shippingAddress.fullName}
                      </div>
                      <div className="mb-2">
                        <strong>Email:</strong> {selectedOrder.shippingAddress.email}
                      </div>
                      <div className="mb-2">
                        <strong>Phone:</strong> {selectedOrder.shippingAddress.phone}
                      </div>
                      <div className="mb-2">
                        <strong>Address:</strong> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}
                      </div>
                      <div className="mb-2">
                        <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
                      </div>
                      <div className="mb-2">
                        <strong>Payment Status:</strong> {selectedOrder.paymentStatus}
                      </div>
                      <div className="mb-2">
                        <strong>Order Status:</strong> {selectedOrder.orderStatus}
                      </div>
                      <div className="mb-2">
                        <strong>Subtotal:</strong> ${selectedOrder.subtotal.toFixed(2)}
                      </div>
                      <div className="mb-2">
                        <strong>Shipping:</strong> ${selectedOrder.shipping.toFixed(2)}
                      </div>
                      <div className="mb-2">
                        <strong>Tax:</strong> ${selectedOrder.tax.toFixed(2)}
                      </div>
                      <div className="mb-2">
                        <strong>Total:</strong> ${selectedOrder.total.toFixed(2)}
                      </div>
                      <div className="mb-2">
                        <strong>Delivery Notes:</strong> {selectedOrder.deliveryNotes}
                      </div>
                      <div className="mb-2">
                        <strong>Delivery Priority:</strong> {selectedOrder.deliveryPriority}
                      </div>
                      <div className="mb-2">
                        <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
                      </div>
                        {/* Customer Details */}
                        <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-100">
                        <h3 className="text-lg font-semibold mb-2 text-blue-700">Customer Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                          <div>
                          <strong>Name:</strong> {selectedOrder.shippingAddress.fullName}
                          </div>
                          <div>
                          <strong>Email:</strong> {selectedOrder.shippingAddress.email}
                          </div>
                          <div>
                          <strong>Phone:</strong> {selectedOrder.shippingAddress.phone}
                          </div>
                          <div>
                          <strong>WhatsApp:</strong> {selectedOrder.shippingAddress.whatsappNumber}
                          </div>
                          <div className="md:col-span-2">
                          <strong>Address:</strong> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}
                          </div>
                        </div>
                        </div>

                        {/* Items Details */}
                        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-100">
                        <h3 className="text-lg font-semibold mb-2 text-green-700">Order Items</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                          <thead>
                            <tr>
                            <th className="px-2 py-2 text-left">Image</th>
                            <th className="px-2 py-2 text-left">Product</th>
                            <th className="px-2 py-2 text-left">Options</th>
                            <th className="px-2 py-2 text-left">Quantity</th>
                            <th className="px-2 py-2 text-left">Price</th>
                            <th className="px-2 py-2 text-left">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.items.map((item) => (
                            <tr key={item._id} className="border-t">
                              <td className="px-2 py-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded border"
                              />
                              </td>
                              <td className="px-2 py-2 font-medium">{item.name}</td>
                              <td className="px-2 py-2 text-gray-600">{item.options}</td>
                              <td className="px-2 py-2">{item.quantity}</td>
                              <td className="px-2 py-2">
                              ${item.salePrice ? item.salePrice.toFixed(2) : item.price.toFixed(2)}
                              </td>
                              <td className="px-2 py-2">
                              ${(item.quantity * (item.salePrice || item.price)).toFixed(2)}
                              </td>
                            </tr>
                            ))}
                          </tbody>
                          </table>
                        </div>
                        </div>
                    </div>
                  )}
                </Dialog>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
