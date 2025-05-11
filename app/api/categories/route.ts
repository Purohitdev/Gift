import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import clientPromise from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import NodeCache from 'node-cache';

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

// Initialize cache with a default TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

export async function GET(req: NextRequest) {
  try {
    // Check if categories are cached
    const cachedCategories = cache.get('categories');
    if (cachedCategories) {
      return NextResponse.json(cachedCategories);
    }

    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 });

    // Cache the categories
    cache.set('categories', categories);

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    
    // Create a new category
    const category = await Category.create(body);
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}