import apiClient from './apiClient.js';

/**
 * Create an order from cart items
 * @param {Object} orderData - Order data with items, total, payment, address
 * @returns {Object} Created order object
 */
export const createOrderFromCart = async (orderData) => {
  try {
    const response = await apiClient('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response;
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};

/**
 * Get all orders for the logged-in user
 * @returns {Array} Array of user orders
 */
export const getMyOrders = async () => {
  try {
    const response = await apiClient('/orders/my', {
      method: 'GET',
    });
    return response.data || [];
  } catch (error) {
    console.error('Get my orders error:', error);
    throw error;
  }
};

/**
 * Legacy: Get all orders (in-memory - for backward compatibility)
 */
let ordersStore = [];

export const getOrders = () => {
  return [...ordersStore];
};

export const addOrder = (order) => {
  ordersStore.push(order);
  return order;
};

export const clearOrders = () => {
  ordersStore = [];
};

/**
 * Get tracking details for an order
 * @param {string} orderId
 */
export const getOrderTracking = async (orderId) => {
  try {
    const response = await apiClient(`/orders/${orderId}/tracking`, {
      method: 'GET',
    });
    return response.data || response;
  } catch (error) {
    console.error('Get order tracking error:', error);
    throw error;
  }
};

export default {
  createOrderFromCart,
  getMyOrders,
  getOrders,
  addOrder,
  clearOrders,
  getOrderTracking,
};
