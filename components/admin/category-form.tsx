'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface Category {
  _id?: string; // MongoDB ID
  id: number; // Custom numeric ID
  name: string;
  image?: string | {
    data: Buffer;
    contentType: string;
  }; // Support both old string format and new binary format
  link: string; // Will be auto-generated
}

interface CategoryFormProps {
  category?: Category | null;
  onSave?: () => void;
  onCancel?: () => void;
}

const generateSlug = (name: string) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars (alphanumeric, underscore, hyphen)
    .replace(/--+/g, '-'); // Replace multiple - with single -
};

const CategoryForm: React.FC<CategoryFormProps> = ({ category: initialCategory, onSave, onCancel }) => {
  const [category, setCategory] = useState<Partial<Category>>(
    initialCategory || { id: undefined, name: '', image: '', link: '' }
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    } else {
      // For new categories, ensure link is empty or based on name if any
      setCategory(prev => ({ ...prev, link: prev.name ? `/products?category=${generateSlug(prev.name)}` : '' }));
    }
  }, [initialCategory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategory((prev) => {
      const updatedCategory = { ...prev, [name]: name === 'id' ? (value === '' ? undefined : Number(value)) : value };
      if (name === 'name') {
        updatedCategory.link = `/products?category=${generateSlug(value)}`;
      }
      return updatedCategory;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  if (!category.id || !category.name) {
    toast({
      title: 'Error',
      description: 'Please fill in all required fields (ID, Name). Image is also required for new categories.',
      variant: 'destructive',
    });
    setIsLoading(false);
    return;
  }

  if (!initialCategory?._id && !imageFile) {
    toast({
      title: 'Error',
      description: 'Please select an image for the new category.',
      variant: 'destructive',
    });
    setIsLoading(false);
    return;
  }

  const formData = new FormData();
  formData.append('id', String(category.id));
  formData.append('name', category.name || '');
  formData.append('link', category.link || `/products?category=${generateSlug(category.name || '')}`);

  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const method = initialCategory?._id ? 'PUT' : 'POST';
    const url = initialCategory?._id
      ? `/api/categories/${initialCategory.id}` // Use initialCategory.id for existing categories
      : '/api/categories';

    const response = await fetch(url, {
      method,
      body: formData,
    });

    if (!response.ok) {
      let errorTitle = 'Error';
      let errorMessage = `Failed to save category. Status: ${response.status}`;
      try {
        const errorData = await response.json();
        const serverMessage = errorData.message || errorData.error;
        if (serverMessage) {
          errorMessage = serverMessage;
          if (serverMessage.includes('Category with this ID already exists')) {
            errorTitle = 'Duplicate Category ID';
            errorMessage = 'A category with this ID already exists. Please choose a unique ID.';
          } else if (serverMessage.includes('Category with this name already exists')) {
            errorTitle = 'Duplicate Category Name';
            errorMessage = 'A category with this name already exists. Please choose a different name.';
          }
        }
      } catch {
        // Failed to parse JSON response or extract specific message, use default error message
      }
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      });
      setIsLoading(false);
      return; // Stop execution if there was an error
    }

    toast({
      title: 'Success',
      description: `Category ${initialCategory?._id ? 'updated' : 'created'} successfully.`,
    });

    if (onSave) {
      onSave();
    } else {
      router.push('/admin?tab=categories');
      router.refresh(); // Refresh data on the page
    }
  } catch (error: any) {
    console.error('Failed to save category:', error);
    // This catch block now primarily handles network errors or unexpected issues
    // API-specific errors like duplicates are handled above by checking response.ok
    toast({
      title: 'Error',
      description: error.message || 'An unexpected error occurred while saving the category.',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="id">Category ID (Unique Number)</Label>
        <Input
          id="id"
          name="id"
          type="number"
          value={category.id === undefined ? '' : category.id}
          onChange={handleChange}
          placeholder="e.g., 1, 2, 3..."
          required
          disabled={!!initialCategory?._id} // Disable if editing, as ID should not change
        />
        {!!initialCategory?._id && <p className="text-xs text-muted-foreground mt-1">ID cannot be changed after creation.</p>}
      </div>
      <div>
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          name="name"
          value={category.name || ''}
          onChange={handleChange}
          placeholder="e.g., Photo Frames"
          required
        />
      </div>
      <div>        <Label htmlFor="image">Category Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          onChange={handleImageChange}
          accept="image/*" 
        />
        {initialCategory?.image && !imageFile && (
          <p className="text-xs text-muted-foreground mt-1">
            Current image: <a href={`/api/categories/${initialCategory.id}/image`} target="_blank" rel="noopener noreferrer" className="underline">View Image</a>
            <img src={`/api/categories/${initialCategory.id}/image`} alt={initialCategory.name} className="mt-2 h-20 w-20 object-cover rounded-md border" />
          </p>
        )}
        {imageFile && (
            <p className="text-xs text-muted-foreground mt-1">Selected file: {imageFile.name}</p>
        )}
      </div>
      <div>
        <Label htmlFor="link">Link (Auto-generated)</Label>
        <Input
          id="link"
          name="link"
          value={category.link || ''}
          readOnly 
          className="bg-gray-100"
          placeholder="/products?category=your-category-name"
        />
         <p className="text-xs text-muted-foreground mt-1">This link is generated automatically from the category name.</p>
      </div>
      <div className="flex justify-end space-x-3">
        {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
            </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (initialCategory?._id ? 'Updating...' : 'Creating...') : (initialCategory?._id ? 'Update Category' : 'Create Category')}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
