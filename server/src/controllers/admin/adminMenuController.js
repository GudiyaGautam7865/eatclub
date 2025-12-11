import MenuItem from '../../models/MenuItem.js';

/**
 * Create a new menu item
 * POST /api/admin/menu/items
 * @access Private/Admin
 */
export const createMenuItem = async (req, res) => {
  try {
    const {
      brandId,
      brandName,
      categoryId,
      categoryName,
      name,
      description,
      price,
      membershipPrice,
      isVeg,
      imageUrl,
    } = req.body;

    // Validate required fields
    if (!brandId || !brandName || !categoryId || !categoryName || !name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: brandId, brandName, categoryId, categoryName, name, price',
      });
    }

    // Create menu item
    const menuItem = await MenuItem.create({
      brandId,
      brandName,
      categoryId,
      categoryName,
      name,
      description,
      price,
      membershipPrice,
      isVeg: isVeg !== undefined ? isVeg : true,
      imageUrl,
      isAvailable: true,
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created',
      data: menuItem,
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create menu item',
      error: error.message,
    });
  }
};

/**
 * Get all menu items (admin)
 * GET /api/admin/menu/items
 * @access Private/Admin
 */
export const getAdminMenuItems = async (req, res) => {
  try {
    const { brandId, categoryId, search } = req.query;

    // Build filter object
    const filter = {};
    if (brandId) {
      filter.brandId = brandId;
    }
    if (categoryId) {
      filter.categoryId = categoryId;
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // Find menu items with filters
    const items = await MenuItem.find(filter).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Get admin menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items',
      error: error.message,
    });
  }
};


export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await MenuItem.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted successfully" });

  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;           // mongo objectId
    const updates = req.body;            // expect updated fields in request body

    // Optional: whitelist fields you allow to update
    const allowed = ['name','description','price','membershipPrice','isVeg','imageUrl','isAvailable','brandId','categoryId','brandName','categoryName'];
    const filtered = {};
    Object.keys(updates).forEach(key => {
      if (allowed.includes(key)) filtered[key] = updates[key];
    });

    const updated = await MenuItem.findByIdAndUpdate(id, filtered, { new: true, runValidators: true });

    if (!updated) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    return res.json({ message: 'Menu item updated', item: updated });
  } catch (err) {
    console.error('Error updating menu item:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};