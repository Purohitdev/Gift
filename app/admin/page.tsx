'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsList from "@/components/admin/products-list";
import { PlusCircle } from "lucide-react";

const allowedEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map(email => email.trim().toLowerCase());

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("products");
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
      if (!email || !allowedEmails.includes(email)) {
        router.replace("/unauthorized");
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) return <div>Loading...</div>;

  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  if (!email || !allowedEmails.includes(email)) return null;

  return (
    <div className="container py-10 bg-gradient-to-b from-[#ffe9e3a8] via-[#faedcda8] to-[#fde2e2a8] text-gray-800">
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

        <Tabs defaultValue="products" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <ProductsList />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <div className="flex flex-col items-center justify-center h-[400px] border rounded-md bg-gray-50">
              <h3 className="text-xl font-medium text-gray-500">Orders Management</h3>
              <p className="text-muted-foreground mt-2">Coming Soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
