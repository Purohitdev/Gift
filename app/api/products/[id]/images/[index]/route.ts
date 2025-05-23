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
  { params }: { params: { id: string, index: string } }
) {
  try {
    await connectDB();
    
    const { id, index } = params;
    const imageIndex = parseInt(index, 10);
    
    // Check if ID is a valid ObjectId and index is a valid number
    if (!mongoose.Types.ObjectId.isValid(id) || isNaN(imageIndex)) {
      return NextResponse.json(
        { error: 'Invalid product ID or image index' },
        { status: 400 }
      );
    }
    
    const product = await Product.findById(id);
    
    if (!product || !product.images || !product.images[imageIndex]) {
      return NextResponse.json(
        { error: 'Product additional image not found' },
        { status: 404 }
      );
    }
    
    const image = product.images[imageIndex];
    
    // Return the image with proper content type
    return new NextResponse(image.data, {
      headers: {
        'Content-Type': image.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error fetching product additional image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product additional image' },
      { status: 500 }
    );
  }
}
