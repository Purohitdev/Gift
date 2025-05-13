// "use client"
// import { useState } from "react"
// import type React from "react"

// import Link from "next/link"
// import { Search, Menu, X } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import CartDropdown from "@/components/layout/cart-dropdown"
// import WishlistDropdown from "@/components/layout/wishlist-dropdown"
// import { useRouter } from "next/navigation"
// import { SignInButton, UserButton, useUser } from "@clerk/nextjs"

// export default function Header() {
//   const [isSearchOpen, setIsSearchOpen] = useState(false)
//   const [searchTerm, setSearchTerm] = useState("")
//   const router = useRouter()
//   const { isSignedIn } = useUser()

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (searchTerm.trim()) {
//       router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
//       setSearchTerm("")
//       setIsSearchOpen(false)
//     }
//   }

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
//       <div className="container flex h-16 items-center justify-between">
//         <div className="flex items-center gap-6">
//           <Sheet>
//             <SheetTrigger asChild className="lg:hidden">
//               <Button variant="ghost" size="icon" aria-label="Menu">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left" className="w-[300px] sm:w-[400px]">
//               <nav className="flex flex-col gap-4 mt-8">
//                 <Link href="/" className="text-lg font-medium transition-colors hover:text-primary">
//                   Home
//                 </Link>
//                 <Link href="/products" className="text-lg font-medium transition-colors hover:text-primary">
//                   Shop
//                 </Link>
//                 <Link href="/about" className="text-lg font-medium transition-colors hover:text-primary">
//                   About Us
//                 </Link>
//                 <Link href="/contact" className="text-lg font-medium transition-colors hover:text-primary">
//                   Contact
//                 </Link>
//                 <Link href="/testimonials" className="text-lg font-medium transition-colors hover:text-primary">
//                   Testimonials
//                 </Link>
//                 <Link href="/faq" className="text-lg font-medium transition-colors hover:text-primary">
//                   FAQ
//                 </Link>
//               </nav>
//             </SheetContent>
//           </Sheet>

//           <Link href="/" className="flex items-center gap-2">
//             <span className="text-xl font-serif font-bold">Gifty</span>
//           </Link>

//           <nav className="hidden lg:flex items-center gap-6">
//             <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
//               Home
//             </Link>
//             <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
//               Shop
//             </Link>
//             <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
//               About Us
//             </Link>
//             <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
//               Contact
//             </Link>
//           </nav>
//         </div>

//         <div className="flex items-center gap-4">
//           {isSearchOpen ? (
//             <form onSubmit={handleSearch} className="flex items-center">
//               <Input
//                 type="search"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-[200px] md:w-[300px]"
//               />
//               <Button type="submit" className="ml-2 bg-primary hover:bg-primary/90">
//                 Search
//               </Button>
//               <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
//                 <X className="h-5 w-5" />
//               </Button>
//             </form>
//           ) : (
//             <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
//               <Search className="h-5 w-5" />
//             </Button>
//           )}

//           <WishlistDropdown />
//           <CartDropdown />
//           {isSignedIn ? (
//             <UserButton />
//           ) : (
//             <SignInButton mode="redirect">Sign In</SignInButton>
//           )}
//         </div>
//       </div>
//     </header>
//   )
// }


"use client"

import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import CartDropdown from "@/components/layout/cart-dropdown"
import WishlistDropdown from "@/components/layout/wishlist-dropdown"
import { useRouter } from "next/navigation"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const { isSignedIn } = useUser()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm("")
      setIsSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-gradient-to-b from-[#fff4f2]/60 to-[#faedcd]/60 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">
                  Home
                </Link>
                <Link href="/products" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">
                  Shop
                </Link>
                <Link href="/about" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">
                  About Us
                </Link>
                <Link href="/contact" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">
                  Contact
                </Link>
                <Link href="/testimonials" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">
                  Testimonials
                </Link>
                <Link href="/faq" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">
                  FAQ
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold tracking-wide">Gifty</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-[#d48a6e]">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium transition-colors hover:text-[#d48a6e]">
              Shop
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-[#d48a6e]">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-[#d48a6e]">
              Contact
            </Link>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[200px] md:w-[300px]"
              />
              <Button
                type="submit"
                className="ml-2 bg-[#d48a6e] hover:bg-[#c0765b] text-white"
              >
                Search
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </form>
          ) : (
            <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Wishlist & Cart */}
          <WishlistDropdown />
          <CartDropdown />

          {/* Auth Button */}
          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="redirect">
              <Button variant="outline" className="text-sm px-4 py-1.5 border-[#d48a6e] hover:bg-[#faedcd]">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}
