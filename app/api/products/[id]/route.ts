import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import clientPromise from '@/lib/mongodb';
import Product from '@/lib/models/Product';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await clientPromise;
    if (mongoose.connection.readyState === 1) {
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const id = params.id;
    
    // Check if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const id = params.id;
    
    // Check if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }
    
    // Find the existing product to check if it exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Handle the FormData
    const formData = await req.formData();
    const data: Record<string, any> = {};
    
    // Process regular form fields
    for (const [key, value] of formData.entries()) {
      if (key !== 'mainImage' && key !== 'additionalImages' && key !== 'highlights') {
        data[key] = value;
      }
    }
    
    // Process highlights JSON
    const highlightsJson = formData.get('highlights');
    if (highlightsJson && typeof highlightsJson === 'string') {
      data.highlights = JSON.parse(highlightsJson);
    }
    
    // Process main image file only if provided
    const mainImage = formData.get('mainImage') as File | null;
    if (mainImage && mainImage.size > 0) {
      const bytes = await mainImage.arrayBuffer();
      data.img = Buffer.from(bytes);
      data.imgType = mainImage.type;
    }
    
    // Process additional images only if provided
    const additionalImageFiles = formData.getAll('additionalImages') as File[];
    if (additionalImageFiles.length > 0 && additionalImageFiles[0].size > 0) {
      data.images = await Promise.all(additionalImageFiles.map(async (file) => {
        const bytes = await file.arrayBuffer();
        return {
          data: Buffer.from(bytes),
          contentType: file.type
        };
      }));
    }

    // Add updated timestamp
    data.updatedAt = Date.now();
    
    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const id = params.id;
    
    // Check if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }
    
    // Find the product and delete it
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}