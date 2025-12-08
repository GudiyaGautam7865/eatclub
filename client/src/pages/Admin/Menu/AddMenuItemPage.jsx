import React from 'react';
import MenuItemForm from '../../../components/admin/forms/MenuItemForm';
import './AddMenuItemPage.css';

export default function AddMenuItemPage() {
  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // TODO: Call API to create menu item
  };

  const handleCancel = () => {
    // TODO: Navigate back to menu list
    console.log('Form cancelled');
  };

  return (
    <div className="add-menu-item-container">
      <h1 className="add-menu-item-title">Add New Menu Item</h1>
      <p className="add-menu-item-subtitle">
        Create a new menu item and add it to your restaurant's offerings.
      </p>

      <div className="add-menu-item-form-wrapper">
        <MenuItemForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}
