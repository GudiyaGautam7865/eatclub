import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../../components/orders/OrderCard';
import { getOrders } from '../../services/ordersService.js';
import './ManageOrdersPage.css';

function EmptyState({ activeTab }) {
  const navigate = useNavigate();

  const isOngoing = activeTab === 'ongoing';
  const title = 'No orders here yet';
  const subtitle = isOngoing
    ? "You don't have any active orders right now."
    : "You haven't placed any orders yet.";

  return (
    <div className="mo-empty">
      <div className="mo-empty-illustration">🍽️</div>
      <h3 className="mo-empty-title">{title}</h3>
      <p className="mo-empty-subtitle">{subtitle}</p>
      <button
        className="mo-empty-button"
        onClick={() => navigate('/menu')}
      >
        Order Now
      </button>
    </div>
  );
}

export default function ManageOrdersPage() {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [loading] = useState(false);
  const [orders, setOrders] = useState([]);

  // Load orders from service on mount
  useEffect(() => {
    const loadedOrders = getOrders();
    setOrders(loadedOrders);
  }, []);

  // Filter orders
  const ongoingStatuses = ['PLACED', 'PREPARING', 'OUT_FOR_DELIVERY'];
  const ongoingOrders = orders.filter((order) =>
    ongoingStatuses.includes(order.status)
  );
  const pastOrders = orders.filter(
    (order) => !ongoingStatuses.includes(order.status)
  );

  const displayOrders = activeTab === 'ongoing' ? ongoingOrders : pastOrders;
  const isEmpty = displayOrders.length === 0;

  return (
    <main className="manage-orders-page">
      {/* Header */}
      <header className="mo-header">
        <h1 className="mo-title">Manage Orders</h1>
        <p className="mo-subtitle">
          Track your ongoing orders and reorder your favourites.
        </p>
      </header>

      {/* Tabs */}
      <div className="mo-tabs">
        <button
          className={`mo-tab ${activeTab === 'ongoing' ? 'mo-tab--active' : ''}`}
          onClick={() => setActiveTab('ongoing')}
        >
          Ongoing
        </button>
        <button
          className={`mo-tab ${activeTab === 'past' ? 'mo-tab--active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
      </div>

      {/* Content Area */}
      <div className="mo-content">
        {loading ? (
          <div className="mo-loading">Loading orders...</div>
        ) : isEmpty ? (
          <EmptyState activeTab={activeTab} />
        ) : (
          <div className="mo-orders-list">
            {displayOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
