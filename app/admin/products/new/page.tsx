"use client";

import ProductForm from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className=" py-10   container">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        
        <div className="border rounded-lg p-6 bg-card">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}