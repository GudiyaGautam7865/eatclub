import { verifyToken } from '../utils/generateToken.js';

// 🔴 DEVELOPMENT ONLY: Mock user bypass for testing
// TODO: Re-enable production auth before deployment
export const authMiddleware = (req, res, next) => {
  // TEMPORARY: Bypass authentication for local testing
  // Using valid MongoDB ObjectId format: 24 hex characters
  req.user = {
    id: '677777777777777777777777',
    name: 'Test User',
    role: 'USER',
  };
  return next();
};

// ORIGINAL PRODUCTION CODE (commented out for testing):
/*
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};
*/
