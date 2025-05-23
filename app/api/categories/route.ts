import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import clientPromise from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import NodeCache from "node-cache";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await clientPromise;
    if (mongoose.connection.readyState === 1) {
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

// Initialize cache with a default TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

// Helper function to generate a slug
const generateSlug = (name: string) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars (alphanumeric, underscore, hyphen)
    .replace(/--+/g, "-"); // Replace multiple - with single -
};

export async function GET(req: NextRequest) {
  try {
    // Check if categories are cached
    const cachedCategories = cache.get("categories");
    if (cachedCategories) {
      return NextResponse.json(cachedCategories);
    }    await connectDB();
    const categoriesFromDB = await Category.find({}).sort({ name: 1 });
    
    // Transform categories to exclude binary data
    const categories = categoriesFromDB.map(category => ({
      _id: category._id,
      id: category.id,
      name: category.name,
      link: category.link,
      imageUrl: `/api/categories/${category.id}/image`,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));    // Cache the categories
    cache.set("categories", categories);

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const id = formData.get("id") as string;
    const imageFile = formData.get("image") as File | null;

    if (!id || !name) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: id or name",
          toastType: "error",
        },
        { status: 400 }
      );
    }

    if (!imageFile) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing image file",
          toastType: "error",
        },
        { status: 400 }
      );
    }

    const existingCategoryById = await Category.findOne({ id: Number(id) });
    if (existingCategoryById) {
      return NextResponse.json(
        {
          success: false,
          message: "Category with this ID already exists",
          toastType: "error",
        },
        { status: 409 }
      );
    }

    const existingCategoryByName = await Category.findOne({ name });
    if (existingCategoryByName) {
      return NextResponse.json(
        {
          success: false,
          message: "Category with this name already exists",
          toastType: "error",
        },
        { status: 409 }
      );
    }

    // Process image file
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const contentType = imageFile.type;
    
    const link = `/products?category=${generateSlug(name)}`;

    const newCategory = new Category({
      id: Number(id),
      name,
      image: {
        data: buffer,
        contentType
      },
      link,
    });
    await newCategory.save();

    cache.del("categories");

    // Return a response without the binary data to keep the payload small
    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: {
          _id: newCategory._id,
          id: newCategory.id,
          name: newCategory.name,
          link: newCategory.link,
        },
        toastType: "success",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating category:", error);

    let message = "Failed to create category";

    if (error.name === "ValidationError") {
      message = error.message;
    } else if (error instanceof SyntaxError) {
      message = `Invalid request data: ${error.message}`;
    }

    return NextResponse.json(
      {
        success: false,
        message,
        toastType: "error",
      },
      { status: 500 }
    );
  }
}

