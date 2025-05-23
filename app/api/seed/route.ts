import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/scripts/seed';

export async function POST(req: NextRequest) {
  // Check if environment is development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const result = await seedDatabase();
    
    return NextResponse.json({
      message: 'Database seeded successfully',
      categoriesCount: result.categories.length,
      productsCount: result.products.length
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}