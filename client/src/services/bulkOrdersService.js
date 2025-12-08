// Bulk Orders Service - localStorage based
const BULK_ORDERS_KEY = 'EC_BULK_ORDERS';

/**
 * Get all bulk orders from localStorage
 */
function getAllBulkOrders() {
  try {
    const raw = localStorage.getItem(BULK_ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading bulk orders from localStorage:', error);
    return [];
  }
}

/**
 * Save bulk orders to localStorage
 */
function saveBulkOrders(orders) {
  try {
    localStorage.setItem(BULK_ORDERS_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving bulk orders to localStorage:', error);
  }
}

/**
 * Create a new bulk order and save it
 * @param {Object} orderData - Order data from form
 * @returns {Object} Created order with ID and timestamp
 */
export function createBulkOrder(orderData) {
  const orders = getAllBulkOrders();
  
  const newOrder = {
    id: 'bulk_' + Date.now(),
    ...orderData,
    createdAt: new Date().toISOString(),
    status: 'pending', // Default status
  };
  
  orders.push(newOrder);
  saveBulkOrders(orders);
  
  return newOrder;
}

/**
 * Get all bulk orders
 * @returns {Array} List of all bulk orders
 */
export function getBulkOrders() {
  return getAllBulkOrders();
}

/**
 * Clear all bulk orders (for testing/reset)
 */
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
