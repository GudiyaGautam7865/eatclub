import DeliveryBoy from '../models/DeliveryBoy.js';
import { sendDeliveryBoyCredentials } from '../utils/emailService.js';

// Admin: Create Delivery Boy
export const createDeliveryBoy = async (req, res) => {
  try {
    const { name, email, phone, vehicleType, vehicleNumber, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required',
      });
    }

    // Validate password
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if delivery boy already exists
    const existing = await DeliveryBoy.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Delivery boy with this email already exists',
      });
    }

    // Create delivery boy with admin-provided password
    const deliveryBoy = await DeliveryBoy.create({
      name,
      email,
      phone,
      vehicleType: vehicleType || 'BIKE',
      vehicleNumber: vehicleNumber || '',
      password: password,
      role: 'DELIVERY_BOY',
      status: 'ACTIVE',
    });

    // Send credentials via email
    try {
      await sendDeliveryBoyCredentials(email, password, name);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      console.warn('⚠️  Delivery boy created but email could not be sent. Manual credentials sharing required.');
    }

    res.status(201).json({
      success: true,
      message: 'Delivery boy created successfully. Credentials sent via email.',
      data: {
        deliveryBoy: {
          id: deliveryBoy._id,
          name: deliveryBoy.name,
          email: deliveryBoy.email,
          phone: deliveryBoy.phone,
          vehicleType: deliveryBoy.vehicleType,
          vehicleNumber: deliveryBoy.vehicleNumber,
          status: deliveryBoy.status,
          role: deliveryBoy.role,
        },
      },
    });
  } catch (error) {
    console.error('Create delivery boy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating delivery boy',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get all delivery boys (Admin)
export const getAllDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await DeliveryBoy.find({}).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: deliveryBoys,
    });
  } catch (error) {
    console.error('Get delivery boys error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching delivery boys',
    });
  }
};

// Get single delivery boy by ID (Admin)
export const getDeliveryBoyById = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryBoy = await DeliveryBoy.findById(id).select('-password');

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: 'Delivery boy not found',
      });
    }

    res.json({
      success: true,
      data: deliveryBoy,
    });
  } catch (error) {
    console.error('Get delivery boy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching delivery boy',
    });
  }
};

// Update delivery boy status (Admin)
export const updateDeliveryBoyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['ACTIVE', 'INACTIVE', 'ON_DELIVERY', 'OFFLINE'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const deliveryBoy = await DeliveryBoy.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password');

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: 'Delivery boy not found',
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: deliveryBoy,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating status',
    });
  }
};

// Delete delivery boy (Admin)
export const deleteDeliveryBoy = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryBoy = await DeliveryBoy.findByIdAndDelete(id);

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: 'Delivery boy not found',
      });
    }

    res.json({
      success: true,
      message: 'Delivery boy deleted successfully',
    });
  } catch (error) {
    console.error('Delete delivery boy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting delivery boy',
    });
  }
};
