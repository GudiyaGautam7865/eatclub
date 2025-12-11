import React, { useState } from 'react';
import './OrdersFilterBar.css';

export default function OrdersFilterBar({ onFilter }) {
  const [filters, setFilters] = useState({
    orderType: 'all',
    status: 'all',
    search: '',
    dateRange: 'all'
  });

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="orders-filter-bar">
      <div className="filter-group">
        <label>Order Type</label>
        <select value={filters.orderType} onChange={(e) => handleChange('orderType', e.target.value)}>
          <option value="all">All Orders</option>
          <option value="single">Single Orders</option>
          <option value="bulk">Bulk Orders</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Status</label>
        <select value={filters.status} onChange={(e) => handleChange('status', e.target.value)}>
          <option value="all">All Status</option>
          <option value="placed">Placed</option>
          <option value="preparing">Preparing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Date Range</label>
        <select value={filters.dateRange} onChange={(e) => handleChange('dateRange', e.target.value)}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="filter-group search-group">
        <label>Search</label>
        <input
          type="text"
          placeholder="Order ID, Customer, Phone..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>
    </div>
  );
}
