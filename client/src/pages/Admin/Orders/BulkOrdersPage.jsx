import React, { useState } from 'react';
import OrdersTable from '../../../components/admin/tables/OrdersTable';
import './BulkOrdersPage.css';

export default function BulkOrdersPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSize, setFilterSize] = useState('all');

  return (
    <div className="bulk-orders-container">
      {/* Header */}
      <div className="bulk-orders-header">
        <h1 className="bulk-orders-title">Bulk Orders</h1>
      </div>

      {/* Stats */}
      <div className="bulk-orders-stats">
        <div className="bulk-orders-stat">
          <div className="bulk-orders-stat-label">Total Bulk Orders</div>
          <div className="bulk-orders-stat-value">87</div>
        </div>
        <div className="bulk-orders-stat">
          <div className="bulk-orders-stat-label">Pending</div>
          <div className="bulk-orders-stat-value">12</div>
        </div>
        <div className="bulk-orders-stat">
          <div className="bulk-orders-stat-label">Total Revenue</div>
          <div className="bulk-orders-stat-value">₹8.5L</div>
        </div>
        <div className="bulk-orders-stat">
          <div className="bulk-orders-stat-label">Avg Order Value</div>
          <div className="bulk-orders-stat-value">₹97.7K</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bulk-orders-filters">
        <div className="bulk-orders-filter-group">
          <label>Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="bulk-orders-filter-group">
          <label>Order Size:</label>
          <select value={filterSize} onChange={(e) => setFilterSize(e.target.value)} >
            <option value="all">All Sizes</option>
            <option value="small">Small ( 50 items)</option>
            <option value="medium">Medium (50-100 items)</option>
            <option value="large">Large ( 100 items)</option>
          </select>
        </div>

        <div className="bulk-orders-filter-group">
          <label>Search:</label>
          <input type="text" placeholder="Search by order ID or company..." />
        </div>
      </div>

      {/* Table */}
      <OrdersTable type="bulk" />
    </div>
  );
}
