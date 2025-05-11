import mongoose from 'mongoose';
import clientPromise from './mongodb';

export const connectDB = async () => {
  try {
    await clientPromise;
    // If already connected, return
    if (mongoose.connection.readyState === 1) {
      return;
    }
    // Otherwise, connect to the MongoDB URI from environment variables
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to database');
  }
};