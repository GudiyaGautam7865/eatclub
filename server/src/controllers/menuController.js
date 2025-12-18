import MenuItem from '../models/MenuItem.js';
import Category from '../models/Category.js';

/**
 * Get menu items for a specific brand/product
 * GET /api/menu/:productId
 * @access Public
 */
export const getMenuByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Map productId to brandId (from PRODUCT_BRAND_MAP)
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
      'fresh-menu': 'FR1',
      'firangi-bake': 'FI1',
      'kettle-curry': 'K1',
      'biryani-blues': 'BB1',
    };

    const brandId = PRODUCT_BRAND_MAP[productId];
    
    if (!brandId) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Get categories for this product
    const categories = await Category.find({ productId }).select('sourceId name imageUrl').lean();

    // Get all menu items for this brand
    const items = await MenuItem.find({ 
      brandId,
      isAvailable: true 
    }).select('-__v').lean();

    // Format categories
    const formattedCategories = categories.map(cat => ({
      id: cat.sourceId,
      name: cat.name,
      imageUrl: cat.imageUrl
    }));

    // Format items
    const formattedItems = items.map(item => ({
      id: item.sourceId,
      name: item.name,
      description: item.description,
      price: item.price,
      membershipPrice: item.membershipPrice,
      imageUrl: item.imageUrl,
      isVeg: item.isVeg,
      categoryId: item.categorySourceId,
      isBestseller: item.isBestseller || false
    }));

    res.json({
      success: true,
      data: {
        productId,
        categories: formattedCategories,
        items: formattedItems
      }
    });

  } catch (error) {
    console.error('Get menu by product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu',
      error: error.message,
    });
  }
};

/**
 * Get all available products/brands
 * GET /api/menu/products
 * @access Public
 */
export const getProducts = async (req, res) => {
  try {
    const products = [
      { id: 'box8', name: 'BOX8', tagline: 'Desi Meals in a Box', image: 'https://res.cloudinary.com/ddjmao4ma/image/upload/v1766056701/eatclub/menu-items/zaylvozjxilguueigcz1.jpg' },
      { id: 'behrouz', name: 'Behrouz Biryani', tagline: 'Royal Biryanis', image: 'https://res.cloudinary.com/ddjmao4ma/image/upload/v1766056695/eatclub/menu-items/b7azlktdgt1g2wjxvjue.jpg' },
      { id: 'faasos', name: 'Faasos', tagline: 'Wraps & Rolls', image: 'https://res.cloudinary.com/ddjmao4ma/image/upload/v1766056709/eatclub/menu-items/b0aauk7ijqo14i4mourx.jpg' },
      { id: 'ovenstory', name: 'Oven Story Pizza', tagline: 'Baked to Perfection', image: 'https://res.cloudinary.com/ddjmao4ma/image/upload/v1766056738/eatclub/menu-items/sqyirspeh8yerv75fojr.jpg' },
      { id: 'mandarin-oak', name: 'Mandarin Oak', tagline: 'Asian Cuisine', image: 'https://res.cloudinary.com/ddjmao4ma/image/upload/v1766056730/eatclub/menu-items/dksdyrpz5zwtohdl6zot.jpg' },
      { id: 'lunchbox', name: 'LunchBox', tagline: 'Homestyle Meals', image: 'https://res.cloudinary.com/ddjmao4ma/image/upload/v1766056726/eatclub/menu-items/zccyv2mrabqbbplicjat.jpg' },
      { id: 'sweet-truth', name: 'Sweet Truth', tagline: 'Desserts & Cakes', image: 'https://res.cloudinary.com/ddjmao4ma/image/upload/v1766056739/eatclub/menu-items/uvnam6akqesobaygwbfo.jpg' },
      { id: 'the-good-bowl', name: 'The Good Bowl', tagline: 'Healthy Bowls', image: 'https://res.cloudinary.com/ddjmao4ma/image/upload/v1766056745/eatclub/menu-items/qjfvklsm9zs1rxymoobo.jpg' },
      { id: 'wow-china', name: 'Wow! China', tagline: 'Chinese Delights', image: 'https://res.cloudinary.com/ddjmao4ma/image/upload/v1766056748/eatclub/menu-items/oupzqppgric7hd4mdx3x.jpg' },
      { id: 'wow-momo', name: 'Wow! Momo', tagline: 'Momos & More', image: 'https://res.cloudinary.com/ddjmao4ma/image/upload/v1766056754/eatclub/menu-items/vydfd7afsofrbwbtayjj.jpg' },
      { id: 'fresh-menu', name: 'FreshMenu', tagline: 'Gourmet Meals', image: 'https://res.cloudinary.com/ddjmao4ma/image/upload/v1766056717/eatclub/menu-items/er86z1fepogxkf5dijao.jpg' },
      { id: 'firangi-bake', name: 'Firangi Bake', tagline: 'Baked Delights', image: 'https://res.cloudinary.com/ddjmao4ma/image/upload/v1766056713/eatclub/menu-items/xtznabyt8e0z2ivlq5oo.jpg' },
      { id: 'kettle-curry', name: 'Kettle & Curry', tagline: 'Indian Curries', image: 'https://res.cloudinary.com/ddjmao4ma/image/upload/v1766056723/eatclub/menu-items/rc6rcxapvqnnv8krvkin.jpg' },
      { id: 'biryani-blues', name: 'Biryani Blues', tagline: 'Authentic Biryanis', image: 'https://res.cloudinary.com/ddjmao4ma/image/upload/v1766056699/eatclub/menu-items/s8qqofc51befor8kkdnu.jpg' },
    ];

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

/**
 * Search menu items across all brands
 * GET /api/menu/search?q=chicken
 * @access Public
 */
export const searchMenuItems = async (req, res) => {
  try {
    const { q, productId } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const filter = {
      isAvailable: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    };

    // Filter by product if specified
    if (productId) {
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
        'fresh-menu': 'FR1',
        'firangi-bake': 'FI1',
        'kettle-curry': 'K1',
        'biryani-blues': 'BB1',
      };
      filter.brandId = PRODUCT_BRAND_MAP[productId];
    }

    const items = await MenuItem.find(filter)
      .limit(20)
      .select('sourceId brandId brandName categorySourceId name description price membershipPrice imageUrl isVeg')
      .lean();

    // Format items for response
    const formattedItems = items.map(item => ({
      id: item.sourceId,
      foodId: item.sourceId,
      name: item.name,
      description: item.description,
      price: item.price,
      membershipPrice: item.membershipPrice,
      imageUrl: item.imageUrl,
      isVeg: item.isVeg,
      brand: item.brandName,
      brandId: item.brandId,
      categoryId: item.categorySourceId
    }));

    res.json({
      success: true,
      data: formattedItems
    });

  } catch (error) {
    console.error('Search menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search menu items',
      error: error.message,
    });
  }
};

