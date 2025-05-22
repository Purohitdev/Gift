
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

// Initialize cache
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const categoryId = params.id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      // Attempt to find by custom 'id' field if not a valid ObjectId
      const categoryByCustomId = await Category.findOne({ id: categoryId });
      if (categoryByCustomId) {
        return NextResponse.json(categoryByCustomId);
      }
      return NextResponse.json({ error: 'Invalid category ID format and no category found with custom ID' }, { status: 400 });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
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
    const categoryId = params.id;
    const body = await req.json();
    const { name, image, link, id: customId } = body; // 'id' from body is the customId

    let category;

    if (mongoose.Types.ObjectId.isValid(categoryId)) {
      category = await Category.findById(categoryId);
    } else {
      // If categoryId is not a MongoDB ObjectId, assume it's the custom 'id'
      category = await Category.findOne({ id: categoryId });
    }

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check for uniqueness of customId and name if they are being changed
    if (customId && customId !== category.id) {
      const existingCategoryByCustomId = await Category.findOne({ id: customId });
      if (existingCategoryByCustomId) {
        return NextResponse.json(
          { error: 'Another category with this custom ID already exists' },
          { status: 409 }
        );
      }
      category.id = customId;
    }

    if (name && name !== category.name) {
      const existingCategoryByName = await Category.findOne({ name });
      if (existingCategoryByName && existingCategoryByName._id.toString() !== category._id.toString()) {
        return NextResponse.json(
          { error: 'Another category with this name already exists' },
          { status: 409 }
        );
      }
      category.name = name;
    }
    
    if (image) category.image = image;
    if (link) category.link = link;

    const updatedCategory = await category.save();

    // Invalidate cache
    cache.del('categories');
    if (mongoose.Types.ObjectId.isValid(categoryId)) {
        cache.del(`category_${categoryId}`);
    } else {
        cache.del(`category_${category._id.toString()}`); // also invalidate by ObjectId if found by custom id
        cache.del(`category_${categoryId}`); // and by custom id
    }


    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to update category' },
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
    const categoryId = params.id;
    let deletedCategory;

    if (mongoose.Types.ObjectId.isValid(categoryId)) {
      deletedCategory = await Category.findByIdAndDelete(categoryId);
    } else {
      // If categoryId is not a MongoDB ObjectId, assume it's the custom 'id'
      deletedCategory = await Category.findOneAndDelete({ id: categoryId });
    }

    if (!deletedCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Invalidate cache
    cache.del('categories');
    if (mongoose.Types.ObjectId.isValid(categoryId)) {
        cache.del(`category_${categoryId}`);
    } else {
        cache.del(`category_${deletedCategory._id.toString()}`); // also invalidate by ObjectId if found by custom id
        cache.del(`category_${categoryId}`); // and by custom id
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
