// In-memory orders storage
let ordersStore = [];

/**
 * Get all orders
 */
export const getOrders = () => {
  return [...ordersStore];
};

/**
 * Add a single order to the store
 */
export const addOrder = (order) => {
  ordersStore.push(order);
  return order;
};

/**
 * Create an order from cart items
 * @param {Array} cartItems - Array of cart items
 * @param {Number} totalAmount - Total cart amount
 * @param {String} addressShort - Short address string
 * @returns {Object} Created order object
 */
export const createOrderFromCart = (cartItems, totalAmount, addressShort) => {
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cart items cannot be empty');
  }

  // Generate unique order ID
  const orderId = 'EC' + Date.now();

  // Get restaurant name from first item's section or default label
  const restaurantName = cartItems[0]?.section || 'EatClub Order';

  // Create item summary: "<count> items · <first item name>"
  const itemCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
  const firstItemName = cartItems[0]?.title || cartItems[0]?.name || 'Order';
  const itemSummary = `${itemCount} item${itemCount !== 1 ? 's' : ''} · ${firstItemName}`;

  // Create order object
  const order = {
    id: orderId,
    restaurantName,
    status: 'PLACED',
    totalAmount,
    itemSummary,
    placedAt: new Date().toISOString(),
    deliveredAt: null,
    addressShort: addressShort || 'Delivery Address',
  };

  // Add to store
  addOrder(order);

  return order;
};

/**
 * Clear all orders (for testing/reset purposes)
 */
export const clearOrders = () => {
  ordersStore = [];
};

export default {
  getOrders,
  addOrder,
  createOrderFromCart,
  clearOrders,
};
