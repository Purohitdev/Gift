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

interface CountdownTimerProps {
  saleEndDate: string;
}

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
    if (!whatsappNumber.trim()) {
      toast({
        title: "WhatsApp number required",
        description: "Please enter your WhatsApp number for design proofs.",
        variant: "destructive",
      })
      return
    }

    setIsAddingToCart(true)

    const frameSizeDisplay = frameSize === "small" ? 'Small (8" x 10")' : frameSize === "medium" ? 'Medium (11" x 14")' : 'Large (16" x 20")';
    const deliveryDisplay = delivery === "standard" ? "Standard (7-10 days)" : delivery === "express" ? "Express (3-5 days) +$9.99" : "Rush (1-2 days) +$19.99";

    // Updated options string to include all relevant details, including the product-specific WhatsApp number
    const options = `Size: ${frameSizeDisplay}, Faces: ${faces}, Delivery: ${deliveryDisplay}, WhatsApp (for proofs): ${whatsappNumber.trim()}`

    const productIdString = String(product.id || product._id || ''); // Added product._id as a fallback
    const productNameString = String(product.name || 'Unnamed Product');
    const productImageString = (typeof product.image === 'string' && product.image.trim() !== '') ? product.image : '/placeholder.svg';
    const productPriceNumber = Number(product.price || 0);
    const productSalePriceNumber = product.salePrice != null ? Number(product.salePrice) : null;

    if (!productIdString) {
      toast({
        title: "Cannot Add to Cart",
        description: "Product information is incomplete (missing ID). Please try again or contact support.",
        variant: "destructive",
      });
      setIsAddingToCart(false);
      return;
    }
    
    if (productImageString === '/placeholder.svg' && !(typeof product.image === 'string' && product.image.trim() !== '')) {
      console.warn(`Product "${productNameString}" (ID: ${productIdString}) is missing an image. Using placeholder.`);
    }

    addItem({
      id: productIdString,
      name: productNameString,
      price: productPriceNumber,
      salePrice: productSalePriceNumber,
      image: productImageString, // Ensured this is always a string
      quantity,
      options, 
    });

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
      addToWishlist(product) // Assuming product object is suitable for wishlist
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
                  i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ">
            {product.rating || 0} ({product.reviewCount || 0} reviews)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {product.salePrice && product.salePrice < product.price ? (
          <>
            <span className="text-2xl md:text-3xl font-bold">₹{product.salePrice}</span>
            <span className="text-lg text-muted-foreground line-through">₹{product.price}</span>
            <span className="bg-accent text-accent-foreground text-sm px-2 py-0.5 rounded-md">
              Save ₹{(product.price - product.salePrice).toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-2xl md:text-3xl font-bold">₹{product.price}</span>
        )}
      </div>

      {product.saleEndDate && (
        <>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Limited time offer! Sale ends in:</span>
          </div>
         <CountdownTimer/>
        </>
      )}

      <div className="space-y-4 pt-4 border-t">
      {/* Number of Faces */}
<div className="space-y-2">
  <Label htmlFor="faces">Number of Faces</Label>
  <RadioGroup
    id="faces"
    value={faces}
    onValueChange={setFaces}
    className="grid grid-cols-3 gap-3 sm:flex sm:flex-wrap"
  >
    {["1", "2", "3"].map((value) => (
      <Label
        key={value}
        htmlFor={`faces-${value}`}
        className={`
          group cursor-pointer rounded-xl border px-4 py-3 text-sm flex items-center gap-2 transition-all duration-200
          bg-white/50
          shadow-sm
          hover:bg-muted/10
          [&:has(:checked)]:bg-primary/10
          [&:has(:checked)]:border-primary
          [&:has(:checked)]:shadow-md
        `}
      >
        <RadioGroupItem id={`faces-${value}`} value={value} />
        {value} Face{value !== "1" ? "s" : ""}
      </Label>
    ))}
  </RadioGroup>
</div>

{/* Frame Size */}
<div className="space-y-2">
  <Label>Frame Size</Label>
  <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
    {[
      { value: "small", label: 'Small (8" x 10")' },
      { value: "medium", label: 'Medium (11" x 14")' },
      { value: "large", label: 'Large (16" x 20")' },
    ].map(({ value, label }) => (
      <button
        key={value}
        type="button"
        onClick={() => setFrameSize(value)}
        className={`rounded-xl px-4 py-3 text-sm transition-all duration-200
          border
          ${
            frameSize === value
              ? "bg-primary/10 border-primary shadow-md"
              : "bg-white/50 border-muted text-muted-foreground hover:bg-muted/10 shadow-sm"
          }
        `}
      >
        {label}
      </button>
    ))}
  </div>
</div>

{/* Delivery Priority */}
<div className="space-y-2">
  <Label>Delivery Priority</Label>
  <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
    {[
      { value: "standard", label: "Standard (7-10 days)" },
      { value: "express", label: "Express (3-5 days) +$9.99" },
      { value: "rush", label: "Rush (1-2 days) +$19.99" },
    ].map(({ value, label }) => (
      <button
        key={value}
        type="button"
        onClick={() => setDelivery(value)}
        className={`rounded-xl px-4 py-3 text-sm transition-all duration-200
          border
          ${
            delivery === value
              ? "bg-primary/10 border-primary shadow-md"
              : "bg-white/50 border-muted text-muted-foreground hover:bg-muted/10 shadow-sm"
          }
        `}
      >
        {label}
      </button>
    ))}
  </div>
</div>


        <div className="space-y-2">
          <Label htmlFor="whatsapp" className="flex items-center gap-1">
            WhatsApp Number (for design proofs) <span className="text-red-500">*</span>
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
          <p className="text-xs text-muted-foreground">We'll send you design proofs and updates via WhatsApp for this item.</p>
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
              onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
              className="w-16 text-center bg-white/40"
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

      {product.stock > 0 ? (
         <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
           <Check className="h-4 w-4" />
           <span>In stock - Ready to ship within 24 hours</span>
         </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
          <Clock className="h-4 w-4" />
          <span>Out of stock</span>
        </div>
      )}


      <Button
        className="w-full gap-2 bg-green-500 hover:bg-green-600 text-white"
        onClick={() => {
          const message = encodeURIComponent(`I'm interested in the product: ${product.name} (ID: ${product.id}). Please provide more details.`);
          window.open(`https://wa.me/${process.env.NEXT_PUBLIC_SHOP_WHATSAPP_NUMBER || 'YOUR_DEFAULT_WHATSAPP_NUMBER_HERE'}?text=${message}`, "_blank");
        }}
      >
        <MessageCircle className="h-4 w-4" />
        Shop on WhatsApp
      </Button>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="ghost" size="sm" className="gap-1">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <span className="text-sm text-muted-foreground">SKU: {product.sku || (product.id ? product.id.toString().padStart(6, "0") : "000000")}</span>
      </div>
    </div>
  )
}
