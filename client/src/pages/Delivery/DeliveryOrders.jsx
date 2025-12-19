import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../../components/delivery/OrderCard';
import './DeliveryOrders.css';

const DeliveryOrders = () => {
  const navigate = useNavigate();
  const [ordersList, setOrdersList] = useState([
    {
      id: 'ORD-1234',
      status: 'assigned',
      customerName: 'John Doe',
      address: '123 Main St, Bangalore',
      amount: 450,
      items: 3,
      distance: '2.5 km',
    },
    {
      id: 'ORD-1235',
      status: 'picked',
      customerName: 'Jane Smith',
      address: '456 Park Ave, Bangalore',
      amount: 650,
      items: 5,
      distance: '3.1 km',
    },
    {
      id: 'ORD-1236',
      status: 'delivered',
      customerName: 'Bob Wilson',
      address: '789 Lake Rd, Bangalore',
      amount: 300,
      items: 2,
      distance: '1.8 km',
    },
  ]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Verify delivery boy is logged in
    const userStr = localStorage.getItem('ec_user');
    if (!userStr) {
      navigate('/');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'DELIVERY_BOY') {
      navigate('/');
    }
  }, [navigate]);

  const filteredOrders = ordersList.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ['assigned', 'picked', 'on_the_way'].includes(order.status);
    if (filter === 'completed') return order.status === 'delivered';
    return order.status === filter;
  });

  const getFilterCount = (filterType) => {
    if (filterType === 'all') return ordersList.length;
    if (filterType === 'pending') return ordersList.filter(o => ['assigned', 'picked', 'on_the_way'].includes(o.status)).length;
    if (filterType === 'completed') return ordersList.filter(o => o.status === 'delivered').length;
    return ordersList.filter(o => o.status === filterType).length;
  };

  const filters = [
    { key: 'all', label: 'All Orders', count: getFilterCount('all') },
    { key: 'assigned', label: 'New', count: getFilterCount('assigned') },
    { key: 'pending', label: 'In Progress', count: getFilterCount('pending') },
    { key: 'completed', label: 'Completed', count: getFilterCount('completed') }
  ];

  return (
    <div className="delivery-orders">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Manage your delivery orders</p>
      </div>

      <div className="orders-filters">
        {filters.map(filterItem => (
          <button
            key={filterItem.key}
            className={`filter-btn ${filter === filterItem.key ? 'active' : ''}`}
            onClick={() => setFilter(filterItem.key)}
          >
            <span className="filter-label">{filterItem.label}</span>
            <span className="filter-count">{filterItem.count}</span>
          </button>
        ))}
      </div>

      <div className="orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h3>No orders found</h3>
            <p>
              {filter === 'all' 
                ? 'You don\'t have any orders yet.' 
                : `No ${filter} orders at the moment.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryOrders;