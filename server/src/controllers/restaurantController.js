import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Map restaurant ids to their corresponding menu JSON files
const MENU_FILE_MAP = {
  box8: { name: 'BOX8', file: 'box8-menu.json' },
  faasos: { name: 'Faasos', file: 'faasos-menu.json' },
  behrouz: { name: 'Behrouz Biryani', file: 'behrouz-menu.json' },
  ovenstory: { name: 'Ovenstory', file: 'ovenstory-menu.json' },
  'mandarin-oak': { name: 'Mandarin Oak', file: 'mandarin-oak-menu.json' },
  lunchbox: { name: 'LunchBox', file: 'lunchbox-menu.json' },
  'sweet-truth': { name: 'Sweet Truth', file: 'sweet-truth-menu.json' },
  'firangi-bake': { name: 'Firangi Bake', file: 'firangi-bake-menu.json' },
  'the-good-bowl': { name: 'The Good Bowl', file: 'the-good-bowl-menu.json' },
  'kettle-curry': { name: 'Kettle & Curry', file: 'kettle-curry-menu.json' },
  'wow-momo': { name: 'Wow! Momo', file: 'wow-momo-menu.json' },
  'wow-china': { name: 'Wow! China', file: 'wow-china-menu.json' },
  'biryani-blues': { name: 'Biryani Blues', file: 'biryani-blues-menu.json' },
  'fresh-menu': { name: 'Fresh Menu', file: 'fresh-menu-menu.json' },
};

const DATA_BASE_PATH = path.resolve(__dirname, '../../../client/public/data');
const MENUS_BASE_PATH = path.join(DATA_BASE_PATH, 'menus');
const PRODUCTS_PATH = path.join(DATA_BASE_PATH, 'products.json');

let cachedRestaurants = null;

// Build restaurant list from products.json when available, otherwise from MENU_FILE_MAP keys
const loadRestaurants = async () => {
  if (cachedRestaurants) {
    return cachedRestaurants;
  }

  try {
    const raw = await fs.readFile(PRODUCTS_PATH, 'utf-8');
    const { products = [] } = JSON.parse(raw);

    cachedRestaurants = products
      .filter((product) => MENU_FILE_MAP[product.id])
      .map((product) => ({
        id: product.id,
        name: product.name,
        file: MENU_FILE_MAP[product.id].file,
      }));
  } catch (error) {
    console.warn('Could not read products.json, falling back to default menu map');
    cachedRestaurants = Object.entries(MENU_FILE_MAP).map(([id, value]) => ({
      id,
      name: value.name,
      file: value.file,
    }));
  }

  return cachedRestaurants;
};

export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await loadRestaurants();
    return res.status(200).json({
      success: true,
      data: restaurants.map((rest) => ({ _id: rest.id, name: rest.name })),
    });
  } catch (error) {
    console.error('Error loading restaurants:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load restaurants',
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  const restaurantId = req.query.restaurant || req.params.restaurantId;

  if (!restaurantId) {
    return res.status(400).json({
      success: false,
      message: 'restaurant query parameter is required',
    });
  }

  try {
    const restaurants = await loadRestaurants();
    const restaurant = restaurants.find((rest) => rest.id === restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    const menuPath = path.join(MENUS_BASE_PATH, restaurant.file);
    const raw = await fs.readFile(menuPath, 'utf-8');
    const menuData = JSON.parse(raw);

    const categories = (menuData.categories || []).map((cat) => ({
      _id: cat.id || cat._id || cat.slug,
      name: cat.name,
    }));

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error loading categories:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load categories',
      error: error.message,
    });
  }
};
