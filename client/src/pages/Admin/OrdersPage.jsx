import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrdersFilterBar from '../../components/admin/orders/OrdersFilterBar';
import OrdersGridCard from '../../components/admin/orders/OrdersGridCard';
import OrdersTable from '../../components/admin/orders/OrdersTable';
import { getAdminSingleOrders, getAdminBulkOrders } from '../../services/adminOrdersService';
import './styles/OrdersPage.css';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const [singleOrders, bulkOrders] = await Promise.all([
        getAdminSingleOrders(),
        getAdminBulkOrders()
      ]);
      // Normalize backend order shape to UI-friendly shape
      const normalize = (o, isBulkFallback = false) => {
        const order = o || {};
        return {
          id: order._id || order.id || '',
          type: typeof order.isBulk === 'boolean' ? (order.isBulk ? 'bulk' : 'single') : (isBulkFallback ? 'bulk' : 'single'),
          customerName: order.name || order.user?.name || order.address?.name || order.customerName || '—',
          customerPhone: order.phone || order.user?.phoneNumber || order.user?.phone || order.address?.phone || order.customerPhone || '—',
          orderDate: order.createdAt || order.orderDate || order.date || null,
          totalAmount: order.total ?? order.amount ?? 0,
          items: Array.isArray(order.items) ? order.items : (order.itemsList || []),
          status: (order.status || '').toUpperCase(),
          paymentMethod: (order.payment && order.payment.method ? order.payment.method : null),
          raw: order,
        };
      };

      const normalizedSingle = (singleOrders || []).map(o => normalize(o, false));
      const normalizedBulk = (bulkOrders || []).map(o => normalize(o, true));

      const allOrders = [...normalizedSingle, ...normalizedBulk];
      setOrders(allOrders);
      setFilteredOrders(allOrders);
    } catch (error) {
      console.error('Failed to load orders from API:', error);
      setError('Failed to load orders from server. Check logs or try again later.');
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    let filtered = [...orders];

    if (filters.orderType !== 'all') {
      filtered = filtered.filter(o => o.type === filters.orderType);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(o => o.status === filters.status);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(o =>
        (o.id || '').toString().toLowerCase().includes(search) ||
        (o.customerName || '').toString().toLowerCase().includes(search) ||
        (o.customerPhone || '').toString().includes(search)
      );
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(o => {
        const orderDate = new Date(o.orderDate);
        const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
        
        if (filters.dateRange === 'today') return diffDays === 0;
        if (filters.dateRange === 'week') return diffDays <= 7;
        if (filters.dateRange === 'month') return diffDays <= 30;
        return true;
      });
    }

    setFilteredOrders(filtered);
  };

  const handleOrderClick = (orderId, orderType) => {
    if (orderType === 'bulk') {
      navigate(`/admin/orders/bulk/${orderId}`);
    } else {
      navigate(`/admin/orders/${orderId}`);
    }
  };

  if (loading) {
    return <div className="orders-loading">Loading orders...</div>;
  }

  return (
    <div className="admin-orders-page">
      <div className="orders-header">
        <h1>Orders Management</h1>
        {error ? <span className="error-badge">{error}</span> : null}
      </div>

      <OrdersFilterBar onFilter={handleFilter} />

      <div className="orders-view-toggle">
        <button
          className={viewMode === 'grid' ? 'active' : ''}
          onClick={() => setViewMode('grid')}
        >
          Grid View
        </button>
        <button
          className={viewMode === 'table' ? 'active' : ''}
          onClick={() => setViewMode('table')}
        >
          Table View
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className="orders-grid">
          {filteredOrders.map(order => (
            <OrdersGridCard
              key={order.id}
              order={order}
              onClick={() => handleOrderClick(order.id, order.type)}
            />
          ))}
        </div>
      ) : (
        <OrdersTable
          orders={filteredOrders}
          onRowClick={(orderId, orderType) => handleOrderClick(orderId, orderType)}
        />
      )}

      {filteredOrders.length === 0 && (
        <div className="orders-empty">No orders found</div>
      )}
    </div>
  );
}
