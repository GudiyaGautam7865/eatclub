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
    peopleCount: {
      type: Number,
      required: true,
    },
    eventDateTime: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    brandPreference: String,
    budgetPerHead: Number,
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
    isBulk: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('BulkOrder', bulkOrderSchema);
