import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../../components/delivery/OrderCard';
import { useDelivery } from '../../context/DeliveryContext';
import './DeliveryOrders.css';

const DeliveryOrders = () => {
  const navigate = useNavigate();
  const { ordersList } = useDelivery();
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
    if (filter === 'available') return order.status === 'available';
    if (filter === 'pending') return ['assigned', 'picked_up', 'on_the_way'].includes(order.status);
    if (filter === 'completed') return order.status === 'delivered';
    return order.status === filter;
  });

  const getFilterCount = (filterType) => {
    if (filterType === 'all') return ordersList.length;
    if (filterType === 'available') return ordersList.filter(o => o.status === 'available').length;
    if (filterType === 'pending') return ordersList.filter(o => ['assigned', 'picked_up', 'on_the_way'].includes(o.status)).length;
    if (filterType === 'completed') return ordersList.filter(o => o.status === 'delivered').length;
    return ordersList.filter(o => o.status === filterType).length;
  };

  const filters = [
    { key: 'all', label: 'All Orders', count: getFilterCount('all') },
    { key: 'available', label: '🚀 Available', count: getFilterCount('available') },
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