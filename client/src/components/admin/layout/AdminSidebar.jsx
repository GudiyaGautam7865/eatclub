import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

export default function AdminSidebar() {
  return (
    <nav className="admin-sidebar">
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <div className="admin-sidebar-logo-text">EatClub Admin</div>
      </div>

      {/* Dashboard Section */}
      <div className="admin-sidebar-section">
        <div className="admin-sidebar-section-title">Main</div>
        <ul className="admin-sidebar-nav">
          <li className="admin-sidebar-item">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="admin-sidebar-icon">📊</span>
              <span>Dashboard</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Menu Section */}
      <div className="admin-sidebar-section">
        <div className="admin-sidebar-section-title">Menu</div>
        <ul className="admin-sidebar-nav">
          <li className="admin-sidebar-item">
            <NavLink
              to="/admin/menu/add"
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="admin-sidebar-icon">➕</span>
              <span>Add New Item</span>
            </NavLink>
          </li>
          <li className="admin-sidebar-item">
            <NavLink
              to="/admin/menu/list"
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="admin-sidebar-icon">📋</span>
              <span>List Items</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Orders Section */}
      <div className="admin-sidebar-section">
        <div className="admin-sidebar-section-title">Orders</div>
        <ul className="admin-sidebar-nav">
          <li className="admin-sidebar-item">
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="admin-sidebar-icon">📦</span>
              <span>All Orders</span>
            </NavLink>
          </li>
          <li className="admin-sidebar-item">
            <NavLink
              to="/admin/orders/single"
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="admin-sidebar-icon">📦</span>
              <span>Single Orders</span>
            </NavLink>
          </li>
          <li className="admin-sidebar-item">
            <NavLink
              to="/admin/orders/bulk"
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="admin-sidebar-icon">📦📦</span>
              <span>Bulk Orders</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
