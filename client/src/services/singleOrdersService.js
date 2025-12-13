// Single Orders Service - localStorage based
const SINGLE_ORDERS_KEY = 'EC_SINGLE_ORDERS';

/**
 * Get all single orders from localStorage
 */
function getAllSingleOrders() {
  try {
    const raw = localStorage.getItem(SINGLE_ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading single orders from localStorage:', error);
    return [];
  }
}

/**
 * Save single orders to localStorage
 */
function saveSingleOrders(orders) {
  try {
    localStorage.setItem(SINGLE_ORDERS_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving single orders to localStorage:', error);
  }
}

/**
 * Create a new single order and save it
 * @param {Object} orderData - Order data from checkout
 * @returns {Object} Created order with ID and timestamp
 */
export function createSingleOrder(orderData) {
  const orders = getAllSingleOrders();
  
  const newOrder = {
    id: 'order_' + Date.now(),
    items: orderData.items || [],
    totalAmount: orderData.totalAmount || 0,
    itemsCount: (orderData.items || []).reduce((sum, item) => sum + (item.qty || 1), 0),
    paymentMethod: orderData.paymentMethod || 'COD',
    deliveryAddress: orderData.deliveryAddress || '',
    date: orderData.date || new Date().toISOString(),
    status: orderData.status || 'Paid',
  };
  
  orders.push(newOrder);
  saveSingleOrders(orders);
  
  return newOrder;
}

/**
 * Get all single orders
 * @returns {Array} List of all single orders
 */
export function getSingleOrders() {
  return getAllSingleOrders();
}

/**
 * Clear all single orders (for testing/reset)
 */
export function clearSingleOrders() {
  try {
    localStorage.removeItem(SINGLE_ORDERS_KEY);
  } catch (error) {
    console.error('Error clearing single orders:', error);
  }
}

export default {
  createSingleOrder,
  getSingleOrders,
  clearSingleOrders,
};
