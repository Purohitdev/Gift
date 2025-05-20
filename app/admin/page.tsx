"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsList from "@/components/admin/products-list";
import { PlusCircle } from "lucide-react";

// Simple Dialog component (replace with your own if needed)
function Dialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        {children}
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
                      <div className="mb-2">
                        <strong>Items:</strong>
                        <ul className="list-disc ml-6">
                          {selectedOrder.items.map((item) => (
                            <li key={item._id}>
                              <strong>{item.name}</strong> – {item.quantity} pcs × ${item.salePrice || item.price} (
                              <span className="text-gray-500">{item.options}</span>)
                            </li>
                          ))}
                        </ul>
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
