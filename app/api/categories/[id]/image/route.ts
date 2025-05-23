import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import clientPromise from '@/lib/mongodb';
import Category from '@/lib/models/Category';

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
    const categoryId = params.id;
    
    let category;
    if (mongoose.Types.ObjectId.isValid(categoryId)) {
      category = await Category.findById(categoryId);
    } else {
      // Try to find by custom ID
      category = await Category.findOne({ id: Number(categoryId) });
    }
    
    if (!category || !category.image || !category.image.data) {
      return new Response('Image not found', { status: 404 });
    }
    
    // Return the image as a response with the correct content type
    return new Response(category.image.data, {
      headers: {
        'Content-Type': category.image.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error fetching category image:', error);
    return new Response('Error fetching image', { status: 500 });
  }
}
