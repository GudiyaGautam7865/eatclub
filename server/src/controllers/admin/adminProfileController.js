import User from '../../models/User.js';
import { sendAdminEmailVerification } from '../../utils/emailService.js';

// Generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Get admin profile
// @route   GET /api/admin/profile/me
// @access  Private/Admin
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select('-password');
    
    if (!admin || admin.role !== 'ADMIN') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    return res.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin profile',
    });
  }
};

// @desc    Update admin profile (name, phone, avatar)
// @route   PUT /api/admin/profile/me
// @access  Private/Admin
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, phoneNumber, avatar } = req.body;
    
    const admin = await User.findById(req.user.id);
    
    if (!admin || admin.role !== 'ADMIN') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Update allowed fields
    if (name) admin.name = name;
    if (phoneNumber !== undefined) admin.phoneNumber = phoneNumber;
    if (avatar !== undefined) admin.avatar = avatar;

    await admin.save();

    const updatedAdmin = await User.findById(admin._id).select('-password');

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedAdmin,
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};

// @desc    Request email change (send verification code)
// @route   POST /api/admin/profile/request-email-change
// @access  Private/Admin
export const requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({
        success: false,
        message: 'New email is required',
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: newEmail.toLowerCase() });
    if (existingUser && existingUser._id.toString() !== req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use',
      });
    }

    const admin = await User.findById(req.user.id).select('+emailChangeCode +emailChangeExpires');
    
    if (!admin || admin.role !== 'ADMIN') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Generate 6-digit code
    const code = generateVerificationCode();
    
    // Store pending email and code
    admin.pendingEmail = newEmail.toLowerCase();
    admin.emailChangeCode = code;
    admin.emailChangeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await admin.save();

    // Send email to admin verification email
    await sendAdminEmailVerification(code);

    return res.json({
      success: true,
      message: `Verification code sent to ${process.env.ADMIN_VERIFICATION_EMAIL || 'admin email'}`,
    });
  } catch (error) {
    console.error('Request email change error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to request email change',
    });
  }
};

// @desc    Confirm email change with code
// @route   POST /api/admin/profile/confirm-email-change
// @access  Private/Admin
export const confirmEmailChange = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is required',
      });
    }

    const admin = await User.findById(req.user.id).select('+emailChangeCode +emailChangeExpires +pendingEmail');
    
    if (!admin || admin.role !== 'ADMIN') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    if (!admin.emailChangeCode || !admin.pendingEmail) {
      return res.status(400).json({
        success: false,
        message: 'No pending email change request',
      });
    }

    if (admin.emailChangeExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired',
      });
    }

    if (admin.emailChangeCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    // Update email and clear pending fields
    admin.email = admin.pendingEmail;
    admin.pendingEmail = undefined;
    admin.emailChangeCode = undefined;
    admin.emailChangeExpires = undefined;

    await admin.save();

    const updatedAdmin = await User.findById(admin._id).select('-password');

    return res.json({
      success: true,
      message: 'Email updated successfully',
      data: updatedAdmin,
    });
  } catch (error) {
    console.error('Confirm email change error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to confirm email change',
    });
  }
};

// @desc    Change password
// @route   POST /api/admin/profile/change-password
// @access  Private/Admin
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const admin = await User.findById(req.user.id).select('+password');
    
    if (!admin || admin.role !== 'ADMIN') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Verify current password
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    return res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password',
    });
  }
};

// @desc    Upload and set admin avatar
// @route   POST /api/admin/profile/avatar
// @access  Private/Admin
export const uploadAdminAvatar = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: 'No avatar file uploaded' });
    }

    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== 'ADMIN') {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    admin.avatar = req.file.path;
    await admin.save();

    const updatedAdmin = await User.findById(admin._id).select('-password');

    return res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: updatedAdmin,
      url: req.file.path,
    });
  } catch (error) {
    console.error('Upload admin avatar error:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload avatar' });
  }
};
