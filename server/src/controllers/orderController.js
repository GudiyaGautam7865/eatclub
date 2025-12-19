import Order from '../models/Order.js';

/**
 * Create a new order
 * POST /api/orders
 * @access Private (requires authentication)
 */
export const createOrder = async (req, res) => {
  try {
    const { items, total, payment, address, currentLocation, user: userFromBody, status: statusFromBody } = req.body;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order total',
      });
    }

    if (!address || !address.line1) {
      return res.status(400).json({
        success: false,
        message: 'Address is required',
      });
    }

    // Create order
    const status = statusFromBody || (payment?.method === 'ONLINE' ? 'PAID' : 'PLACED');

    const order = await Order.create({
      user: (req.user && (req.user.id || req.user._id)) || userFromBody,
      items,
      total,
      status,
      deliveryStatus: null,
      payment: payment || { method: 'COD' },
      address,
      isBulk: false,
      currentLocation: currentLocation ? {
        lat: Number(currentLocation.lat),
        lng: Number(currentLocation.lng),
      } : undefined,
      statusHistory: [
        {
          status,
          deliveryStatus: null,
          actorId: req.user ? (req.user.id || req.user._id) : undefined,
          actorRole: req.user ? req.user.role : 'USER',
          timestamp: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

/**
 * Get all orders for logged-in user
 * GET /api/orders/my
 * @access Private
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    const orders = await Order.find(userId ? { user: userId } : {})
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};
