import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
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
    phoneNumber: {
      type: String,
      required: false,
      sparse: true,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[0-9]{10}$/.test(v);
        },
        message: 'Phone number must be 10 digits',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'DELIVERY_BOY'],
      default: 'USER',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Delivery boy specific fields
    phone: {
      type: String,
      required: function() {
        return this.role === 'DELIVERY_BOY';
      },
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
    deliveryStatus: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ON_DELIVERY', 'OFFLINE'],
      default: 'ACTIVE',
    },
    earnings: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
