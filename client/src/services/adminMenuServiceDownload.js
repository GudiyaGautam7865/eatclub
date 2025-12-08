// Admin Menu Service - Download updated JSON files
const BRAND_FILE_MAP = {
  'BOX8': 'box8-menu.json',
  'Behrouz': 'behrouz-menu.json',
  'Biryani Blues': 'biryani-blues-menu.json',
  'Faasos': 'faasos-menu.json',
  'Firangi Bake': 'firangi-bake-menu.json',
  'Fresh Menu': 'fresh-menu-menu.json',
  'Kettle Curry': 'kettle-curry-menu.json',
  'LunchBox': 'lunchbox-menu.json',
  'Mandarin Oak': 'mandarin-oak-menu.json',
  'Ovenstory': 'ovenstory-menu.json',
  'Sweet Truth': 'sweet-truth-menu.json',
  'The Good Bowl': 'the-good-bowl-menu.json',
  'Wow China': 'wow-china-menu.json',
  'Wow Momo': 'wow-momo-menu.json'
};

export const adminMenuService = {
  async loadMenu(brand, category = null) {
    const fileName = BRAND_FILE_MAP[brand];
    if (!fileName) return { items: [], categories: [] };
    
    try {
      const response = await fetch(`/data/menus/${fileName}`);
      if (!response.ok) return { items: [], categories: [] };
      const data = await response.json();
      
      return category ? { items: data.items.filter(item => item.categoryId === category), categories: data.categories } : data;
    } catch (error) {
      console.error('Error loading menu:', error);
      return { items: [], categories: [] };
    }
  },

  async addMenuItem(brand, category, itemData) {
    const fileName = BRAND_FILE_MAP[brand];
    if (!fileName) throw new Error('Brand not found');

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
      
      // Download updated JSON file
      const blob = new Blob([JSON.stringify(menuData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      
      return { message: 'Menu item added. Please replace the downloaded file in /public/data/menus/', item: newItem };
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  },

  async getAllMenuItems() {
    const allItems = [];
    
    for (const brand of Object.keys(BRAND_FILE_MAP)) {
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
    return Object.keys(BRAND_FILE_MAP);
  },

  async getCategories(brand) {
    const menuData = await this.loadMenu(brand);
    return menuData.categories || [];
  }
};