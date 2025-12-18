import Category from '../models/Category.js';

// Map productId to brandId for querying MongoDB
const PRODUCT_BRAND_MAP = {
  'box8': '3',
  'behrouz': 'B1',
  'faasos': 'F1',
  'ovenstory': 'O1',
  'mandarin-oak': 'M1',
  'lunchbox': 'L1',
  'sweet-truth': 'S1',
  'the-good-bowl': 'G1',
  'wow-china': 'W1',
  'wow-momo': 'W2',
  'kettle-curry': 'K1',
  'biryani-blues': 'BB1',
};

export const getRestaurants = async (req, res) => {
  try {
    const restaurants = [
      { id: 'box8', name: 'BOX8' },
      { id: 'behrouz', name: 'Behrouz Biryani' },
      { id: 'faasos', name: 'Faasos' },
      { id: 'ovenstory', name: 'Oven Story Pizza' },
      { id: 'mandarin-oak', name: 'Mandarin Oak' },
      { id: 'lunchbox', name: 'LunchBox' },
      { id: 'sweet-truth', name: 'Sweet Truth' },
      { id: 'the-good-bowl', name: 'The Good Bowl' },
      { id: 'wow-china', name: 'Wow! China' },
      { id: 'wow-momo', name: 'Wow! Momo' },
      { id: 'fresh-menu', name: 'FreshMenu' },
      { id: 'firangi-bake', name: 'Firangi Bake' },
      { id: 'kettle-curry', name: 'Kettle & Curry' },
      { id: 'biryani-blues', name: 'Biryani Blues' },
    ];
    
    return res.status(200).json({
      success: true,
      data: restaurants,
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
  const productId = req.query.restaurant || req.params.restaurant;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'restaurant query parameter is required',
    });
  }

  try {
    // Get categories for this product from MongoDB
    const categories = await Category.find({ productId })
      .select('_id name sourceId imageUrl')
      .sort({ createdAt: 1 })
      .lean();

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No categories found for this restaurant',
      });
    }

    return res.status(200).json({
      success: true,
      data: categories.map((cat) => ({
        _id: cat._id,
        id: cat.sourceId,
        name: cat.name,
        imageUrl: cat.imageUrl,
      })),
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
