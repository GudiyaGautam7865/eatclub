import React, { useState } from 'react';
import OrdersTable from '../../../components/admin/tables/OrdersTable';
import './SingleOrdersPage.css';

export default function SingleOrdersPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  return (
    <div className="single-orders-container">
      {/* Header */}
      <div className="single-orders-header">
        <h1 className="single-orders-title">Single Orders</h1>
      </div>

      {/* Stats */}
      <div className="single-orders-stats">
        <div className="single-orders-stat">
          <div className="single-orders-stat-label">Total Orders</div>
          <div className="single-orders-stat-value">1,245</div>
        </div>
        <div className="single-orders-stat">
          <div className="single-orders-stat-label">Pending</div>
          <div className="single-orders-stat-value">23</div>
        </div>
        <div className="single-orders-stat">
          <div className="single-orders-stat-label">Today's Orders</div>
          <div className="single-orders-stat-value">84</div>
        </div>
        <div className="single-orders-stat">
          <div className="single-orders-stat-label">Revenue (Today)</div>
          <div className="single-orders-stat-value">₹24.5K</div>
        </div>
      </div>

      {/* Filters */}
      <div className="single-orders-filters">
        <div className="single-orders-filter-group">
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

        <div className="single-orders-filter-group">
          <label>Date Range:</label>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="single-orders-filter-group">
          <label>Search:</label>
          <input type="text" placeholder="Search by order ID or customer..." />
        </div>
      </div>

      {/* Table */}
      <OrdersTable type="single" />
    </div>
  );
}
