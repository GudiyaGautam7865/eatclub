import React, { useState, useEffect } from 'react';
import OrdersTable from '../../../components/admin/tables/OrdersTable';
import { getBulkOrders } from '../../../services/bulkOrdersService';
import './BulkOrdersPage.css';

export default function BulkOrdersPage() {
  const [bulkOrders, setBulkOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSize, setFilterSize] = useState('all');

  // Load bulk orders from localStorage on component mount
  useEffect(() => {
    const orders = getBulkOrders();
    setBulkOrders(orders);
  }, []);

  // Filter orders based on status
  const filteredOrders = bulkOrders.filter((order) => {
    // Status filter
    if (filterStatus !== 'all' && order.status !== filterStatus) {
      return false;
    }

    // Size filter
    if (filterSize !== 'all') {
      const peopleCount = parseInt(order.peopleCount) || 0;
      if (filterSize === 'small' && peopleCount < 50) return true;
      if (filterSize === 'medium' && peopleCount >= 50 && peopleCount <= 100) return true;
      if (filterSize === 'large' && peopleCount > 100) return true;
      return false;
    }

    return true;
  });

  // Calculate statistics
  const totalOrders = bulkOrders.length;
  const pendingOrders = bulkOrders.filter((o) => o.status === 'pending').length;
  const totalRevenue = bulkOrders.reduce((sum, o) => sum + (o.budgetPerHead ? parseInt(o.budgetPerHead) * 50 : 0), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

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
          <div className="bulk-orders-stat-value">{totalOrders}</div>
        </div>
        <div className="bulk-orders-stat">
          <div className="bulk-orders-stat-label">Pending</div>
          <div className="bulk-orders-stat-value">{pendingOrders}</div>
        </div>
        <div className="bulk-orders-stat">
          <div className="bulk-orders-stat-label">Total Revenue</div>
          <div className="bulk-orders-stat-value">₹{totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bulk-orders-stat">
          <div className="bulk-orders-stat-label">Avg Order Value</div>
          <div className="bulk-orders-stat-value">₹{avgOrderValue.toLocaleString()}</div>
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
          <select value={filterSize} onChange={(e) => setFilterSize(e.target.value)}>
            <option value="all">All Sizes</option>
            <option value="small">Small (&lt; 50 people)</option>
            <option value="medium">Medium (50-100 people)</option>
            <option value="large">Large (&gt; 100 people)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <OrdersTable type="bulk" orders={filteredOrders} />

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="bulk-orders-empty">
          <p>No bulk orders found. Orders submitted through the Party Order page will appear here.</p>
        </div>
      )}
    </div>
  );
}

