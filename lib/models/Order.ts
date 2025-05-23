import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  salePrice: {
    type: Number
  },
  image: {
    type: String,
    required: true
  },
  options: {
    type: String
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: { // Added email to shippingAddress
      type: String,
      required: true
    },
    whatsappNumber: { // Added whatsappNumber to shippingAddress
      type: String,
      required: true
    },
    landmark: {
      type: String,
    }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['online', 'cod']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  subtotal: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  deliveryNotes: {
    type: String
  },
  deliveryPriority: {
    type: String,
    enum: ['standard', 'express', 'rush'],
    default: 'standard'
  },
  estimatedDelivery: {
    type: Date
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);