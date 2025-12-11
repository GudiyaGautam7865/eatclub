import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrdersFilterBar from '../../components/admin/orders/OrdersFilterBar';
import OrdersGridCard from '../../components/admin/orders/OrdersGridCard';
import OrdersTable from '../../components/admin/orders/OrdersTable';
import { getAdminSingleOrders, getAdminBulkOrders } from '../../services/adminOrdersService';
import mockOrders from '../../mock/admin/orders-sample.json';
import './styles/OrdersPage.css';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const [singleOrders, bulkOrders] = await Promise.all([
        getAdminSingleOrders(),
        getAdminBulkOrders()
      ]);
      
      const allOrders = [...singleOrders, ...bulkOrders];
      
      if (allOrders.length === 0) {
        setUseMock(true);
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
      } else {
        setOrders(allOrders);
        setFilteredOrders(allOrders);
      }
    } catch (error) {
      console.warn('API failed, using mock data:', error);
      setUseMock(true);
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
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
        o.id.toLowerCase().includes(search) ||
        o.customerName.toLowerCase().includes(search) ||
        o.customerPhone.includes(search)
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

  const handleOrderClick = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  if (loading) {
    return <div className="orders-loading">Loading orders...</div>;
  }

  return (
    <div className="admin-orders-page">
      <div className="orders-header">
        <h1>Orders Management</h1>
        {useMock && <span className="mock-badge">Using Mock Data</span>}
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
              onClick={() => handleOrderClick(order.id)}
            />
          ))}
        </div>
      ) : (
        <OrdersTable
          orders={filteredOrders}
          onRowClick={handleOrderClick}
        />
      )}

      {filteredOrders.length === 0 && (
        <div className="orders-empty">No orders found</div>
      )}
    </div>
  );
}
