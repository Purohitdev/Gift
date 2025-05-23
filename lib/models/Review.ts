import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  text: {
    type: String,
    required: true,
    maxlength: [500, 'Review cannot be more than 500 characters']
  },
  avatar: {
    type: String,
    default: "/placeholder.svg"
  },
  approved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Compound index to ensure a user can only review a product once
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);