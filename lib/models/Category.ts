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
    data: {
      type: Buffer,
      required: [true, 'Please provide a category image']
    },
    contentType: {
      type: String,
      required: [true, 'Please provide the image content type']
    }
  },
  link: {
    type: String,
    required: [true, 'Please provide a category link']
  }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);