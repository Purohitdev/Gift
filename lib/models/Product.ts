import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price must be a positive number']
  },
  salePrice: {
    type: Number,
    default: null
  },
  img: {
    type: String,
    required: [true, 'Please provide a main product image']
  },
  images: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: [true, 'Please specify a product category'],
    lowercase: true
  },
  badge: {
    type: String,
    enum: ['Sale', 'New', 'Bestseller', null],
    default: null
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 10,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);