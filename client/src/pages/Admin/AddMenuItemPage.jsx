import React, { useState } from 'react';
import MenuItemForm from '../../components/admin/forms/MenuItemForm';
import { adminMenuService } from '../../services/adminMenuService';
import './AddMenuItemPage.css';

export default function AddMenuItemPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (itemData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await adminMenuService.addMenuItem(itemData);
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error adding menu item:', err);
      
      // Extract error message from response
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).map(e => e.message).join(', ');
        setError(errorMessages);
      } else {
        setError('Failed to add menu item. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-menu-item-page">
      <div className="page-header">
        <h1>Add New Menu Item</h1>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✓</span>
          Menu item added successfully!
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Adding menu item...</p>
        </div>
      )}

      <div className="form-container">
        <MenuItemForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
