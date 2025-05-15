"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Filter, X, SlidersHorizontal, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import ProductCard from "@/components/product/product-card"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get params from URL
  const categoryParam = searchParams.get("category")
  const saleParam = searchParams.get("sale") === "true"
  const searchQuery = searchParams.get("search")
  const minPriceParam = searchParams.get("minPrice")
  const maxPriceParam = searchParams.get("maxPrice")
  const ratingParam = searchParams.get("rating")
  const sortParam = searchParams.get("sort") || "featured"
  const pageParam = parseInt(searchParams.get("page") || "1")

  // State for data
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [pagination, setPagination] = useState({
    currentPage: pageParam,
    totalPages: 1,
    totalProducts: 0,
    hasMore: false
  })
  const [fetchSource, setFetchSource] = useState<string>("");

  // State for UI
  const [maxPrice, setMaxPrice] = useState<number>(1000)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : [])
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPriceParam ? Number.parseInt(minPriceParam) : 0,
    maxPriceParam ? Number.parseInt(maxPriceParam) : 1000,
  ])
  const [showSaleOnly, setShowSaleOnly] = useState<boolean>(saleParam)
  const [minRating, setMinRating] = useState<number>(ratingParam ? Number.parseInt(ratingParam) : 0)
  const [sortBy, setSortBy] = useState<string>(sortParam)
  const [activeFilters, setActiveFilters] = useState<number>(0)
  const [viewMode, setViewMode] = useState<string>("grid")

  // Fetch products and categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        setFetchSource("Fetching from cache...");
        const params = new URLSearchParams();
        if (selectedCategories.length > 0) {
          params.set('category', selectedCategories.join(','));
        }
        if (showSaleOnly) {
          params.set('sale', 'true');
        }
        if (priceRange[0] > 0) {
          params.set('minPrice', priceRange[0].toString());
        }
        if (priceRange[1] < maxPrice) {
          params.set('maxPrice', priceRange[1].toString());
        }
        if (minRating > 0) {
          params.set('rating', minRating.toString());
        }
        if (sortBy) {
          params.set('sort', sortBy);
        }
        if (searchQuery) {
          params.set('search', searchQuery);
        }
        params.set('page', pagination.currentPage.toString());

        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data.products);
        setPagination(data.pagination);
        setFetchSource(data.fromCache ? "Loaded from cache" : "Loaded from server");
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Count active filters
    let filterCount = 0;
    if (selectedCategories.length > 0) filterCount++;
    if (showSaleOnly) filterCount++;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) filterCount++;
    if (minRating > 0) filterCount++;
    setActiveFilters(filterCount);

    // Update URL without refreshing the page
    const params = new URLSearchParams();

    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','));
    }

    if (showSaleOnly) {
      params.set('sale', 'true');
    }

    if (priceRange[0] > 0) {
      params.set('minPrice', priceRange[0].toString());
    }

    if (priceRange[1] < maxPrice) {
      params.set('maxPrice', priceRange[1].toString());
    }

    if (minRating > 0) {
      params.set('rating', minRating.toString());
    }

    if (sortBy !== 'featured') {
      params.set('sort', sortBy);
    }

    if (searchQuery) {
      params.set('search', searchQuery);
    }

    if (pagination.currentPage > 1) {
      params.set('page', pagination.currentPage.toString());
    }

    const url = `/products?${params.toString()}`;
    router.push(url, { scroll: false });
  }, [selectedCategories, showSaleOnly, priceRange, minRating, sortBy, pagination.currentPage, searchQuery]);

  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setShowSaleOnly(false);
    setMinRating(0);
    setPagination({ ...pagination, currentPage: 1 });

    // Remove filter params from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("sale");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("rating");
    params.delete("page");

    // Keep search and sort params
    const url = `/products?${params.toString()}`;
    router.push(url, { scroll: false });
  };

  // Remove a specific filter
  const removeFilter = (type: string, value?: string) => {
    switch (type) {
      case "category":
        setSelectedCategories((prev) => prev.filter((cat) => cat !== value));
        break;
      case "sale":
        setShowSaleOnly(false);
        break;
      case "price":
        setPriceRange([0, maxPrice]);
        break;
      case "rating":
        setMinRating(0);
        break;
    }

    // Reset to page 1 when filters change
    setPagination({ ...pagination, currentPage: 1 });
  };

  // Load more products
  const loadMoreProducts = () => {
    if (pagination.hasMore) {
      setPagination({ ...pagination, currentPage: pagination.currentPage + 1 });
    }
  };

  return (
    <main className="min-h-screen py-8 bg-gradient-to-b from-[#ffe9e3a8] via-[#faedcda8] to-[#fde2e2a8]">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">
              {searchQuery ? `Search Results: "${searchQuery}"` : "Shop All Products"}
            </h1>
            <p className="text-muted-foreground">
              {pagination.totalProducts} {pagination.totalProducts === 1 ? "product" : "products"} found
            </p>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFilters > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                      {activeFilters}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex justify-between items-center">
                    Filters
                    {activeFilters > 0 && (
                      <Button variant="ghost" size="sm" onClick={resetFilters}>
                        <X className="h-3 w-3 mr-1" />
                        Reset All
                      </Button>
                    )}
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-mobile-${category.id}`}
                            checked={selectedCategories.includes(category.name.toLowerCase())}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, category.name.toLowerCase()]);
                              } else {
                                setSelectedCategories(
                                  selectedCategories.filter((c) => c !== category.name.toLowerCase()),
                                );
                              }
                              setPagination({ ...pagination, currentPage: 1 });
                            }}
                          />
                          <Label htmlFor={`category-mobile-${category.id}`}>{category.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Price Range</h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={[0, maxPrice]}
                        max={maxPrice}
                        step={1}
                        value={priceRange}
                        onValueChange={(value) => {
                          setPriceRange(value as [number, number]);
                          setPagination({ ...pagination, currentPage: 1 });
                        }}
                      />
                      <div className="flex justify-between mt-2">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Rating</h3>
                    <div className="flex flex-col gap-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox
                            id={`rating-mobile-${rating}`}
                            checked={minRating === rating}
                            onCheckedChange={(checked) => {
                              setMinRating(checked ? rating : 0);
                              setPagination({ ...pagination, currentPage: 1 });
                            }}
                          />
                          <Label htmlFor={`rating-mobile-${rating}`} className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-1">{rating}+ stars</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Other Filters</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sale-only-mobile"
                        checked={showSaleOnly}
                        onCheckedChange={(checked) => {
                          setShowSaleOnly(!!checked);
                          setPagination({ ...pagination, currentPage: 1 });
                        }}
                      />
                      <Label htmlFor="sale-only-mobile">Show sale items only</Label>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
                    Reset Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <span className="text-sm hidden md:inline">Sort by:</span>
              <Select value={sortBy} onValueChange={(value) => {
                setSortBy(value);
                setPagination({ ...pagination, currentPage: 1 });
              }}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode("grid")}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <SlidersHorizontal className="h-4 w-4 rotate-90" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active filters */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                Category: {category}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => removeFilter("category", category)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            {priceRange[0] > 0 || priceRange[1] < maxPrice ? (
              <Badge variant="secondary" className="flex items-center gap-1">
                Price: ${priceRange[0]} - ${priceRange[1]}
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => removeFilter("price")}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ) : null}

            {minRating > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Rating: {minRating}+ stars
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => removeFilter("rating")}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {showSaleOnly && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Sale Items Only
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => removeFilter("sale")}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            <Button variant="outline" size="sm" onClick={resetFilters} className="h-7">
              Clear All Filters
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Filters</h3>
                  {activeFilters > 0 && (
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2">
                      <X className="h-3 w-3 mr-1" />
                      Reset
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.name.toLowerCase())}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, category.name.toLowerCase()]);
                              } else {
                                setSelectedCategories(
                                  selectedCategories.filter((c) => c !== category.name.toLowerCase()),
                                );
                              }
                              setPagination({ ...pagination, currentPage: 1 });
                            }}
                          />
                          <Label htmlFor={`category-${category.id}`} className="text-sm">
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Price Range</h4>
                    <div className="px-2">
                      <Slider
                        defaultValue={[0, maxPrice]}
                        max={maxPrice}
                        step={1}
                        value={priceRange}
                        onValueChange={(value) => {
                          setPriceRange(value as [number, number]);
                          setPagination({ ...pagination, currentPage: 1 });
                        }}
                      />
                      <div className="flex justify-between mt-2 text-sm">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Rating</h4>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox
                            id={`rating-${rating}`}
                            checked={minRating === rating}
                            onCheckedChange={(checked) => {
                              setMinRating(checked ? rating : 0);
                              setPagination({ ...pagination, currentPage: 1 });
                            }}
                          />
                          <Label htmlFor={`rating-${rating}`} className="flex items-center text-sm">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-1">{rating}+ stars</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Other Filters</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sale-only"
                        checked={showSaleOnly}
                        onCheckedChange={(checked) => {
                          setShowSaleOnly(!!checked);
                          setPagination({ ...pagination, currentPage: 1 });
                        }}
                      />
                      <Label htmlFor="sale-only" className="text-sm">
                        Show sale items only
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="rounded-md bg-gray-200 h-64 mb-3"></div>
                    <div className="bg-gray-200 h-5 w-3/4 mb-2 rounded"></div>
                    <div className="bg-gray-200 h-4 w-1/2 mb-3 rounded"></div>
                    <div className="flex justify-between items-center">
                      <div className="bg-gray-200 h-6 w-1/4 rounded"></div>
                      <div className="bg-gray-200 h-9 w-1/3 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search criteria</p>
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className="flex flex-col sm:flex-row gap-4 bg-white/60 rounded-lg overflow-hidden shadow-pastel p-4"
                      >
                        <div className="relative h-48 sm:h-40 sm:w-40 rounded-md overflow-hidden">
                          <img
                            src={product.img || "/placeholder.svg"}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          {product.badge && (
                            <Badge
                              className={`absolute top-2 left-2 ${
                                product.badge === "Sale"
                                  ? "bg-accent text-accent-foreground"
                                  : product.badge === "New"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              {product.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                          <div className="flex items-center gap-2 mb-2">
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
                            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              {product.salePrice ? (
                                <>
                                  <span className="font-bold text-lg">${product.salePrice}</span>
                                  <span className="text-sm text-muted-foreground line-through">${product.price}</span>
                                </>
                              ) : (
                                <span className="font-bold text-lg">${product.price}</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/products/${product._id}`)
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination.hasMore && (
                  <div className="mt-8 text-center">
                    <Button onClick={loadMoreProducts} variant="outline" size="lg">
                      Load More Products
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
