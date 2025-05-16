import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
<footer className="border-t border-[#121212]/40 bg-gradient-to-t from-[#faedcd] to-[#ffe9e3] text-gray-800">
<div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">lovingcraft</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Creating personalized gifts for all your special moments.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=frames" className="text-sm text-muted-foreground hover:text-primary">
                  Photo Frames
                </Link>
              </li>
              <li>
                <Link href="/products?category=mugs" className="text-sm text-muted-foreground hover:text-primary">
                  Custom Mugs
                </Link>
              </li>
              <li>
                <Link href="/products?category=cushions" className="text-sm text-muted-foreground hover:text-primary">
                  Cushions
                </Link>
              </li>
              <li>
                <Link href="/products?category=wall-art" className="text-sm text-muted-foreground hover:text-primary">
                  Wall Art
                </Link>
              </li>
              <li>
                <Link href="/top-selling" className="text-sm text-muted-foreground hover:text-primary">
                  Top Selling
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-sm text-muted-foreground hover:text-primary">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Contact</h3>
            <address className="not-italic">
              <p className="text-sm text-muted-foreground mb-2">123 Gift Street, Craftville</p>
              <p className="text-sm text-muted-foreground mb-2">Phone: +1 (555) 123-4567</p>
              <p className="text-sm text-muted-foreground mb-2">Email: hello@lovingcraft.com</p>
            </address>
          </div>
        </div>

        <div className="border-t border-[#121212]/40 mt-12 pt-8">
          <p className="text-sm text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} lovingcraft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
