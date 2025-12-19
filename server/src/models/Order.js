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
      enum: ['PLACED', 'PAID', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
      default: 'PLACED',
    },
    deliveryStatus: {
      type: String,
      enum: ['ASSIGNED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', null],
      default: null,
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
    driverVehicleNumber: String,
    userLocation: {
      lat: { type: Number },
      lng: { type: Number },
      address: String,
    },
    currentLocation: {
      lat: Number,
      lng: Number,
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    isBulk: {
      type: Boolean,
      default: false,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['PLACED', 'PAID', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
        },
        deliveryStatus: {
          type: String,
          enum: ['ASSIGNED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', null],
          default: null,
        },
        note: String,
        actorId: { type: mongoose.Schema.Types.Mixed }, // Mixed type to allow both ObjectId and string (for admin)
        actorRole: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
