import Order from '../models/Order.js';
import { ORDER_STATUS, ORDER_TYPE } from '../constants/orderStatus.js';

/**
 * Create a new bulk order request
 * POST /api/bulk-orders
 */
export const createBulkOrder = async (req, res) => {
  try {
    const {
      eventName,
      eventType,
      peopleCount,
      scheduledDate,
      scheduledTime,
      items,
      address,
      specialInstructions,
    } = req.body;

    // Validate required fields
    if (!eventName || !peopleCount || !scheduledDate || !address) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: eventName, peopleCount, scheduledDate, address',
      });
    }

    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required',
      });
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.name || !item.qty) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have name and qty',
        });
      }
      if (isNaN(item.qty)) {
        return res.status(400).json({
          success: false,
          message: 'Item qty must be a valid number',
        });
      }
      // Price is optional for REQUESTED status (admin will set it)
      if (item.price !== undefined && item.price !== null && isNaN(item.price)) {
        return res.status(400).json({
          success: false,
          message: 'Item price must be a valid number if provided',
        });
      }
    }

    // Validate address structure
    if (typeof address !== 'object' || !address.line1) {
      return res.status(400).json({
        success: false,
        message: 'Address must include line1',
      });
    }

    // Calculate subtotal safely (price may be 0 for REQUESTED orders)
    const subtotal = items.reduce((sum, item) => {
      const qty = parseFloat(item.qty) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + (price * qty);
    }, 0);

    const bulkOrder = await Order.create({
      user: req.user.id || req.user._id,
      orderType: ORDER_TYPE.BULK,
      items: items.map(item => ({
        menuItemId: '',
        name: item.name,
        qty: parseFloat(item.qty),
        price: parseFloat(item.price) || 0,  // Default to 0 if not provided
      })),
      total: subtotal,  // Will be 0 until admin sets pricing
      status: ORDER_STATUS.REQUESTED,
      address: {
        line1: address.line1,
        city: address.city || '',
        pincode: address.pincode || '',
      },
      isBulk: true,
      bulkDetails: {
        eventName,
        eventType: eventType || 'Party',
        peopleCount: parseInt(peopleCount),
        scheduledDate,
        scheduledTime: scheduledTime || '',
        subtotal,  // Will be 0 initially
        specialInstructions: specialInstructions || '',
      },
      statusHistory: [{
        status: ORDER_STATUS.REQUESTED,
        timestamp: new Date(),
        actorId: req.user.id || req.user._id,
        actorRole: 'USER',
      }],
    });

    res.status(201).json({
      success: true,
      message: 'Bulk order request submitted successfully',
      data: bulkOrder,
    });
  } catch (error) {
    console.error('Create bulk order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bulk order',
      error: error.message,
    });
  }
};

/**
 * Get user's bulk orders
 * GET /api/bulk-orders/my
 */
export const getUserBulkOrders = async (req, res) => {
  try {
    const bulkOrders = await Order.find({
      user: req.user.id || req.user._id,
      orderType: ORDER_TYPE.BULK,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: bulkOrders.length,
      data: bulkOrders,
    });
  } catch (error) {
    console.error('Get user bulk orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bulk orders',
      error: error.message,
    });
  }
};

/**
 * Get bulk order by ID
 * GET /api/bulk-orders/:id
 */
export const getBulkOrderById = async (req, res) => {
  try {
    const bulkOrder = await Order.findOne({
      _id: req.params.id,
      user: req.user.id || req.user._id,
      orderType: ORDER_TYPE.BULK,
    }).lean();

    if (!bulkOrder) {
      return res.status(404).json({
        success: false,
        message: 'Bulk order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bulkOrder,
    });
  } catch (error) {
    console.error('Get bulk order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bulk order',
      error: error.message,
    });
  }
};

/**
 * Cancel bulk order (user)
 * POST /api/bulk-orders/:id/cancel
 */
export const cancelBulkOrder = async (req, res) => {
  try {
    const { cancelReason } = req.body;
    const bulkOrder = await Order.findOne({
      _id: req.params.id,
      user: req.user.id || req.user._id,
      orderType: ORDER_TYPE.BULK,
    });

    if (!bulkOrder) {
      return res.status(404).json({
        success: false,
        message: 'Bulk order not found',
      });
    }

    if (![ORDER_STATUS.REQUESTED, ORDER_STATUS.ACCEPTED].includes(bulkOrder.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order at this stage',
      });
    }

    bulkOrder.status = ORDER_STATUS.CANCELLED;
    bulkOrder.cancelledBy = 'USER';
    bulkOrder.cancelledAt = new Date();
    bulkOrder.cancelReason = cancelReason;
    bulkOrder.statusHistory.push({
      status: ORDER_STATUS.CANCELLED,
      timestamp: new Date(),
      actorId: req.user.id || req.user._id,
      actorRole: 'USER',
      note: cancelReason,
    });

    await bulkOrder.save();

    res.status(200).json({
      success: true,
      message: 'Bulk order cancelled successfully',
      data: bulkOrder,
    });
  } catch (error) {
    console.error('Cancel bulk order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel bulk order',
      error: error.message,
    });
  }
};

/**
 * Proceed to payment for accepted bulk order
 * POST /api/bulk-orders/:id/payment
 */
export const proceedToPayment = async (req, res) => {
  try {
    const bulkOrder = await Order.findOne({
      _id: req.params.id,
      user: req.user.id || req.user._id,
      orderType: ORDER_TYPE.BULK,
    });

    if (!bulkOrder) {
      return res.status(404).json({
        success: false,
        message: 'Bulk order not found',
      });
    }

    if (bulkOrder.status !== ORDER_STATUS.ACCEPTED) {
      return res.status(400).json({
        success: false,
        message: 'Order must be accepted before payment',
      });
    }

    // Return order details for payment processing
    res.status(200).json({
      success: true,
      data: {
        orderId: bulkOrder._id,
        total: bulkOrder.total,
        items: bulkOrder.items,
        bulkDetails: bulkOrder.bulkDetails,
      },
    });
  } catch (error) {
    console.error('Proceed to payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment request',
      error: error.message,
    });
  }
};
