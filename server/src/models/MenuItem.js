import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    brandId: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    membershipPrice: {
      type: Number,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('MenuItem', menuItemSchema);
