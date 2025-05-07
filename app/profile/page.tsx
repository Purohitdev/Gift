"use client";

import { UserProfile, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

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
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex-1">
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
          </div>
        </div>
      </div>
    </div>
  );
}