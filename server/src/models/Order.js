import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: String,
    required: false,
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
      enum: ['REQUESTED', 'REJECTED', 'ACCEPTED', 'PAYMENT_PENDING', 'PAID', 'SCHEDULED', 'ASSIGNED', 'PLACED', 'PREPARING', 'READY', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
      default: 'PLACED',
    },
    acceptedAt: {
      type: Date,
      default: null,
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
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', null],
      default: null,
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
    orderType: {
      type: String,
      enum: ['SINGLE', 'BULK'],
      default: 'SINGLE',
    },
    bulkDetails: {
      eventName: String,
      eventType: String,
      peopleCount: Number,
      scheduledDate: Date,
      scheduledTime: String,
      discount: Number,
      discountReason: String,
      subtotal: Number,
      additionalCharges: {
        packaging: { type: Number, default: 0 },
        delivery: { type: Number, default: 0 },
        service: { type: Number, default: 0 },
      },
      adminNotes: String,
      specialInstructions: String,
      assignedDeliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryBoy',
      },
      deliveryBoyName: String,
      deliveryBoyPhone: String,
    },
    isBulk: {
      type: Boolean,
      default: false,
    },
    // Cancellation fields
    cancelledBy: {
      type: String,
      enum: ['USER', 'ADMIN', 'RESTAURANT', null],
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancelReason: {
      type: String,
      default: null,
    },
    // Refund fields
    refundPercentage: {
      type: Number,
      default: 0,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundStatus: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', null],
      default: null,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['REQUESTED', 'REJECTED', 'ACCEPTED', 'PAYMENT_PENDING', 'PAID', 'SCHEDULED', 'ASSIGNED', 'PLACED', 'PREPARING', 'READY', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
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
