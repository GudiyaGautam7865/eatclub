import React, { useState, useEffect } from 'react';
import OrdersTable from '../../../components/admin/tables/OrdersTable';
import { getAdminSingleOrders } from '../../../services/adminOrdersService';
import './SingleOrdersPage.css';

export default function SingleOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  // Load orders from admin API
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAdminSingleOrders({ page, limit: pageSize });
        // data is an array of orders with limited fields; normalize for table
        const mapped = (Array.isArray(data) ? data : []).map(o => ({
          id: o._id || o.id,
          totalAmount: o.total ?? o.amount ?? 0,
          items: Array.isArray(o.items) ? o.items : [],
          itemsCount: Array.isArray(o.items) ? o.items.reduce((sum, i) => sum + (i.qty || i.quantity || 0), 0) : (o.itemsCount ?? 0),
          paymentMethod: (o.payment && o.payment.method ? o.payment.method : 'COD'),
          date: o.createdAt || o.orderDate || o.date,
          status: (o.status || '').toUpperCase(),
        }));
        setOrders(mapped);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, pageSize]);

  // Filter orders based on status
  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== 'all' && order.status !== filterStatus) {
      return false;
    }

    if (filterDate !== 'all') {
      const orderDate = new Date(order.date);
      const today = new Date();
      const diffTime = today - orderDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (filterDate === 'today' && diffDays !== 0) return false;
      if (filterDate === 'week' && diffDays > 7) return false;
      if (filterDate === 'month' && diffDays > 30) return false;
    }

    return true;
  });

  // Simple sorting: newest first
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const ad = a.date ? new Date(a.date).getTime() : 0;
    const bd = b.date ? new Date(b.date).getTime() : 0;
    return bd - ad;
  });

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const todayOrders = orders.filter((o) => {
    const orderDate = new Date(o.date);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  }).length;
  const todayRevenue = orders
    .filter((o) => {
      const orderDate = new Date(o.date);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    })
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

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
          <div className="single-orders-stat-value">{totalOrders}</div>
        </div>
        <div className="single-orders-stat">
          <div className="single-orders-stat-label">Pending</div>
          <div className="single-orders-stat-value">{pendingOrders}</div>
        </div>
        <div className="single-orders-stat">
          <div className="single-orders-stat-label">Today's Orders</div>
          <div className="single-orders-stat-value">{todayOrders}</div>
        </div>
        <div className="single-orders-stat">
          <div className="single-orders-stat-label">Revenue (Today)</div>
          <div className="single-orders-stat-value">₹{todayRevenue.toLocaleString()}</div>
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
            <option value="Paid">Paid</option>
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
      </div>

      {/* Table */}
      {loading ? (
        <div className="single-orders-empty">Loading orders…</div>
      ) : (
        <OrdersTable type="single" orders={sortedOrders} />
      )}

      {/* Empty State */}
      {!loading && sortedOrders.length === 0 && (
        <div className="single-orders-empty">
          <p>No orders found. Orders placed by users will appear here.</p>
        </div>
      )}
    </div>
  );
}
