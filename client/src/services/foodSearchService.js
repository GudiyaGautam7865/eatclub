const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let foodCache = null;

const getProducts = async () => {
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

const getMenuData = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/menu/${productId}`);
    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return null;
  } catch (error) {
    console.error(`Error loading menu for ${productId} from API:`, error);
    return null;
  }
};

const buildFoodCache = async () => {
  if (foodCache) {
    return foodCache;
  }

  const products = await getProducts();
  const allFoods = [];

  for (const product of products) {
    const menu = await getMenuData(product.id);
    if (menu && menu.items) {
      menu.items.forEach((item) => {
        allFoods.push({
          id: item.id,
          productId: product.id,
          productName: product.name,
          name: item.name,
          description: item.description || "",
          price: item.price,
          membershipPrice: item.membershipPrice,
          imageUrl: item.imageUrl,
          isVeg: item.isVeg || false,
          categoryId: item.categoryId,
          searchText: `${item.name} ${product.name} ${item.description || ""}`
            .toLowerCase()
        });
      });
    }
  }

  foodCache = allFoods;
  return allFoods;
};

export const searchFoods = async (query) => {
  const foods = await buildFoodCache();
  
  if (!query || query.trim().length === 0) {
    return [];
  }

  const queryLower = query.toLowerCase();
  
  const results = foods
    .filter((food) => food.searchText.includes(queryLower))
    .slice(0, 8);

  return results;
};

export const getFoodById = async (foodId, productId) => {
  const foods = await buildFoodCache();
  return foods.find((f) => f.id === foodId && f.productId === productId);
};

export const clearFoodCache = () => {
  foodCache = null;
};
