"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, Star, ShoppingCart, Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import CountdownTimer from "@/components/product/countdown-timer"

export default function ProductInfo({ product }: { product: any }) {
  const { toast } = useToast()
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const [quantity, setQuantity] = useState(1)
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [faces, setFaces] = useState("1")
  const [frameSize, setFrameSize] = useState("medium")
  const [delivery, setDelivery] = useState("standard")
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    // Check if the WhatsApp number is provided
    if (!whatsappNumber) {
      toast({
        title: "WhatsApp number required",
        description: "Please enter your WhatsApp number to continue.",
        variant: "destructive",
      })
      return
    }

    setIsAddingToCart(true)

    const options = `Size: ${frameSize === "small" ? 'Small (8" x 10")' : frameSize === "medium" ? 'Medium (11" x 14")' : 'Large (16" x 20")'}, Faces: ${faces}, Delivery: ${delivery}`

    // Directly add item to cart (without delay)
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.image,
      quantity,
      options,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })

    setIsAddingToCart(false)
  }

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist(product)
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  return (
    <div className="space-y-6 ">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold">{product.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ">
            {product.rating} ({product.reviewCount} reviews)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {product.salePrice ? (
          <>
            <span className="text-2xl md:text-3xl font-bold">₹{product.salePrice}</span>
            <span className="text-lg text-muted-foreground line-through">₹{product.price}</span>
            <span className="bg-accent text-accent-foreground text-sm px-2 py-0.5 rounded-md">
              Save ₹{(product.price - product.salePrice).toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-2xl md:text-3xl font-bold">${product.price}</span>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Limited time offer! Sale ends in:</span>
      </div>

      <CountdownTimer />

      <div className="space-y-4 pt-4 border-t">
        <div className="space-y-2">
          <Label htmlFor="faces">Number of Faces</Label>
          <RadioGroup id="faces" value={faces} onValueChange={setFaces} className="flex flex-wrap gap-2">
            <Label
              htmlFor="faces-1"
              className="border cursor-pointer rounded-md px-3 py-2 flex items-center gap-2 [&:has(:checked)]:bg-primary/10 [&:has(:checked)]:border-primary"
            >
              <RadioGroupItem id="faces-1" value="1" />1 Face
            </Label>
            <Label
              htmlFor="faces-2"
              className="border cursor-pointer rounded-md px-3 py-2 flex items-center gap-2 [&:has(:checked)]:bg-primary/10 [&:has(:checked)]:border-primary"
            >
              <RadioGroupItem id="faces-2" value="2" />2 Faces
            </Label>
            <Label
              htmlFor="faces-3"
              className="border cursor-pointer rounded-md px-3 py-2 flex items-center gap-2 [&:has(:checked)]:bg-primary/10 [&:has(:checked)]:border-primary"
            >
              <RadioGroupItem id="faces-3" value="3" />3 Faces
            </Label>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frame-size">Frame Size</Label>
          <Select value={frameSize} onValueChange={setFrameSize}>
            <SelectTrigger id="frame-size" className="bg-white/40">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small (8" x 10")</SelectItem>
              <SelectItem value="medium">Medium (11" x 14")</SelectItem>
              <SelectItem value="large">Large (16" x 20")</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery">Delivery Priority</Label>
          <Select value={delivery} onValueChange={setDelivery}>
            <SelectTrigger id="delivery" className="bg-white/40">
              <SelectValue placeholder="Select delivery" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (7-10 days)</SelectItem>
              <SelectItem value="express">Express (3-5 days) +$9.99</SelectItem>
              <SelectItem value="rush">Rush (1-2 days) +$19.99</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp" className="flex items-center gap-1">
            WhatsApp Number <span className="text-red-500">*</span>
          </Label>
          <div className="flex">
            <Input
              id="whatsapp"
              type="tel"
              placeholder="Enter your WhatsApp number"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              required
              className="flex-1 bg-white/40"
            />
          </div>
          <p className="text-xs text-muted-foreground">We'll send you design proofs and updates via WhatsApp</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
              className="w-16 text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <Button
          className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
        <Button
          variant={inWishlist ? "default" : "outline"}
          className={`flex-1 gap-2 ${inWishlist ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}`}
          onClick={handleWishlistToggle}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
          {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
        <Check className="h-4 w-4" />
        <span>In stock - Ready to ship within 24 hours</span>
      </div>

      <Button
        className="w-full gap-2 bg-green-500 hover:bg-green-600 text-white"
        onClick={() => window.open(`https://wa.me/1234567890?text=I'm interested in ${product.name}`, "_blank")}
      >
        <MessageCircle className="h-4 w-4" />
        Shop on WhatsApp
      </Button>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="ghost" size="sm" className="gap-1">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <span className="text-sm text-muted-foreground">SKU: {product.id ? product.id.toString().padStart(6, "0") : "000000"}</span>
      </div>
    </div>
  )
}
