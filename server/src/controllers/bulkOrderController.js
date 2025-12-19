import BulkOrder from '../models/BulkOrder.js';

/**
 * Create a new bulk order
 * POST /api/bulk-orders
 * @access Public (optional auth)
 */
export const createBulkOrder = async (req, res) => {
  try {
    const { name, phone, email, peopleCount, eventDateTime, address, brandPreference, budgetPerHead, notes } = req.body;

    // Validation
    if (!name || !phone || !peopleCount || !eventDateTime || !address) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: name, phone, peopleCount, eventDateTime, address',
      });
    }

    // Create bulk order
    const bulkOrder = await BulkOrder.create({
      name,
      phone,
      email,
      peopleCount,
      eventDateTime,
      address,
      brandPreference,
      budgetPerHead,
      notes,
      status: 'PENDING',
      isBulk: true,
    });

    res.status(201).json({
      success: true,
      message: 'Bulk order submitted successfully',
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
 * Get user's bulk orders (optional feature)
 * GET /api/bulk-orders/my
 * @access Private
 */
export const getUserBulkOrders = async (req, res) => {
  try {
    // For now, fetch all bulk orders with the user's phone (if they provided it)
    // In a full implementation, you might link bulk orders to user accounts
    const bulkOrders = await BulkOrder.find()
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
