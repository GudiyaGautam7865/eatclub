import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderTracking } from '../../services/ordersService';
import Toast from '../../components/common/Toast';
import './TrackOrderPage.css';

export default function TrackOrderPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tracking, setTracking] = useState(null);
  const [toast, setToast] = useState(null);
  const [prevDeliveryStatus, setPrevDeliveryStatus] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getOrderTracking(orderId);
        const data = res?.data || res;
        const newTracking = {
          id: data.orderId,
          status: (data.status || '').toUpperCase(),
          deliveryStatus: (data.deliveryStatus || '').toUpperCase(),
          driver: data.driver || null,
          items: data.orderDetails?.items || [],
          total: data.orderDetails?.total || 0,
          placedAt: data.orderDetails?.placedAt || null,
          deliveryAddress: data.deliveryAddress || {},
          statusHistory: Array.isArray(data.statusHistory) ? data.statusHistory : [],
          userLocation: data.userLocation || null,
          currentLocation: data.currentLocation || null,
        };

        // Show toast notification when delivery status changes
        if (prevDeliveryStatus && prevDeliveryStatus !== newTracking.deliveryStatus && newTracking.deliveryStatus) {
          const messages = {
            'ASSIGNED': '🚴 Delivery partner has been assigned!',
            'PICKED_UP': '📦 Your order has been picked up from the restaurant!',
            'ON_THE_WAY': '🚀 Your order is on the way to you!',
            'DELIVERED': '✅ Order delivered! Enjoy your meal!'
          };
          setToast({ message: messages[newTracking.deliveryStatus] || 'Order status updated', type: 'success' });
        }

        setPrevDeliveryStatus(newTracking.deliveryStatus);
        setTracking(newTracking);
      } catch (err) {
        console.error('Failed to load tracking', err);
        setError('Could not load order tracking. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    load();

    // Auto-refresh every 10 seconds for real-time updates
    const interval = setInterval(() => {
      if (!loading) {
        load();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId, prevDeliveryStatus]);

  const statusCopy = {
    PLACED: { text: 'Order placed', icon: '📝', color: '#3b82f6' },
    PAID: { text: 'Payment confirmed', icon: '💳', color: '#2563eb' },
    PREPARING: { text: 'Restaurant is preparing your order', icon: '👨‍🍳', color: '#f59e0b' },
    READY_FOR_PICKUP: { text: 'Order is ready for pickup', icon: '📦', color: '#14b8a6' },
    OUT_FOR_DELIVERY: { text: 'Out for delivery', icon: '🚚', color: '#8b5cf6' },
    DELIVERED: { text: 'Order delivered', icon: '✅', color: '#10b981' },
    CANCELLED: { text: 'Order cancelled', icon: '⚠️', color: '#ef4444' },
  };

  const deliveryCopy = {
    ASSIGNED: 'Partner assigned',
    PICKED_UP: 'Picked up',
    ON_THE_WAY: 'On the way',
    DELIVERED: 'Delivered',
  };

  const driverAssignedStatuses = ['ASSIGNED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED'];
  const driverAssigned = driverAssignedStatuses.includes(tracking?.deliveryStatus) && Boolean(tracking?.driver);

  const renderStatusCard = () => {
    if (!tracking) return null;
    const config = statusCopy[tracking.status] || statusCopy.PLACED;
    return (
      <div className="status-card" style={{ borderColor: config.color }}>
        <div className="status-icon" style={{ backgroundColor: config.color }}>
          {config.icon}
        </div>
        <div className="status-text">
          <h3>Order #{tracking.id}</h3>
          <p>{config.text}</p>
          {tracking.status === 'OUT_FOR_DELIVERY' && tracking.deliveryStatus && (
            <div className="delivery-progress">
              <div className="progress-badge" style={{ 
                backgroundColor: tracking.deliveryStatus === 'DELIVERED' ? '#10b981' : 
                               tracking.deliveryStatus === 'ON_THE_WAY' ? '#8b5cf6' : 
                               tracking.deliveryStatus === 'PICKED_UP' ? '#3b82f6' : '#f59e0b'
              }}>
                {tracking.deliveryStatus === 'ASSIGNED' && '🚴 Partner Assigned'}
                {tracking.deliveryStatus === 'PICKED_UP' && '📦 Order Picked Up'}
                {tracking.deliveryStatus === 'ON_THE_WAY' && '🚚 On the Way to You'}
                {tracking.deliveryStatus === 'DELIVERED' && '✅ Delivered'}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDriverCard = () => {
    if (!driverAssigned) return null;
    const driver = tracking.driver;
    return (
      <div className="delivery-boy-card">
        <div className="delivery-boy-info">
          <div className="delivery-boy-avatar">
            <span>�</span>
          </div>
          <div className="delivery-boy-details">
            <h4>{driver.name}</h4>
            <p>{driver.vehicleNumber ? `Vehicle: ${driver.vehicleNumber}` : ''}</p>
          </div>
        </div>
        <div className="delivery-boy-actions">
          {driver.phone && (
            <button className="call-btn" onClick={() => window.open(`tel:${driver.phone}`)}>
              📞
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderItems = () => {
    if (!tracking) return null;
    return (
      <div className="order-items-card">
        <h4>Order Items</h4>
        <div className="items-list">
          {tracking.items.map((item, idx) => (
            <div key={idx} className="order-item">
              <div className="item-details">
                <h5>{item.name}</h5>
                <p>Qty: {item.qty || item.quantity || 1}</p>
              </div>
              <div className="item-price">₹{item.price}</div>
            </div>
          ))}
        </div>
        <div className="order-total">
          <strong>Total: ₹{tracking.total}</strong>
        </div>
      </div>
    );
  };

  const renderHistory = () => {
    if (!tracking?.statusHistory?.length) return null;
    return (
      <div className="history-card">
        <h4>Status History</h4>
        <ul>
          {tracking.statusHistory.map((h, idx) => (
            <li key={`${h.timestamp || idx}-${idx}`}>
              <span className="history-time">{h.timestamp ? new Date(h.timestamp).toLocaleString() : ''}</span>
              <span className="history-text">{[h.status, h.deliveryStatus].filter(Boolean).join(' / ')}</span>
              {h.note && <span className="history-note">{h.note}</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) return <div className="track-order-page"><div className="track-header"><button className="back-btn" onClick={() => navigate(-1)}>←</button><h2>Track Order</h2></div><div className="track-loading">Loading...</div></div>;
  if (error) return <div className="track-order-page"><div className="track-header"><button className="back-btn" onClick={() => navigate(-1)}>←</button><h2>Track Order</h2></div><div className="track-error">{error}</div></div>;

  const mapPoint = tracking?.currentLocation || tracking?.userLocation || null;
  const hasCoords = mapPoint?.lat && mapPoint?.lng;
  const bboxPad = 0.01;
  const bbox = hasCoords
    ? `${mapPoint.lng - bboxPad},${mapPoint.lat - bboxPad},${mapPoint.lng + bboxPad},${mapPoint.lat + bboxPad}`
    : '68,6,98,37'; // India-ish fallback
  const marker = hasCoords ? `&marker=${mapPoint.lat},${mapPoint.lng}` : '';
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${marker}`;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="track-order-page">
      <div className="track-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2>Track Order</h2>
      </div>

      {/* Mobile Layout */}
      <div className="mobile-layout">
        {/* Map Section */}
        <div className="map-container">
          <div className="map live-map">
            <iframe
              title="Order Map"
              src={mapSrc}
              style={{ border: 0, width: '100%', height: '100%' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        
        {/* Bottom Sheet */}
        <div className="bottom-sheet">
          <div className="sheet-handle"></div>
          {renderStatusCard()}
          {renderDriverCard()}
          {renderItems()}
          {renderHistory()}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="desktop-layout">
        {/* Map Side */}
        <div className="map-side">
          <div className="map live-map">
            <iframe
              title="Order Map"
              src={mapSrc}
              style={{ border: 0, width: '100%', height: '100%' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        
        {/* Info Side */}
        <div className="info-side">
          {renderStatusCard()}
          {renderDriverCard()}
          {renderItems()}
          {renderHistory()}
        </div>
      </div>
    </div>
    </>
  );
}
