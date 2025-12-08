import React, { useState, useEffect } from 'react';
import MenuItemsTable from '../../../components/admin/tables/MenuItemsTable';
import { adminMenuService } from '../../../services/adminMenuService';
import './MenuItemsListPage.css';

export default function MenuItemsListPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands] = useState(adminMenuService.getBrands());

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

  const loadCategories = async () => {
    try {
      const cats = await adminMenuService.getCategories(selectedBrand);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
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
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={!selectedBrand}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          
          <button onClick={loadMenuItems} className="refresh-btn">Refresh</button>
        </div>
      </div>

      <div className="table-container">
        <MenuItemsTable items={items} />
      </div>
    </div>
  );
}