import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['PLACED', 'PAID', 'PREPARING', 'DELIVERED', 'CANCELLED'],
      default: 'PLACED',
    },
    payment: {
      method: {
        type: String,
        enum: ['COD', 'ONLINE'],
        default: 'COD',
      },
      txId: String,
    },
    address: {
      line1: {
        type: String,
        required: true,
      },
      city: String,
      pincode: String,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    driverName: String,
    driverPhone: String,
    isBulk: {
      type: Boolean,
      default: false,
    },
    currentLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
