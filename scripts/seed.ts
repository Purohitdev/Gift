import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import { categories, products } from '@/lib/data';

/**
 * Seed the database with initial data
 */
export async function seedDatabase() {
  try {
    // Connect to the database
    await connectDB();
    
    console.log('Seeding database...');
    
    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    
    console.log('Existing data cleared');
    
    // Insert categories
    const categoryDocuments = await Category.insertMany(categories);
    console.log(`${categoryDocuments.length} categories inserted`);
    
    // Insert products
    const productDocuments = await Product.insertMany(products);
    console.log(`${productDocuments.length} products inserted`);
    
    console.log('Database seeded successfully');
    
    return {
      categories: categoryDocuments,
      products: productDocuments
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Function to run the seeder from the command line
// This can be called with `npx ts-node scripts/seed.ts`
async function runSeeder() {
  try {
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  }
}

// Check if this file is being run directly
if (require.main === module) {
  runSeeder();
}