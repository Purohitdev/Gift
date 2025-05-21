"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsList from "@/components/admin/products-list";
import { PlusCircle } from "lucide-react";
import CategoriesList from "@/components/admin/categories-list"; // Import CategoriesList

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
    landmark?: string; // Added landmark
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
  updatedAt?: string; // Added for consistency with timestamps
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("products");
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Determine initial tab based on URL query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "categories" || tab === "products" || tab === "orders") {
      setActiveTab(tab);
    }
  }, []);

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
          {/* Add Category button could be inside CategoriesList component or here */}
        </div>

        <Tabs
          value={activeTab} // Control active tab
          defaultValue="products"
          className="w-full"
          onValueChange={(value) => {
            setActiveTab(value);
            router.push(`/admin?tab=${value}`, { scroll: false }); // Update URL without full page reload
          }}
        >
          <TabsList className="grid w-full md:w-[400px] grid-cols-3"> {/* Adjusted for 3 tabs */}
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger> {/* Add Categories Tab Trigger */}
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
                      <th className="px-4 py-2 border-b">Payment Status</th>
                      <th className="px-4 py-2 border-b">Date</th>
                      <th className="px-4 py-2 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        // className="hover:bg-gray-50 cursor-pointer"
                        // onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-4 py-2 border-b">
                            <Button variant="link" className="p-0 h-auto" onClick={() => setSelectedOrder(order)}>
                                {order._id?.substring(0,8) || order.id?.substring(0,8)}
                            </Button>
                        </td>
                        <td className="px-4 py-2 border-b">{order.shippingAddress.fullName}</td>
                        <td className="px-4 py-2 border-b">₹{order.total.toFixed(2)}</td>
                        <td className="px-4 py-2 border-b">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ 
                            order.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                            order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.orderStatus}
                          </span>
                          </td>
                        <td className="px-4 py-2 border-b">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ 
                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                            order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-2 border-b">
                          {new Date(order.createdAt).toLocaleDateString()} 
                          <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</span>
                        </td>
                        <td className="px-4 py-2 border-b">
                            <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                View Details
                            </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
                  {selectedOrder && (
                    <div className="max-h-[80vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Order Details</h2>
                        {/* <OrderStatusUpdater orderId={selectedOrder._id!} currentStatus={selectedOrder.orderStatus} onStatusChange={(newStatus) => {
                           setSelectedOrder(prev => prev ? {...prev, orderStatus: newStatus} : null);
                           setOrders(prevOrders => prevOrders.map(o => o._id === selectedOrder._id ? {...o, orderStatus: newStatus} : o));
                        }}/> */}
                      </div>
                      <p className="mb-1"><strong className="font-semibold">Order ID:</strong> {selectedOrder._id?.substring(0,8) || selectedOrder.id?.substring(0,8)}</p>
                      <p className="mb-1"><strong className="font-semibold">Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                      <p className="mb-1"><strong className="font-semibold">Status:</strong> {selectedOrder.orderStatus}</p>
                      <p className="mb-4"><strong className="font-semibold">Payment Status:</strong> {selectedOrder.paymentStatus}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Shipping Address</h3>
                          <p>{selectedOrder.shippingAddress.fullName}</p>
                          <p>{selectedOrder.shippingAddress.address}</p>
                          {selectedOrder.shippingAddress.landmark && <p>{selectedOrder.shippingAddress.landmark}</p>}
                          <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                          <p>{selectedOrder.shippingAddress.country}</p>
                          <p>Phone: {selectedOrder.shippingAddress.phone}</p>
                          {selectedOrder.shippingAddress.email && <p>Email: {selectedOrder.shippingAddress.email}</p>}
                           {selectedOrder.shippingAddress.whatsappNumber && <p>WhatsApp: {selectedOrder.shippingAddress.whatsappNumber}</p>}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Payment Details</h3>
                          <p><strong className="font-semibold">Method:</strong> {selectedOrder.paymentMethod}</p>
                          <p><strong className="font-semibold">Subtotal:</strong> ₹{selectedOrder.subtotal.toFixed(2)}</p>
                          <p><strong className="font-semibold">Shipping:</strong> ₹{selectedOrder.shipping.toFixed(2)}</p>
                          <p><strong className="font-semibold">Tax:</strong> ₹{selectedOrder.tax.toFixed(2)}</p>
                          <p className="text-lg font-bold mt-1"><strong className="font-semibold">Total:</strong> ₹{selectedOrder.total.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Items</h3>
                        {selectedOrder.items.map((item, index) => (
                          <div key={item._id || index} className="flex gap-4 mb-3 pb-3 border-b last:border-b-0 last:pb-0 last:mb-0">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              <p className="text-sm text-gray-600">Price: ₹{(item.salePrice || item.price).toFixed(2)}</p>
                              {item.options && <p className="text-xs text-gray-500">Options: {item.options}</p>}
                            </div>
                            <p className="ml-auto font-semibold">₹{((item.salePrice || item.price) * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                      {selectedOrder.deliveryNotes && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-1">Delivery Notes</h3>
                            <p className="text-sm p-3 bg-gray-50 rounded-md">{selectedOrder.deliveryNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Dialog>
              </div>
            )}
          </TabsContent>
          
          {/* Add Categories Tab Content */}
          <TabsContent value="categories" className="mt-6">
            <CategoriesList />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
