'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, RefreshCw } from 'lucide-react';
import CategoryForm from './category-form'; // Assuming CategoryForm is in the same directory
import { toast } from '@/hooks/use-toast';

interface Category {
  _id: string;
  id: number;
  name: string;
  image: string;
  link: string;
  createdAt?: string;
  updatedAt?: string;
}

const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = async (categoryId: number, categoryMongoId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/categories/${categoryId}`, { // Use custom ID for deletion endpoint
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }
      toast({ title: 'Success', description: 'Category deleted successfully' });
      setCategories((prev) => prev.filter((cat) => cat._id !== categoryMongoId));
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleFormSave = () => {
    setIsFormOpen(false);
    fetchCategories(); // Refresh the list after save
  };

  if (isLoading) return <div className="flex justify-center items-center h-40"><RefreshCw className="h-6 w-6 animate-spin" /> Loading categories...</div>;
  if (error) return <div className="text-red-500 p-4 border border-red-500 bg-red-50 rounded-md">Error: {error} <Button onClick={fetchCategories} variant="outline" size="sm" className="ml-2">Retry</Button></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manage Categories</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddCategory}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            </DialogHeader>
            <CategoryForm 
              category={editingCategory}
              onSave={handleFormSave} 
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-10 border rounded-md bg-gray-50">
          <p className="text-muted-foreground">No categories found.</p>
          <p className="text-sm text-muted-foreground mt-1">Start by adding a new category.</p>
        </div>
      ) : (
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Image Preview</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((category) => (
                <TableRow key={category._id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                    {category.image && (
                        <img src={category.image} alt={category.name} className="h-10 w-10 object-cover rounded-sm" />
                    )}
                    </TableCell>
                    <TableCell><a href={category.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{category.link}</a></TableCell>
                    <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)} className="mr-2">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id, category._id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
