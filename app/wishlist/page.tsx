"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      salePrice: item.salePrice,
      image: item.image,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="container px-4">
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-center">My Wishlist</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-medium mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add items you love to your wishlist. Review them anytime and easily move them to the cart.
            </p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
              <Button variant="outline" size="sm" onClick={clearWishlist}>
                Clear Wishlist
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="group relative bg-white rounded-lg overflow-hidden shadow-pastel transition-all duration-300 hover:shadow-lg"
                >
                  <Link href={`/products/${item._id}`} className="block relative h-64 w-full overflow-hidden">
                    <Image
                      src={item.img || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {item.badge && (
                      <Badge
                        className={`absolute top-2 left-2 ${
                          item.badge === "Sale"
                            ? "bg-accent text-accent-foreground"
                            : item.badge === "New"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 text-red-500 hover:bg-white hover:text-red-600"
                    onClick={() => removeItem(item._id)}
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="p-4">
                    <Link href={`/products/${item._id}`}>
                      <h3 className="font-medium text-lg mb-1 transition-colors hover:text-primary">{item.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">{item.badge || "No description available"}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(item.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">({item.reviewCount})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.salePrice ? (
                          <>
                            <span className="font-bold text-lg">₹{item.salePrice}</span>
                            <span className="text-sm text-muted-foreground line-through">₹{item.price}</span>
                          </>
                        ) : (
                          <span className="font-bold text-lg">₹{item.price}</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
