"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <AuthenticateWithRedirectCallback />
    </div>
  );
}