import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

export default function AdminSidebar({ isCollapsed, onToggle }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/orders', icon: '📦', label: 'Orders' },
    { path: '/admin/messages', icon: '💬', label: 'Messages' },
    { path: '/admin/delivery-boys', icon: '🏍️', label: 'Delivery Boys' },
    { path: '/admin/customer-detail', icon: '👤', label: 'Customer Detail' },
    { path: '/admin/reviews', icon: '⭐', label: 'Reviews' }
  ];

  const menuItems = [
    { path: '/admin/menu/add', label: 'Add Menu Item' },
    { path: '/admin/menu/list', label: 'Menu List' },
    { path: '/admin/menu/1', label: 'Menu Detail' }
  ];

  const isMenuActive = location.pathname.startsWith('/admin/menu');

  return (
    <>
      {isMobileOpen && (
        <div 
          className="admin-sidebar-overlay" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <nav className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-icon">🍽️</div>
          {!isCollapsed && (
            <div className="admin-sidebar-logo-text">EatClub</div>
          )}
        </div>

        <ul className="admin-sidebar-nav">
          {navItems.map((item) => (
            <li key={item.path} className="admin-sidebar-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `admin-sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setIsMobileOpen(false)}
              >
                <span className="admin-sidebar-icon">{item.icon}</span>
                {!isCollapsed && (
                  <span className="admin-sidebar-label">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
          
          <li className="admin-sidebar-item">
            <div 
              className={`admin-sidebar-link dropdown-trigger ${isMenuActive ? 'active' : ''}`}
              onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
            >
              <span className="admin-sidebar-icon">🍽️</span>
              {!isCollapsed && (
                <>
                  <span className="admin-sidebar-label">Menu</span>
                  <span className={`dropdown-arrow ${menuDropdownOpen ? 'open' : ''}`}>▼</span>
                </>
              )}
            </div>
            {!isCollapsed && menuDropdownOpen && (
              <ul className="admin-sidebar-dropdown">
                {menuItems.map((item) => (
                  <li key={item.path} className="admin-sidebar-dropdown-item">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `admin-sidebar-dropdown-link ${isActive ? 'active' : ''}`
                      }
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        {!isCollapsed && (
          <div className="upgrade-card">
            <div className="upgrade-icon">⚡</div>
            <div className="upgrade-content">
              <h4>Upgrade Now</h4>
              <p>Get access to premium features</p>
            </div>
            <button className="upgrade-btn">Upgrade</button>
          </div>
        )}

        <button 
          className="admin-sidebar-toggle"
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="admin-sidebar-toggle-icon">
            {isCollapsed ? '→' : '←'}
          </span>
        </button>
      </nav>

      <button 
        className="admin-sidebar-mobile-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
    </>
  );
}