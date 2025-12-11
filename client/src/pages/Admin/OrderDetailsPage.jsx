import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderTracking from '../../components/admin/orders/OrderTracking';
import CustomerCard from '../../components/admin/orders/CustomerCard';
import DriverCard from '../../components/admin/orders/DriverCard';
import { getAdminOrderById } from '../../services/adminOrdersService';
import './styles/OrderDetailsPage.css';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
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
          status: (o.status || '').toLowerCase(),
          orderDate: o.createdAt || o.orderDate,
          pickupLocation: o.pickupLocation || o.pickup || null,
          deliveryLocation: o.deliveryLocation || o.delivery || null,
          driverId: driverData?._id || o.driverId,
          driverName: driverData?.name || o.driverName,
          driverPhone: driverData?.phoneNumber || o.driverPhone,
          raw: o,
        };

        if (mounted) setOrder(normalized);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
      }
    };

    load();
    return () => { mounted = false; };
  }, [orderId]);

  if (!order) {
    return <div className="order-details-loading">Loading order...</div>;
  }

  const getStatusColor = (status) => {
    const colors = {
      placed: '#3b82f6',
      preparing: '#f59e0b',
      completed: '#10b981',
      cancelled: '#ef4444',
      pending: '#6b7280',
      confirmed: '#8b5cf6'
    };
    return colors[status] || '#6b7280';
  };

  return (
      <div className="order-details-page">
      <button className="back-button" onClick={() => navigate('/admin/orders')}>
        ← Back to Orders
      </button>

      <div className="order-details-header">
        <div>
          <h1>Order {order.id}</h1>
          <span className="order-type-badge">{order.type} order</span>
        </div>
        <span className="order-status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
          {order.status.toUpperCase()}
        </span>
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

          <OrderTracking status={order.status} orderDate={order.orderDate} />
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

          {(order.driverId || order.driverName) && (
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
