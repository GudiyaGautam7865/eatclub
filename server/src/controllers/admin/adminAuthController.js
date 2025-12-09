import { generateAccessToken } from '../../utils/generateToken.js';

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== 'admin' || password !== '1260') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    const token = generateAccessToken('admin', 'ADMIN');

    res.json({
      success: true,
      token,
      admin: {
        username: 'admin',
        role: 'ADMIN',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during admin login',
    });
  }
};