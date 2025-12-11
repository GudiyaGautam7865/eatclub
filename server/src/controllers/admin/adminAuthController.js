import { generateAccessToken } from '../../utils/generateToken.js';

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ADMIN LOGIN USING EMAIL
    if (email !== 'admin@gmail.com' || password !== '1260') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials',
      });
    }

    // GENERATE TOKEN
    const token = generateAccessToken('admin', 'ADMIN');

    return res.json({
      success: true,
      data: {
        token,
        admin: {
          id: 'admin',
          email: 'admin@gmail.com',
          role: 'ADMIN'
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during admin login',
    });
  }
};
