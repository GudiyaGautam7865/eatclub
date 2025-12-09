import express from 'express';
import { 
  registerUser, 
  loginUser, 
  verifyEmail, 
  forgotPassword, 
  resetPassword, 
  resendVerificationEmail 
} from '../controllers/authController.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/auth/verify-email', verifyEmail);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);
router.post('/auth/resend-verification', resendVerificationEmail);

// Test endpoint to manually verify email (remove in production)
router.post('/auth/test-verify', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.isEmailVerified = true;
    await user.save();
    res.json({ success: true, message: 'Email verified for testing' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Test endpoint to view all users (remove in production)
router.get('/auth/test-users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, emailVerificationToken: 0, passwordResetToken: 0 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

export default router;