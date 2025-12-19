import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const deliveryBoySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleType: {
      type: String,
      enum: ['BIKE', 'SCOOTER', 'BICYCLE', 'CAR'],
      default: 'BIKE',
    },
    vehicleNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ON_DELIVERY', 'OFFLINE'],
      default: 'ACTIVE',
    },
    role: {
      type: String,
      default: 'DELIVERY_BOY',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    totalDeliveries: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
deliveryBoySchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check password
deliveryBoySchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const DeliveryBoy = mongoose.model('DeliveryBoy', deliveryBoySchema);

export default DeliveryBoy;
