import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import mongoose from 'mongoose';
import NodeCache from 'node-cache';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await clientPromise;
    // If already connected, return
    if (mongoose.connection.readyState === 1) {
      return;
    }
    // Otherwise, connect to the MongoDB URI from environment variables
    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Initialize cache with a default TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');
    const sale = searchParams.get('sale') === 'true';
    const sort = searchParams.get('sort') || 'featured';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Generate a cache key based on query parameters
    const cacheKey = `products-${category}-${search}-${minPrice}-${maxPrice}-${rating}-${sale}-${sort}-${page}-${limit}`;
    const cachedProducts = cache.get(cacheKey);
    if (cachedProducts) {
      return NextResponse.json(cachedProducts);
    }

    await connectDB();

    let query: any = {};
    if (category) query.category = { $in: category.split(',') };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    if (rating) query.rating = { $gte: parseInt(rating) };
    if (sale) query.salePrice = { $ne: null };

    let sortQuery = {};
    switch (sort) {
      case 'price-low':
        sortQuery = { price: 1 };
        break;
      case 'price-high':
        sortQuery = { price: -1 };
        break;
      case 'rating':
        sortQuery = { rating: -1 };
        break;
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      default:
        sortQuery = { featured: -1, rating: -1, reviewCount: -1 };
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query).sort(sortQuery).skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const response = {
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasMore: page < totalPages
      }
    };

    // Cache the response
    cache.set(cacheKey, response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Parse the request body
    const body = await req.json();

    // Create a new product
    const product = await Product.create(body);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}