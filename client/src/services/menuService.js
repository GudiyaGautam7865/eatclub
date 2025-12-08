// Multi-product menu service
export const getProducts = async () => {
  try {
    const response = await fetch('/data/products.json');
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

export const getMenuData = async (productId = 'box8') => {
  try {
    // Check localStorage first (for admin-added items)
    const storageKey = `EC_MENUS_${productId.toUpperCase().replace('-', '_')}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Load from JSON file
    const response = await fetch(`/data/menus/${productId}-menu.json`);
    const data = await response.json();
    
    // Store in localStorage for future admin updates
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error(`Error loading menu for ${productId}:`, error);
    // Fallback to box8 menu
    const fallbackResponse = await fetch('/data/menus/box8-menu.json');
    return await fallbackResponse.json();
  }
};

export const getAIRecommendations = async (query, menuItems) => {
  // Keep existing AI functionality
  return "Try our signature items for the best experience!";
};