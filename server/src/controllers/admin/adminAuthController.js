import { generateAccessToken } from '../../utils/generateToken.js';
import User from '../../models/User.js';

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find admin user
    const admin = await User.findOne({ email: email.toLowerCase(), role: 'ADMIN' }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    // Verify password
    const isMatch = await admin.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is deactivated',
      });
    }

    // Generate token
    const token = generateAccessToken(admin._id, admin.role);

    // Return admin data without password
    const adminData = await User.findById(admin._id).select('-password');

    return res.json({
      success: true,
      data: {
        token,
        admin: adminData,
      },
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during admin login',
    });
  }
};

