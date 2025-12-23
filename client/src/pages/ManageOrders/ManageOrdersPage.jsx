import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderCard from '../../components/orders/OrderCard';
import { getOrders, getMyOrders } from '../../services/ordersService.js';
import { getUserBulkOrders } from '../../services/bulkOrdersService.js';
import { getOrderTypeBadge } from '../../utils/orderUtils.js';
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
    const isBulk = o.orderType === 'BULK' || o.isBulk;
    const itemSummary = isBulk && o.bulkDetails
      ? `${o.bulkDetails.peopleCount} people • ${o.bulkDetails.eventName || 'Event'}`
      : Array.isArray(o.items)
      ? o.items.map(i => `${i.qty}x ${i.name}`).join(', ')
      : '';
    const addressShort = o?.address?.line1
      ? [o.address.line1, o.address.city, o.address.pincode].filter(Boolean).join(', ')
      : '';
    const statusNormalized = (o.status || '').toUpperCase();
    return {
      id: o._id || o.id,
      restaurantName: isBulk ? (o.bulkDetails?.eventType || 'Bulk Order') : 'EatClub',
      status: statusNormalized,
      deliveryStatus: (o.deliveryStatus || '').toUpperCase(),
      totalAmount: o.total,
      itemSummary,
      placedAt: o.createdAt,
      deliveredAt: o.status === 'DELIVERED' ? o.updatedAt : null,
      addressShort,
      acceptedAt: o.acceptedAt,
      paymentStatus: o.paymentStatus,
      refundStatus: o.refundStatus,
      refundAmount: o.refundAmount,
      orderType: o.orderType || (o.isBulk ? 'BULK' : 'SINGLE'),
      bulkDetails: o.bulkDetails,
    };
  };

  // Load orders from backend; fall back to local store if needed
  const loadOrders = async () => {
    try {
      setLoading(true);
      const [singleOrders, bulkOrders] = await Promise.all([
        getMyOrders().catch(() => []),
        getUserBulkOrders().catch(() => [])
      ]);
      
      const single = Array.isArray(singleOrders) ? singleOrders : (singleOrders?.data || []);
      const bulk = Array.isArray(bulkOrders) ? bulkOrders : (bulkOrders?.data || []);
      
      const allOrders = [
        ...single.map(o => ({ ...o, orderType: o.orderType || 'SINGLE' })),
        ...bulk.map(o => ({ ...o, orderType: o.orderType || 'BULK' }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setOrders(allOrders.map(mapOrder));
    } catch (err) {
      const local = getOrders();
      setOrders(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Filter orders
  const ongoingStatuses = ['REQUESTED', 'ACCEPTED', 'PAYMENT_PENDING', 'PAID', 'SCHEDULED', 'ASSIGNED', 'PLACED', 'PREPARING', 'READY', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'];
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
              <OrderCard key={order.id} order={order} onOrderUpdate={loadOrders} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
