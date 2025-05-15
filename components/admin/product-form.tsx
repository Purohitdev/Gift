"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

// Define schema for form validation
const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  salePrice: z.coerce.number().nullable().optional(),
  category: z.string().min(1, "Category is required"),
  badge: z.string().nullable().optional(),
  stock: z.coerce.number().min(0, "Stock must be a positive number"),
  featured: z.boolean().default(false),
  highlights: z.array(z.string()).default([]),
  // File upload fields
  mainImage: z.any().optional(),
  additionalImages: z.any().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: ProductFormValues & { _id?: string };
  isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);

  // Initialize form with either initial data or default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      salePrice: null,
      category: "",
      badge: null,
      stock: 10,
      featured: false,
      highlights: [],
    },
  });

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.map((cat: any) => cat.name));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Initialize highlights if editing a product with existing highlights
  useEffect(() => {
    if (initialData?.highlights?.length) {
      setHighlights(initialData.highlights);
    }
  }, [initialData]);

  // Handle image file selection and preview
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      form.setValue('mainImage', file);
      
      // Create and set preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setMainImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAdditionalImages(files);
      form.setValue('additionalImages', files);
      
      // Create and set preview URLs
      const previews: string[] = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            previews.push(event.target.result as string);
            if (previews.length === files.length) {
              setAdditionalImagePreviews(previews);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Handle highlights management
  const addHighlight = () => {
    setHighlights([...highlights, ""]);
  };

  const removeHighlight = (index: number) => {
    const newHighlights = [...highlights];
    newHighlights.splice(index, 1);
    setHighlights(newHighlights);
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);

      // Validate that a main image is selected
      if (!isEditing && !mainImage) {
        toast({
          title: "Error",
          description: "Please select a main image for the product",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Create FormData to handle file uploads
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(data).forEach((key) => {
        if (key !== 'highlights' && key !== 'mainImage' && key !== 'additionalImages') {
          // @ts-ignore
          formData.append(key, data[key]);
        }
      });
      
      // Add highlights array (filter out empty values)
      const filteredHighlights = highlights.filter(h => h.trim() !== "");
      formData.append('highlights', JSON.stringify(filteredHighlights));
      
      // Add images
      if (mainImage) {
        formData.append('mainImage', mainImage);
      }
      
      if (additionalImages.length > 0) {
        additionalImages.forEach((image) => {
          formData.append('additionalImages', image);
        });
      }

      // Handle the "none" value for badge
      if (data.badge === "none") {
        formData.set('badge', '');
      }

      // Determine if we're creating or updating
      const url = isEditing && initialData?._id 
        ? `/api/products/${initialData._id}` 
        : "/api/products";
      
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Product ${isEditing ? "updated" : "created"} successfully`,
        });
        
        // Redirect back to products list
        router.push("/admin");
        router.refresh();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Error submitting product form:", error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "create"} product`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />          <FormField
            control={form.control}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sale Price (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? null : Number(value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Leave empty if there's no sale price
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Main Image</FormLabel>
            <FormControl>
              <div className="flex flex-col gap-2">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="cursor-pointer"
                />
                {mainImagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-1">Preview:</p>
                    <img 
                      src={mainImagePreview} 
                      alt="Main image preview" 
                      className="h-32 object-contain border rounded-md" 
                    />
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Additional Images (Optional)</FormLabel>
            <FormControl>
              <div className="flex flex-col gap-2">
                <Input 
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesChange}
                  className="cursor-pointer"
                />
                {additionalImagePreviews.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-1">Previews:</p>
                    <div className="flex flex-wrap gap-2">
                      {additionalImagePreviews.map((preview, index) => (
                        <img 
                          key={index}
                          src={preview} 
                          alt={`Additional image ${index + 1}`} 
                          className="h-20 w-20 object-cover border rounded-md" 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription>
              You can select multiple images at once
            </FormDescription>
            <FormMessage />
          </FormItem>

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="badge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge (Optional)</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value || "none"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a badge" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Sale">Sale</SelectItem>
                    <SelectItem value="Bestseller">Bestseller</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Product description"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Featured Product</FormLabel>
                <FormDescription>
                  Display this product in featured sections of the website
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Product Highlights</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addHighlight}
            >
              Add Highlight
            </Button>
          </div>
          
          <div className="space-y-3">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={highlight}
                  onChange={(e) => updateHighlight(index, e.target.value)}
                  placeholder="Enter a product highlight"
                  className="flex-grow"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeHighlight(index)}
                  disabled={highlights.length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Add key selling points or features of your product
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-1">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
                {isEditing ? "Updating..." : "Creating..."}
              </span>
            ) : (
              <span>{isEditing ? "Update Product" : "Create Product"}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}