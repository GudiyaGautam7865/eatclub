import React, { useState } from 'react';
import MenuItemsTable from '../../../components/admin/tables/MenuItemsTable';
import './MenuItemsListPage.css';

export default function MenuItemsListPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  return (
    <div className="menu-items-list-container">
      {/* Header */}
      <div className="menu-items-list-header">
        <h1 className="menu-items-list-title">Menu Items List</h1>
        <div className="menu-items-list-actions">
          <button className="menu-items-list-btn primary">
            ➕ Add New Item
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="menu-items-list-filters">
        <div className="menu-items-list-filter-group">
          <label>Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="menu-items-list-filter-group">
          <label>Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="curries">Curries</option>
            <option value="rice">Rice</option>
            <option value="breads">Breads</option>
            <option value="desserts">Desserts</option>
          </select>
        </div>

        <div className="menu-items-list-filter-group">
          <label>Search:</label>
          <input type="text" placeholder="Search items..." />
        </div>
      </div>

      {/* Table */}
      <MenuItemsTable />
    </div>
  );
}
