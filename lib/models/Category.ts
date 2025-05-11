import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    unique: true
  },
  image: {
    type: String,
    required: [true, 'Please provide a category image']
  },
  link: {
    type: String,
    required: [true, 'Please provide a category link']
  }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);