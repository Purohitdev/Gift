"use client";

import { useState, useEffect } from "react";
import ProductForm from "@/components/admin/product-form";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load product",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Failed to load product",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-10 w-48" />
          <div className="border rounded-lg p-6 bg-card">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-14 w-full" />
              <div className="flex justify-end gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center h-[400px]">
          <h3 className="text-xl font-medium text-gray-500">Product not found</h3>
          <p className="text-muted-foreground mt-2">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        
        <div className="border rounded-lg p-6 bg-card">
          <ProductForm initialData={product} isEditing={true} />
        </div>
      </div>
    </div>
  );
}