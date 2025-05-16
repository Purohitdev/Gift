"use client";

import { UserProfile, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileDetailsForm from "@/components/profile/profile-details-form";

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("account");

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold font-serif mb-6">My Profile</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50 grid w-full grid-cols-2">
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="delivery-details">Delivery Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="bg-white shadow-md rounded-lg p-6">
          <UserProfile
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary hover:bg-primary/90",
                navbar: "hidden",
                navbarMobileMenuButton: "hidden",
              }
            }}
            routing="path"
            path="/profile"
          />
        </TabsContent>
        
        <TabsContent value="delivery-details" className="space-y-4">
          <ProfileDetailsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}