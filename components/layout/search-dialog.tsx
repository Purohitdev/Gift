"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, X, ArrowRight, History, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Category {
  id: number;
  name: string;
  image?: string | {
    data: Buffer;
    contentType: string;
  };
  imageUrl?: string;
  link: string;
}

export default function SearchDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<any[]>([]); // Add state for products

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catResponse = await fetch('/api/categories');
        if (catResponse.ok) {
          const catData = await catResponse.json();
          setCategories(catData);
        } else {
          console.error("Failed to fetch categories");
        }

        const prodResponse = await fetch('/api/products');
        if (prodResponse.ok) {
          const prodData = await prodResponse.json();
          // Assuming the API returns products in a 'products' field or directly as an array
          setProducts(prodData.products || prodData);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem("searchHistory")
    if (history) {
      setSearchHistory(JSON.parse(history))
    }

    const viewed = localStorage.getItem("recentlyViewed")
    if (viewed) {
      try {
        const viewedProductIds = JSON.parse(viewed)
        // Find the actual products from the fetched products state
        if (products.length > 0) {
          const viewedProductsData = viewedProductIds
            .map((id: string) => products.find((p) => p._id === id || p.id === id)) // Adjust based on your product ID field
            .filter(Boolean)
            .slice(0, 4)
          setRecentlyViewed(viewedProductsData)
        }
      } catch (error) {
        console.error("Failed to parse recently viewed products:", error)
      }
    }
  }, [products]) // Add products to dependency array

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
  }, [searchHistory])

  // Search products
  useEffect(() => {
    if (searchTerm.trim() === "" || products.length === 0) { // Check if products are loaded
      setSearchResults([])
      return
    }

    const term = searchTerm.toLowerCase()
    const results = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term),
    )
    setSearchResults(results.slice(0, 5)) // Limit to 5 results
  }, [searchTerm, products]) // Add products to dependency array

  const handleSearch = () => {
    if (searchTerm.trim() === "") return

    // Add to search history if not already present
    if (!searchHistory.includes(searchTerm)) {
      setSearchHistory((prev) => [searchTerm, ...prev].slice(0, 5))
    }

    router.push(`/products?search=${encodeURIComponent(searchTerm)}`)
    setOpen(false)
    setSearchTerm("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("searchHistory")
  }

  const handleHistoryItemClick = (term: string) => {
    router.push(`/products?search=${encodeURIComponent(term)}`)
    setOpen(false)
  }

  const handleProductClick = (productId: string) => { // Changed to string if using MongoDB _id
    router.push(`/products/${productId}`)
    setOpen(false)
  }

  const popularSearches = ["photo frame", "custom mug", "gift set", "jewelry", "wall art"]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="flex items-center border-b p-4">
          <Search className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
          <Input
            type="search"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
          />
          {searchTerm && (
            <Button variant="ghost" size="icon" onClick={() => setSearchTerm("")} className="flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button onClick={handleSearch} className="ml-2 flex-shrink-0 bg-primary hover:bg-primary/90">
            Search
          </Button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-auto">
          {searchTerm && searchResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Search Results</h3>
              <div className="space-y-3">
                {searchResults.map((product) => (
                  <div
                    key={product._id || product.id} // Adjust based on your product ID field
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => handleProductClick(product._id || product.id)} // Adjust
                  >
                    <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                      <Image
                        src={product.image || product.img || "/placeholder.svg"} // Adjust image field
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{product.name}</h4>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-sm font-medium">
                      {product.salePrice ? (
                        <>
                          <span className="text-primary">₹{product.salePrice}</span>{" "}
                          <span className="text-muted-foreground line-through text-xs">₹{product.price}</span>
                        </>
                      ) : (
                        <span>₹{product.price}</span>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => {
                    router.push(`/products?search=${encodeURIComponent(searchTerm)}`)
                    setOpen(false)
                  }}
                >
                  <span>View all results</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {searchTerm && searchResults.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-2">No results found for "{searchTerm}"</p>
              <p className="text-sm text-muted-foreground mb-4">
                Try checking your spelling or using different keywords
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularSearches.map((term) => (
                  <Badge
                    key={term}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => setSearchTerm(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {!searchTerm && (
            <>
              {searchHistory.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium flex items-center">
                      <History className="h-4 w-4 mr-2" />
                      Recent Searches
                    </h3>
                    <Button variant="ghost" size="sm" onClick={clearSearchHistory} className="h-8 px-2">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((term, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => handleHistoryItemClick(term)}
                      >
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <Badge
                      key={term}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => setSearchTerm(term)}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Popular Categories</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.length > 0 ? categories.slice(0, 6).map((category) => (
                    <Button
                      key={category.id}
                      variant="outline"
                      className="justify-start h-auto py-2"
                      onClick={() => {
                        router.push(category.link)
                        setOpen(false)
                      }}
                    >                      <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                        <Image
                          src={`/api/categories/${category.id}/image`}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span>{category.name}</span>
                    </Button>
                  )) : <p>Loading categories...</p>}
                </div>
              </div>

              {recentlyViewed.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Recently Viewed</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {recentlyViewed.map((product) => (
                      <div
                        key={product._id || product.id} // Adjust
                        className="cursor-pointer group"
                        onClick={() => handleProductClick(product._id || product.id)} // Adjust
                      >
                        <div className="relative aspect-square rounded-md overflow-hidden border mb-2">
                          <Image
                            src={product.image || product.img || "/placeholder.svg"} // Adjust
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h4 className="text-sm font-medium truncate group-hover:text-primary">{product.name}</h4>
                        <p className="text-sm">
                          {product.salePrice ? (
                            <>
                              <span className="font-medium">₹{product.salePrice}</span>{" "}
                              <span className="text-muted-foreground line-through text-xs">₹{product.price}</span>
                            </>
                          ) : (
                            <span className="font-medium">₹{product.price}</span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
