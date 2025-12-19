import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderTracking from '../../components/admin/orders/OrderTracking';
import CustomerCard from '../../components/admin/orders/CustomerCard';
import DriverCard from '../../components/admin/orders/DriverCard';
import { getAdminOrderById, updateOrderStatus } from '../../services/adminOrdersService';
import './styles/OrderDetailsPage.css';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadOrder = async () => {
    try {
      const res = await getAdminOrderById(orderId);
      const o = res?.data || res;

      // Extract driver info - handle both populated object and string fields
      const driverData = typeof o.driverId === 'object' ? o.driverId : null;

      // Normalize to UI shape
      const normalized = {
        id: o._id || o.id,
        type: o.isBulk ? 'bulk' : 'single',
        customerName: o.address?.name || o.user?.name || '—',
        customerPhone: o.address?.phone || o.user?.phone || '—',
        customerEmail: o.user?.email || null,
        deliveryAddress: o.address || null,
        items: Array.isArray(o.items) ? o.items : (o.itemsList || []),
        totalAmount: o.total ?? o.amount ?? 0,
        status: (o.status || '').toUpperCase(),
        deliveryStatus: (o.deliveryStatus || '').toUpperCase(),
        orderDate: o.createdAt || o.orderDate,
        pickupLocation: o.pickupLocation || o.pickup || null,
        deliveryLocation: o.deliveryLocation || o.delivery || null,
        driverId: driverData?._id || o.driverId,
        driverName: driverData?.name || o.driverName,
        driverPhone: driverData?.phoneNumber || o.driverPhone,
        statusHistory: Array.isArray(o.statusHistory) ? o.statusHistory : [],
        raw: o,
      };

      setOrder(normalized);
    } catch (error) {
      console.error('Failed to load order:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        if (mounted) await loadOrder();
      } catch(err) {
        console.error('Failed to fetch order details:', err);
      }
    };

    load();

    // Auto-refresh every 15 seconds if order is out for delivery
    const interval = setInterval(() => {
      if (mounted && order?.status === 'OUT_FOR_DELIVERY') {
        loadOrder();
      }
    }, 15000);

    return () => { 
      mounted = false;
      clearInterval(interval);
    };
  }, [orderId, order?.status]);

  if (!order) {
    return <div className="order-details-loading">Loading order...</div>;
  }

  const getStatusColor = (status) => {
    const colors = {
      PLACED: '#3b82f6',
      PAID: '#2563eb',
      PREPARING: '#f59e0b',
      READY_FOR_PICKUP: '#14b8a6',
      OUT_FOR_DELIVERY: '#8b5cf6',
      DELIVERED: '#10b981',
      CANCELLED: '#ef4444',
      PENDING: '#6b7280',
      CONFIRMED: '#8b5cf6'
    };
    return colors[status] || '#6b7280';
  };

  const handleStatusChange = async (nextStatus) => {
    if (!order) return;
    setActionMessage('');
    setActionLoading(true);
    try {
      await updateOrderStatus(order.id, nextStatus);
      setActionMessage(`Status updated to ${nextStatus}`);
      // Refresh
      const refreshed = await getAdminOrderById(order.id);
      const o = refreshed?.data || refreshed;
      const driverData = typeof o.driverId === 'object' ? o.driverId : null;
      setOrder({
        id: o._id || o.id,
        type: o.isBulk ? 'bulk' : 'single',
        customerName: o.address?.name || o.user?.name || '—',
        customerPhone: o.address?.phone || o.user?.phone || '—',
        customerEmail: o.user?.email || null,
        deliveryAddress: o.address || null,
        items: Array.isArray(o.items) ? o.items : (o.itemsList || []),
        totalAmount: o.total ?? o.amount ?? 0,
        status: (o.status || '').toUpperCase(),
        deliveryStatus: (o.deliveryStatus || '').toUpperCase(),
        orderDate: o.createdAt || o.orderDate,
        pickupLocation: o.pickupLocation || o.pickup || null,
        deliveryLocation: o.deliveryLocation || o.delivery || null,
        driverId: driverData?._id || o.driverId,
        driverName: driverData?.name || o.driverName,
        driverPhone: driverData?.phoneNumber || o.driverPhone,
        statusHistory: Array.isArray(o.statusHistory) ? o.statusHistory : [],
        raw: o,
      });
    } catch (err) {
      console.error('Status change failed', err);
      setActionMessage('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const status = order?.status || '';
  const deliveryStatus = order?.deliveryStatus || '';
  const canAccept = status === 'PLACED' || status === 'PAID';
  const canReject = status !== 'CANCELLED' && status !== 'DELIVERED';
  const canMarkPreparing = status === 'PLACED' || status === 'PAID';
  const canMarkReady = status === 'PREPARING';
  // Only driver can mark delivered - not admin
  const canMarkDelivered = false;

  return (
      <div className="order-details-page">
      <div className="order-details-top-bar">
        <button className="back-button" onClick={() => navigate('/admin/orders')}>
          ← Back to Orders
        </button>
        <button className="refresh-button" onClick={loadOrder} title="Refresh order status">
          🔄 Refresh
        </button>
      </div>

      <div className="order-details-header">
        <div className="order-title-group">
          <h1>Order {order.id}</h1>
          <span className="order-type-badge">{order.type} order</span>
        </div>
        <div className="status-badges">
          <span className={`order-status-badge ${order.status ? order.status.toLowerCase() : ''}`}>
            {order.status}
          </span>
          {order.deliveryStatus && (
            <span className="delivery-status-badge">
              {order.deliveryStatus}
            </span>
          )}
        </div>
      </div>

      <div className="order-actions-bar">
        <div className="action-buttons">
          <button disabled={!canAccept || actionLoading} onClick={() => handleStatusChange('PREPARING')}>Accept</button>
          <button disabled={!canReject || actionLoading} onClick={() => handleStatusChange('CANCELLED')}>Reject</button>
          <button disabled={!canMarkPreparing || actionLoading} onClick={() => handleStatusChange('PREPARING')}>Mark Preparing</button>
          <button disabled={!canMarkReady || actionLoading} onClick={() => handleStatusChange('READY_FOR_PICKUP')}>Mark Ready</button>
        </div>
        <div className="action-note" style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
          💡 Driver will mark order as delivered
        </div>

        {actionMessage && <div className="action-message">{actionMessage}</div>}
      </div>

      <div className="order-details-grid">
        <div className="order-details-left">
          <div className="order-section">
            <h2>Order Items</h2>
            <div className="order-items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item">
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    {item.notes && <div className="item-notes">Note: {item.notes}</div>}
                  </div>
                  <div className="item-qty">x{item.qty}</div>
                  <div className="item-price">₹{item.price * item.qty}</div>
                </div>
              ))}
              <div className="order-total">
                <span>Total Amount</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          <CustomerCard customer={{
            name: order.customerName,
            phone: order.customerPhone,
            email: order.customerEmail,
            address: order.deliveryAddress || {}
          }} />

          <OrderTracking status={order.status} deliveryStatus={deliveryStatus} orderDate={order.orderDate} history={order.statusHistory} />
        </div>

        <div className="order-details-right">
          <div className="order-section map-section">
            <h2>Delivery Route</h2>
            <div className="map-placeholder">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.886539092!2d77.49085452026243!3d12.953945613752363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
            <div className="map-legend">
              <div className="legend-item">
                <span className="legend-marker pickup">📍</span>
                <span>Pickup: {order.pickupLocation}</span>
              </div>
              <div className="legend-item">
                <span className="legend-marker delivery">📍</span>
                <span>Delivery: {order.deliveryLocation}</span>
              </div>
            </div>
          </div>

          {order.status !== 'CANCELLED' && (
            <DriverCard driver={{
              name: order.driverName,
              phone: order.driverPhone,
              id: order.driverId
            }} />
          )}
        </div>
      </div>
    </div>
  );
}
