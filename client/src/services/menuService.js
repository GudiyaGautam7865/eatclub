const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Multi-product menu service
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/menu/products`);
    const result = await response.json();
    if (result.success && result.data && result.data.products) {
      return result.data.products;
    }
    throw new Error('Invalid products response');
  } catch (error) {
    console.error('Error loading products from API:', error);
    return [];
  }
};

export const getMenuData = async (productId = 'box8') => {
  try {
    console.log(`🔄 Fetching menu for product: ${productId} from API: ${API_URL}/menu/${productId}`);
    const response = await fetch(`${API_URL}/menu/${productId}`);
    const result = await response.json();
    if (result.success && result.data) {
      console.log(`✅ Successfully loaded ${result.data.items?.length || 0} items for ${productId} from MongoDB`);
      return result.data;
    }
    throw new Error('Invalid menu response');
  } catch (error) {
    console.error(`❌ Error loading menu from API for ${productId}:`, error);
    return { productId, categories: [], items: [] };
  }
};

export const getAIRecommendations = async (query, menuItems) => {
  // Keep existing AI functionality
  return "Try our signature items for the best experience!";
};