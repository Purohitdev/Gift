// "use client"

// import { useState, useEffect } from "react"
// import type React from "react"
// import { UserCircle } from "lucide-react"

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

//   // Prevent background scroll on mobile fullscreen search open
//   useEffect(() => {
//     if (isSearchOpen) {
//       document.body.style.overflow = "hidden"
//     } else {
//       document.body.style.overflow = ""
//     }
//   }, [isSearchOpen])

//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-gradient-to-b from-[#fff4f2]/60 to-[#faedcd]/60 backdrop-blur-md shadow-sm">
//       <div className="container flex h-16 items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           {/* Mobile Menu */}
//           <Sheet>
//             <SheetTrigger asChild className="lg:hidden">
//               <Button variant="ghost" size="icon" aria-label="Menu">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left" className="w-[300px] sm:w-[400px]">
//               <nav className="flex flex-col gap-4 mt-8">
//                 <Link href="/" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">
//                   Home
//                 </Link>
//                 <Link href="/products" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">
//                   Shop
//                 </Link>
//                 <Link href="/about" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">
//                   About Us
//                 </Link>
//                 <Link href="/contact" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">
//                   Contact
//                 </Link>
//                 <Link href="/testimonials" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">
//                   Testimonials
//                 </Link>
//                 <Link href="/faq" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">
//                   FAQ
//                 </Link>
//               </nav>
//             </SheetContent>
//           </Sheet>

//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2">
//             <span className="text-xl font-serif font-bold tracking-wide">lovingcraft</span>
//           </Link>

//           {/* Desktop Nav */}
//           <nav className="hidden lg:flex items-center gap-6">
//             <Link href="/" className="text-sm font-medium transition-colors hover:text-[#d48a6e]">
//               Home
//             </Link>
//             <Link href="/products" className="text-sm font-medium transition-colors hover:text-[#d48a6e]">
//               Shop
//             </Link>
//             <Link href="/about" className="text-sm font-medium transition-colors hover:text-[#d48a6e]">
//               About Us
//             </Link>
//             <Link href="/contact" className="text-sm font-medium transition-colors hover:text-[#d48a6e]">
//               Contact
//             </Link>
//           </nav>
//         </div>

//         {/* Right Controls */}
//         <div className="flex items-center gap-2">
//           {/* Desktop Search Bar */}
//           <div className="hidden lg:flex items-center">
//             {isSearchOpen ? (
//               <form onSubmit={handleSearch} className="flex items-center">
//                 <Input
//                   type="search"
//                   placeholder="Search..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-[200px] md:w-[300px]"
//                   autoFocus
//                 />
//                 <Button
//                   type="submit"
//                   className="ml-2 bg-[#d48a6e] hover:bg-[#c0765b] text-white"
//                 >
//                   Search
//                 </Button>
//                 <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
//                   <X className="h-5 w-5" />
//                 </Button>
//               </form>
//             ) : (
//               <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
//                 <Search className="h-5 w-5" />
//               </Button>
//             )}
//           </div>

//           {/* Mobile Search Button */}
//           <Button
//             variant="ghost"
//             size="icon"
//             aria-label="Search"
//             onClick={() => setIsSearchOpen(true)}
//             className="lg:hidden"
//           >
//             <Search className="h-5 w-5" />
//           </Button>

//           {/* Wishlist & Cart */}
//           <WishlistDropdown />
//           <CartDropdown />

//           {/* Auth Button */}
//           {isSignedIn ? (
//             <UserButton afterSignOutUrl="/" />
//           ) : (
//             <SignInButton mode="modal">
//               <Button variant="ghost" size="icon" aria-label="Sign In">
//                 <UserCircle className="h-8 w-8" />
//               </Button>
//             </SignInButton>
//           )}
//         </div>
//       </div>

//       {/* Mobile Search Fullscreen Overlay */}
//       {isSearchOpen && (
//         <div
//           className="lg:hidden fixed top-20 inset-0 z-50 bg-white/90 backdrop-blur-md flex items-center justify-center px-4 transition-opacity duration-300"
//           onClick={() => setIsSearchOpen(false)}
//         >
//           <div
//             className="bg-white w-full max-w-md p-4 rounded-xl shadow-lg flex flex-col items-center gap-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <form
//               onSubmit={handleSearch}
//               className="w-full flex flex-col items-center gap-3"
//             >
//               <Input
//                 type="search"
//                 placeholder="Search for gifts..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full"
//                 autoFocus
//               />
//               <div className="flex gap-2 w-full">
//                 <Button
//                   type="submit"
//                   className="flex-1 bg-[#d48a6e] hover:bg-[#c0765b] text-white"
//                 >
//                   Search
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setIsSearchOpen(false)}
//                   className="text-gray-600"
//                 >
//                   <X className="h-5 w-5" />
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </header>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { UserCircle, Search, Menu, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import CartDropdown from "@/components/layout/cart-dropdown"
import WishlistDropdown from "@/components/layout/wishlist-dropdown"

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

  useEffect(() => {
    document.body.style.overflow = isSearchOpen ? "hidden" : ""
  }, [isSearchOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-gradient-to-b from-[#fff4f2]/60 to-[#faedcd]/60 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 items-center gap-4">
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">Home</Link>
                <Link href="/products" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">Shop</Link>
                <Link href="/about" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">About Us</Link>
                <Link href="/contact" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">Contact</Link>
                <Link href="/testimonials" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">Testimonials</Link>
                <Link href="/faq" className="text-lg font-medium transition-colors hover:text-[#d48a6e]">FAQ</Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold tracking-wide">lovingcraft</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 justify-center items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-[#d48a6e]">Home</Link>
          <Link href="/products" className="text-sm font-medium transition-colors hover:text-[#d48a6e]">Shop</Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-[#d48a6e]">About Us</Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-[#d48a6e]">Contact</Link>
        </nav>

        {/* Right: Search, Wishlist, Cart, Auth */}
        <div className="flex items-center gap-2">
          {/* Desktop Search */}
          <div className="hidden lg:flex items-center">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[200px] md:w-[300px]"
                  autoFocus
                />
                <Button type="submit" className="ml-2 bg-[#d48a6e] hover:bg-[#c0765b] text-white">Search</Button>
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Mobile Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden"
          >
            <Search className="h-5 w-5" />
          </Button>

          <WishlistDropdown />
          <CartDropdown />

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <Button variant="ghost" size="icon" aria-label="Sign In">
                <UserCircle className="h-8 w-8" />
              </Button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* Mobile Fullscreen Search */}
      {isSearchOpen && (
        <div
          className="lg:hidden fixed top-20 inset-0 z-50 bg-white/90 backdrop-blur-md flex items-center justify-center px-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md p-4 rounded-xl shadow-lg flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} className="w-full flex flex-col items-center gap-3">
              <Input
                type="search"
                placeholder="Search for gifts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                autoFocus
              />
              <div className="flex gap-2 w-full">
                <Button type="submit" className="flex-1 bg-[#d48a6e] hover:bg-[#c0765b] text-white">Search</Button>
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}
