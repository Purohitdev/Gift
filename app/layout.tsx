import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { Toaster } from "@/components/ui/toaster" // Import the Toaster component

import {
  ClerkProvider,
} from "@clerk/nextjs"

// Load fonts with CSS variables
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

// Static site metadata
export const metadata: Metadata = {
  title: "lovingcraft - Personalized Gift Shop",
  description: "Find the perfect personalized gift for your loved ones",
}

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${playfair.variable} font-sans bg-white min-h-screen`}>
          <ThemeProvider 
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            forcedTheme="light"
            storageKey="gift-theme-preference"
          >
            <CartProvider>
              <WishlistProvider>
                <Header />
                {children}
                <Footer />
                <Toaster /> {/* Add the Toaster component here */}
              </WishlistProvider>
            </CartProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
