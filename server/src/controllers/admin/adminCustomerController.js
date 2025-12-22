import User from '../../models/User.js';
import Order from '../../models/Order.js';
import mongoose from 'mongoose';

// GET /api/admin/customers
export const listCustomers = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const skip = (page - 1) * limit;
    const search = (req.query.search || '').trim();
    const sortField = req.query.sortField || 'name';
    const sortDir = req.query.sortDir === 'desc' ? -1 : 1;

    const userMatch = { role: 'USER' };
    if (search) {
      userMatch.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(userMatch)
      .select('name email phoneNumber createdAt isActive')
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(limit)
      .lean();

    const userIds = users.map((u) => u._id);

    const aggregates = await Order.aggregate([
      { $match: { user: { $in: userIds }, isBulk: false } },
      {
        $group: {
          _id: '$user',
          totalOrders: { $sum: 1 },
          totalSpend: { $sum: '$total' },
          lastOrderDate: { $max: '$createdAt' },
        },
      },
    ]);

    const aggMap = new Map();
    aggregates.forEach((a) => {
      aggMap.set(String(a._id), a);
    });

    const data = users.map((u) => {
      const agg = aggMap.get(String(u._id));
      return {
        id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phoneNumber,
        status: u.isActive ? 'Active' : 'Inactive',
        totalOrders: agg?.totalOrders || 0,
        totalSpend: agg?.totalSpend || 0,
        lastOrderDate: agg?.lastOrderDate || null,
        joinedDate: u.createdAt,
      };
    });

    const totalUsers = await User.countDocuments(userMatch);

    res.json({
      success: true,
      data,
      page,
      limit,
      total: totalUsers,
    });
  } catch (err) {
    console.error('listCustomers error', err);
    res.status(500).json({ success: false, message: 'Failed to fetch customers', error: err.message });
  }
};

// GET /api/admin/customers/:customerId
export const getCustomerDetail = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ success: false, message: 'Invalid customer id' });
    }

    const user = await User.findById(customerId)
      .select('name email phoneNumber isActive createdAt')
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const orders = await Order.find({ user: customerId, isBulk: false })
      .select('total status createdAt address')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const totalOrders = orders.length;
    const totalSpend = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lastOrderDate = orders[0]?.createdAt || null;
    const avgOrderValue = totalOrders ? totalSpend / totalOrders : 0;

    const addresses = [];
    const seen = new Set();
    orders.forEach((o) => {
      if (o.address && o.address.line1) {
        const key = `${o.address.line1}|${o.address.city || ''}|${o.address.pincode || ''}`;
        if (!seen.has(key)) {
          seen.add(key);
          addresses.push({
            label: 'Address',
            line1: o.address.line1,
            city: o.address.city,
            pincode: o.address.pincode,
          });
        }
      }
    });

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phoneNumber,
        status: user.isActive ? 'Active' : 'Inactive',
        joinedDate: user.createdAt,
        stats: { totalOrders, totalSpend, avgOrderValue, lastOrderDate },
        orders,
        addresses,
      },
    });
  } catch (err) {
    console.error('getCustomerDetail error', err);
    res.status(500).json({ success: false, message: 'Failed to fetch customer', error: err.message });
  }
};
