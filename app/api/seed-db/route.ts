import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import mongoose from 'mongoose';
import { categories, products } from '@/lib/data';

// This is a development-only endpoint to seed the database with initial data
export async function POST(req: NextRequest) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'This endpoint is only available in development mode' }, { status: 403 });
  }
  
  try {
    // Connect to MongoDB
    await clientPromise;
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }
    
    // Get Mongoose models
    const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
    
    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Convert the IDs to be MongoDB compatible
    const categoriesForDB = categories.map(category => ({
      ...category,
      // Keep other fields as they are
    }));
    
    const productsForDB = products.map(product => ({
      ...product,
      // Keep other fields as they are
    }));
    
    // Insert data
    const insertedCategories = await Category.insertMany(categoriesForDB);
    const insertedProducts = await Product.insertMany(productsForDB);
    
    return NextResponse.json({
      success: true,
      categoriesCount: insertedCategories.length,
      productsCount: insertedProducts.length,
      message: 'Database seeded successfully'
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}