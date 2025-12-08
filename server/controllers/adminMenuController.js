const fs = require('fs');
const path = require('path');

const MENU_DATA_PATH = path.join(__dirname, '../../client/public/data/menus');
const ADMIN_MENU_FILE = path.join(MENU_DATA_PATH, 'admin-menu-items.json');

// Ensure admin menu file exists
const ensureAdminMenuFile = () => {
  if (!fs.existsSync(ADMIN_MENU_FILE)) {
    fs.writeFileSync(ADMIN_MENU_FILE, JSON.stringify([], null, 2));
  }
};

const getMenuItems = (req, res) => {
  try {
    ensureAdminMenuFile();
    const data = fs.readFileSync(ADMIN_MENU_FILE, 'utf8');
    const menuItems = JSON.parse(data);
    res.json(menuItems);
  } catch (error) {
    console.error('Error reading menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
};

const addMenuItem = (req, res) => {
  try {
    ensureAdminMenuFile();
    const { name, description, category, brand, price, isVeg, status } = req.body;
    
    // Read existing items
    const data = fs.readFileSync(ADMIN_MENU_FILE, 'utf8');
    const menuItems = JSON.parse(data);
    
    // Create new item
    const newItem = {
      id: Date.now(),
      name,
      description,
      category,
      brand,
      price,
      isVeg,
      status
    };
    
    // Add to array
    menuItems.push(newItem);
    
    // Write back to file
    fs.writeFileSync(ADMIN_MENU_FILE, JSON.stringify(menuItems, null, 2));
    
    res.status(201).json({ message: 'Menu item added successfully', item: newItem });
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
};

module.exports = {
  getMenuItems,
  addMenuItem
};