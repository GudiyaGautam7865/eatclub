import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Order from '../models/Order.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body || {};
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `ec_rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    return res.json({ success: true, order });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification params' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    const isValid = expected === razorpay_signature;
    
    if (!isValid) {
      return res.json({ success: false, message: 'Payment verification failed' });
    }

    // Create order after successful payment
    if (orderData) {
      const order = await Order.create({
        user: orderData.user, // Must be provided from authenticated request
        items: orderData.items.map(item => ({
          menuItemId: item.menuItemId || 'test_item',
          name: item.name,
          qty: item.qty || 1,
          price: item.price
        })),
        total: orderData.total,
        address: orderData.address,
        status: 'PAID',
        payment: {
          method: 'ONLINE',
          txId: razorpay_payment_id
        }
      });

      return res.json({ 
        success: true, 
        order: {
          _id: order._id,
          status: order.status
        }
      });
    }

    return res.json({ success: isValid });
  } catch (err) {
    console.error('Razorpay verification error:', err);
    return res.status(500).json({ success: false, message: 'Verification failed' });
  }
};

export default { createPaymentOrder, verifyPayment };
