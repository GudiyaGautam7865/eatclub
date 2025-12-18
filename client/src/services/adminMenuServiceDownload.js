// Admin Menu Service - API-only (local JSON files removed)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Map display brand name -> productId used by the API
const BRAND_PRODUCT_MAP = {
  'BOX8': 'box8',
  'Behrouz': 'behrouz',
  'Biryani Blues': 'biryani-blues',
  'Faasos': 'faasos',
  'Firangi Bake': 'firangi-bake',
  'Fresh Menu': 'fresh-menu',
  'Kettle Curry': 'kettle-curry',
  'LunchBox': 'lunchbox',
  'Mandarin Oak': 'mandarin-oak',
  'Ovenstory': 'ovenstory',
  'Sweet Truth': 'sweet-truth',
  'The Good Bowl': 'the-good-bowl',
  'Wow China': 'wow-china',
  'Wow Momo': 'wow-momo'
};

export const adminMenuService = {
  async loadMenu(brand, category = null) {
    const productId = BRAND_PRODUCT_MAP[brand];
    if (!productId) return { items: [], categories: [] };
    try {
      const response = await fetch(`${API_URL}/menu/${productId}`);
      if (!response.ok) return { items: [], categories: [] };
      const result = await response.json();
      if (!result.success || !result.data) return { items: [], categories: [] };
      const data = result.data;
      const items = category ? data.items.filter(item => item.categoryId === category) : data.items;
      return { items: items || [], categories: data.categories || [] };
    } catch (error) {
      console.error('Error loading menu from API:', error);
      return { items: [], categories: [] };
    }
  },

  async addMenuItem(brand, category, itemData) {
    const productId = BRAND_PRODUCT_MAP[brand];
    if (!productId) throw new Error('Brand not found');

    // Note: No persistence here; this just produces a JSON export based on live API data.
    try {
      const menuData = await this.loadMenu(brand);
      const newItem = {
        id: `admin_${Date.now()}`,
        name: itemData.name,
        description: itemData.description,
        price: itemData.price,
        membershipPrice: Math.round(itemData.price * 0.7),
        imageUrl: itemData.imageUrl || 'https://assets.box8.co.in/rectangle-19x10/xhdpi/product/default',
        isVeg: itemData.isVeg,
        categoryId: category
      };
      menuData.items.push(newItem);

      // Download updated JSON snapshot for offline/manual use
      const fileName = `${productId}-menu.json`;
      const blob = new Blob([JSON.stringify(menuData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      
      return { message: 'Menu item added to exported snapshot (API is source of truth).', item: newItem };
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  },

  async getAllMenuItems() {
    const allItems = [];
    
    for (const brand of Object.keys(BRAND_PRODUCT_MAP)) {
      const menuData = await this.loadMenu(brand);
      if (menuData.items) {
        menuData.items.forEach(item => {
          allItems.push({
            ...item,
            brand: brand,
            category: item.categoryId
          });
        });
      }
    }
    
    return allItems;
  },

  getBrands() {
    return Object.keys(BRAND_PRODUCT_MAP);
  },

  async getCategories(brand) {
    const menuData = await this.loadMenu(brand);
    return menuData.categories || [];
  }
};