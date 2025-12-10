import React, { useEffect, useState } from 'react';
import MenuItemForm from '../../../components/admin/forms/MenuItemForm';
import { adminMenuService } from '../../../services/adminMenuService';
import './AddMenuItemPage.css';

export default function AddMenuItemPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [adminToken, setAdminToken] = useState('');

  // Load any existing token so admins can paste one manually while backend auth is pending.
  useEffect(() => {
    const stored = localStorage.getItem('adminToken') || localStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzY1MzY2MTY0LCJleHAiOjE3NjU5NzA5NjR9.fxid39METf6O-OSVb-EiZP0ET22z6DuYa0q08pWeMuc';
    setAdminToken(stored);
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setMessage('');
    
    try {
      await adminMenuService.addMenuItem(formData);
      setMessage('Menu item added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding menu item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToken = () => {
    if (adminToken) {
      localStorage.setItem('adminToken', adminToken.trim());
      setMessage('Admin token saved locally for this session.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="add-menu-item-page">
      <div className="page-header">
        <h1>Add Menu Item</h1>
        <p>Create a new menu item for the restaurant</p>
      </div>

      <div className="token-box">
        <label htmlFor="admin-token">Admin Auth Token (paste manually)</label>
        <div className="token-input-row">
          <input
            id="admin-token"
            type="text"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="Paste admin JWT here while auth is not wired"
          />
          <button type="button" onClick={handleSaveToken}>
            Save Token
          </button>
        </div>
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