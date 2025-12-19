import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../../components/orders/OrderCard';
import { getOrders, getMyOrders } from '../../services/ordersService.js';
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
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const mapOrder = (o) => {
    const itemSummary = Array.isArray(o.items)
      ? o.items.map(i => `${i.qty}x ${i.name}`).join(', ')
      : '';
    const addressShort = o?.address?.line1
      ? [o.address.line1, o.address.city, o.address.pincode].filter(Boolean).join(', ')
      : '';
    const statusNormalized = (o.status || '').toUpperCase();
    return {
      id: o._id || o.id,
      restaurantName: 'EatClub',
      status: statusNormalized,
      deliveryStatus: (o.deliveryStatus || '').toUpperCase(),
      totalAmount: o.total,
      itemSummary,
      placedAt: o.createdAt,
      deliveredAt: o.status === 'DELIVERED' ? o.updatedAt : null,
      addressShort,
    };
  };

  // Load orders from backend; fall back to local store if needed
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const remote = await getMyOrders();
        if (Array.isArray(remote)) {
          setOrders(remote.map(mapOrder));
        } else if (Array.isArray(remote?.data)) {
          setOrders(remote.data.map(mapOrder));
        } else {
          setOrders([]);
        }
      } catch (err) {
        // fallback to local orders store for development
        const local = getOrders();
        setOrders(local);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter orders
  const ongoingStatuses = ['PLACED', 'PAID', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'];
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
