import User from '../models/User.js';
import { generateAccessToken } from '../utils/generateToken.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import { generateOTP, generateToken } from '../utils/otpGenerator.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // Validate password minimum length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const emailToken = generateToken();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    console.log('📝 Creating user with:', { name, email, phoneNumber });

    const user = await User.create({
      name,
      email,
      phoneNumber: phoneNumber || undefined,
      password,
      role: 'USER',
      emailVerificationToken: emailToken,
      emailVerificationExpires: tokenExpires,
    });

    console.log('✓ User created successfully:', user._id);

    // Try to send verification email, but don't fail registration if it fails
    try {
      await sendVerificationEmail(email, emailToken);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      console.warn('⚠️  User created but verification email could not be sent. Check EMAIL_USER and EMAIL_PASS in .env');
      // Continue with registration even if email fails
    }

    const authToken = generateAccessToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        token: authToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors)
        .map(e => e.message)
        .join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages}`,
      });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Normalize email: lowercase and trim
    const normalizedEmail = email.toLowerCase().trim();

    // Check User in Users collection (USER, DELIVERY_BOY, or ADMIN roles)
    let user = await User.findOne({ email: normalizedEmail }).select('+password');
    
    if (user) {
      // User found - verify password
      if (!(await user.matchPassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // For regular users, check if email is verified
      if (user.role === 'USER' && !user.isEmailVerified) {
        return res.status(401).json({
          success: false,
          message: 'Please verify your email before logging in',
        });
      }

      // Check if account is active (applies to all roles)
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Your account is inactive. Please contact admin.',
        });
      }

      // Generate token with role
      const token = generateAccessToken(user._id, user.role);

      // Build response based on role
      const responseData = {
        token,
        role: user.role,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };

      // Add role-specific data
      if (user.role === 'USER') {
        responseData.user.phoneNumber = user.phoneNumber;
        responseData.user.isEmailVerified = user.isEmailVerified;
      } else if (user.role === 'DELIVERY_BOY') {
        responseData.user.phone = user.phone;
        responseData.user.vehicleType = user.vehicleType;
        responseData.user.deliveryStatus = user.deliveryStatus;
      }

      return res.json({
        success: true,
        data: responseData,
      });
    }

    // Special case: Hardcoded Admin (for backward compatibility)
    if (normalizedEmail === 'admin@gmail.com' && password === '1260') {
      const token = generateAccessToken('admin', 'ADMIN');

      return res.json({
        success: true,
        data: {
          token,
          role: 'ADMIN',
          user: {
            id: 'admin',
            email: 'admin@gmail.com',
            role: 'ADMIN',
          },
        },
      });
    }

    // No match found
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    const authToken = generateAccessToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Email verified successfully',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during email verification',
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.passwordResetToken = otp;
    user.passwordResetExpires = otpExpires;
    await user.save();

    await sendPasswordResetEmail(email, otp);

    res.json({
      success: true,
      message: 'Password reset OTP sent to your email',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request',
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required',
      });
    }

    const user = await User.findOne({
      email,
      passwordResetToken: otp,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during password reset',
    });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    const emailToken = generateToken();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.emailVerificationToken = emailToken;
    user.emailVerificationExpires = tokenExpires;
    await user.save();

    await sendVerificationEmail(email, emailToken);

    res.json({
      success: true,
      message: 'Verification email sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during resending verification email',
    });
  }
};