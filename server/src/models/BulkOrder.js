import mongoose from 'mongoose';

const bulkOrderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    peopleCount: {
      type: Number,
      required: true,
    },
    eventDateTime: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    brandPreference: String,
    budgetPerHead: Number,
    notes: String,
    items: [{
      itemId: mongoose.Schema.Types.ObjectId,
      name: String,
      qty: Number,
      price: Number,
      notes: String,
    }],
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'PAYMENT_PENDING', 'PAID', 'PREPARING', 'DELIVERED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING',
    },
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,
    rejectionReason: String,
    customPricing: {
      totalAmount: Number,
      perHeadPrice: Number,
      discount: Number,
      notes: String,
    },
    payment: {
      method: {
        type: String,
        enum: ['COD', 'ONLINE', null],
        default: null,
      },
      txId: String,
      paidAt: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isBulk: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('BulkOrder', bulkOrderSchema);
