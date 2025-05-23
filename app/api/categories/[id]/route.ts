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
    const categoryId = params.id;    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      // Attempt to find by custom 'id' field if not a valid ObjectId
      const categoryByCustomId = await Category.findOne({ id: categoryId });
      if (categoryByCustomId) {
        // Return category without binary data
        const categoryData = {
          _id: categoryByCustomId._id,
          id: categoryByCustomId.id,
          name: categoryByCustomId.name,
          link: categoryByCustomId.link,
          imageUrl: `/api/categories/${categoryByCustomId.id}/image`,
          createdAt: categoryByCustomId.createdAt,
          updatedAt: categoryByCustomId.updatedAt
        };
        return NextResponse.json(categoryData);
      }
      return NextResponse.json({ error: 'Invalid category ID format and no category found with custom ID' }, { status: 400 });
    }const category = await Category.findById(categoryId);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Return category without binary data
    const categoryData = {
      _id: category._id,
      id: category.id,
      name: category.name,
      link: category.link,
      imageUrl: `/api/categories/${category.id}/image`,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    };
    
    return NextResponse.json(categoryData);
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
    
    // Handle FormData instead of JSON
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const customId = formData.get("id") as string;
    const link = formData.get("link") as string;
    const imageFile = formData.get("image") as File | null;

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
    if (customId && Number(customId) !== category.id) {
      const existingCategoryByCustomId = await Category.findOne({ id: Number(customId) });
      if (existingCategoryByCustomId) {
        return NextResponse.json(
          { error: 'Another category with this custom ID already exists' },
          { status: 409 }
        );
      }
      category.id = Number(customId);
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

    // Handle image update - only update if new image is provided
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const contentType = imageFile.type;
      
      category.image = {
        data: buffer,
        contentType
      };
    }
    
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

    // Return a response without the binary data to keep the payload small
    return NextResponse.json({
      _id: updatedCategory._id,
      id: updatedCategory.id,
      name: updatedCategory.name,
      link: updatedCategory.link,
      imageUrl: `/api/categories/${updatedCategory.id}/image`,
    });
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
