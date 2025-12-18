import React, { useState, useEffect, useCallback } from 'react';
import MenuItemsTable from '../../../components/admin/tables/MenuItemsTable';
import { adminMenuService } from '../../../services/adminMenuService';
import EditMenuItemModal from "../../../components/admin/forms/EditMenuItemForm";
import './MenuItemsListPage.css';



export default function MenuItemsListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

const getCategories = useCallback(async (brandId) => {
  return await adminMenuService.getCategories(brandId);
}, []);
const openEditModal = (item) => {
  setEditItem(item);
  setIsEditOpen(true);
};

const handleEditClose = async (shouldSave, payload, id) => {
  // payload = normalized fields from modal, id = item._id
  if (shouldSave) {
    try {
      // call backend
      await adminMenuService.updateMenuItem(id, payload);

      // update UI locally
      setItems(prev => prev.map(it => it._id === id ? { ...it, ...payload } : it));

      // success feedback (optional)
      // toast or alert
    } catch (err) {
      console.error('Update failed', err);
      alert('Update failed');
    }
  }
  setIsEditOpen(false);
  setEditItem(null);
};

const closeEditModal = () => {
  setIsEditOpen(false);
};

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    loadMenuItems();
  }, [selectedBrand, selectedCategory]);

  useEffect(() => {
    if (selectedBrand) {
      loadCategories();
    } else {
      setCategories([]);
      setSelectedCategory('');
    }
  }, [selectedBrand]);

  const loadBrands = async () => {
    try {
      const restaurants = await adminMenuService.getRestaurants();
      setBrands(restaurants);
    } catch (error) {
      console.error('Error loading brands:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await adminMenuService.getCategories(selectedBrand);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

 const handleDelete = async (itemId) => {
  if (!window.confirm("Are you sure you want to delete this item?")) {
    return;
  }

  try {
    await adminMenuService.deleteMenuItem(itemId);

    // Update UI instantly:
    setItems(prev => prev.filter(item => {
      const id = item._id ?? item.id ?? item.itemId;
      return id !== itemId;
    }));

    alert("Item deleted successfully!");
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete item");
  }
};
  const handleUpdate = async () => {
  try {
    await adminMenuService.updateMenuItem(editItem._id, editItem);

    setItems(prev =>
      prev.map(i => (i._id === editItem._id ? editItem : i))
    );

    closeEditModal();
    alert("Item updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to update");
  }
};


  const loadMenuItems = async () => {
    try {
      setLoading(true);
      let data;
      
      if (selectedBrand && selectedCategory) {
        const menuData = await adminMenuService.loadMenu(selectedBrand, selectedCategory);
        data = menuData.items.map(item => ({ ...item, brand: selectedBrand }));
      } else if (selectedBrand) {
        const menuData = await adminMenuService.loadMenu(selectedBrand);
        data = menuData.items.map(item => ({ ...item, brand: selectedBrand }));
      } else {
        data = await adminMenuService.getAllMenuItems();
      }
      
      setItems(data);
      setError('');
    } catch (err) {
      setError('Failed to load menu items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading menu items...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={loadMenuItems}>Retry</button>
      </div>
    );
  }

  return (
    <div className="menu-items-list-page">
      <div className="page-header">
        <h1>Menu Items</h1>
        <p>Manage all menu items ({items.length} total)</p>
        
        <div className="filters">
          <select 
            value={selectedBrand} 
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
          
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={!selectedBrand}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          
          <button onClick={loadMenuItems} className="refresh-btn">Refresh</button>
        </div>
      </div>

      <div className="table-container">
        <MenuItemsTable items={items} onDelete={handleDelete} onEdit={openEditModal}  />
        <EditMenuItemModal
  isOpen={isEditOpen}
  item={editItem}
  onClose={handleEditClose}
  brands={brands}
  getCategories={getCategories}
/>
      </div>
    </div>
  );
}

