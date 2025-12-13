import apiClient from './apiClient.js';

/**
 * Create a new bulk order and send to API
 * @param {Object} orderData - Order data from form
 * @returns {Object} Created order with ID and timestamp
 */
export async function createBulkOrder(orderData) {
  try {
    const response = await apiClient('/bulk-orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response.data;
  } catch (error) {
    console.error('Create bulk order error:', error);
    throw error;
  }
}

/**
 * Get all bulk orders (if needed)
 * @returns {Array} List of all bulk orders
 */
export async function getBulkOrders() {
  try {
    const response = await apiClient('/bulk-orders/my', {
      method: 'GET',
    });
    return response.data || [];
  } catch (error) {
    console.error('Get bulk orders error:', error);
    throw error;
  }
}

// Legacy localStorage-based functions (for backward compatibility)
const BULK_ORDERS_KEY = 'EC_BULK_ORDERS';

function getAllBulkOrdersLocal() {
  try {
    const raw = localStorage.getItem(BULK_ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading bulk orders from localStorage:', error);
    return [];
  }
}

export function clearBulkOrders() {
  try {
    localStorage.removeItem(BULK_ORDERS_KEY);
  } catch (error) {
    console.error('Error clearing bulk orders:', error);
  }
}

export default {
  createBulkOrder,
  getBulkOrders,
  clearBulkOrders,
};
