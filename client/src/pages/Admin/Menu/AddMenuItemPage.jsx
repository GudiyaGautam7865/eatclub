import React, { useState } from 'react';
import MenuItemForm from '../../../components/admin/forms/MenuItemForm';
import { adminMenuService } from '../../../services/adminMenuService';
import './AddMenuItemPage.css';

export default function AddMenuItemPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setMessage('');
    
    try {
      await adminMenuService.addMenuItem(formData.brand, formData.categoryId, formData);
      setMessage('Menu item added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding menu item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-menu-item-page">
      <div className="page-header">
        <h1>Add Menu Item</h1>
        <p>Create a new menu item for the restaurant</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="form-container">
        <MenuItemForm onSubmit={handleSubmit} />
      </div>

      {loading && <div className="loading">Adding menu item...</div>}
    </div>
  );
}