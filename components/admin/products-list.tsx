"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsList() {
  interface Product {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    stock: number;
    img?: string;
    category: string;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []); // Extract the products array from the response
        } else {
          toast({
            title: "Error",
            description: "Failed to load products",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Handle product delete
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the product from the state
        setProducts((prev) => prev.filter((product) => product._id !== id));
        
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete product",
        variant: "destructive",
      });
    }
    
    // Close the confirm dialog
    setConfirmDelete(null);
  };

  // Loading skeleton
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-6" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your products inventory</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium">No products found</h3>
          <p className="text-muted-foreground mt-1 mb-4 text-center">
            You don't have any products yet. Start by adding your first product.
          </p>
          <Button asChild>
            <Link href="/admin/products/new">
              Add Your First Product
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>Manage your products inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name or category..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">No products found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search query
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {product.img && (
                          <div className="h-10 w-10 rounded-md overflow-hidden">
                            <img 
                              src={product.img} 
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <span className="line-clamp-1">
                          {product.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      {product.salePrice ? (
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </span>
                          <span className="font-medium text-primary">
                            {formatPrice(product.salePrice)}
                          </span>
                        </div>
                      ) : (
                        <span>{formatPrice(product.price)}</span>
                      )}
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      {product.stock > 0 ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Out of Stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/edit/${product._id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setConfirmDelete(product)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </CardFooter>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product &quot;{confirmDelete?.name}&quot;. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => confirmDelete?._id && handleDelete(confirmDelete._id)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}