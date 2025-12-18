import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    sourceId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

// Unique index: one category per productId + sourceId
categorySchema.index({ productId: 1, sourceId: 1 }, { unique: true });

export default mongoose.model('Category', categorySchema);
