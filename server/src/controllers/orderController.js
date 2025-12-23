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

/**
 * Cancel an order with Zomato/Swiggy-style business logic
 * POST /api/orders/:orderId/cancel
 * @access Private
 */
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { cancelReason } = req.body;

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify the order belongs to the logged-in user
    const userId = req.user && (req.user.id || req.user._id);
    if (userId && order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to cancel this order',
      });
    }

    // Check if order is already cancelled
    if (order.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled',
      });
    }

    const currentTime = new Date();
    let canCancel = false;
    let refundPercentage = 0;
    let cancellationMessage = '';

    // Apply cancellation rules
    switch (order.status) {
      case 'PLACED':
        canCancel = true;
        refundPercentage = 100;
        break;

      case 'ACCEPTED':
        if (order.acceptedAt) {
          const diffMinutes = (currentTime - new Date(order.acceptedAt)) / 60000;
          if (diffMinutes <= 3) {
            canCancel = true;
            refundPercentage = 100;
          } else {
            canCancel = true;
            refundPercentage = 80;
          }
        } else {
          // If acceptedAt is not set, treat as recent acceptance
          canCancel = true;
          refundPercentage = 100;
        }
        break;

      case 'PREPARING':
        canCancel = true;
        refundPercentage = 50;
        break;

      case 'READY':
      case 'READY_FOR_PICKUP':
      case 'OUT_FOR_DELIVERY':
      case 'DELIVERED':
        canCancel = false;
        cancellationMessage = 'Order cannot be cancelled at this stage';
        break;

      default:
        canCancel = false;
        cancellationMessage = 'Order cannot be cancelled at this stage';
    }

    // If cancellation not allowed, return error
    if (!canCancel) {
      return res.status(400).json({
        success: false,
        message: cancellationMessage,
        currentStatus: order.status,
      });
    }

    // Calculate refund amount
    const isPaid = order.paymentStatus === 'PAID' || order.payment?.method === 'ONLINE';
    const refundAmount = isPaid ? Math.round((order.total * refundPercentage) / 100) : 0;

    // Update order with cancellation details
    order.status = 'CANCELLED';
    order.cancelledBy = 'USER';
    order.cancelledAt = currentTime;
    order.cancelReason = cancelReason || 'Cancelled by user';
    order.refundPercentage = refundPercentage;
    order.refundAmount = refundAmount;

    // Set refund status if payment was made
    if (isPaid && refundAmount > 0) {
      order.refundStatus = 'PENDING';
      // TODO: Integrate with payment gateway for actual refund processing
      // TODO: Send notification to admin/restaurant about refund
    }

    // Add to status history
    order.statusHistory.push({
      status: 'CANCELLED',
      deliveryStatus: null,
      note: `Cancelled by user. Refund: ${refundPercentage}% (₹${refundAmount})`,
      actorId: userId,
      actorRole: 'USER',
      timestamp: currentTime,
    });

    await order.save();

    // TODO: Emit real-time socket event for order cancellation
    // TODO: Send push notification to restaurant/delivery partner

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        orderId: order._id,
        status: order.status,
        refundPercentage,
        refundAmount,
        refundStatus: order.refundStatus,
      },
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message,
    });
  }
};

