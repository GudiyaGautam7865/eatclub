import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getOrderTracking } from '../../services/ordersService';
import Toast from '../../components/common/Toast';
import './TrackOrderPage.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';

export default function TrackOrderPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tracking, setTracking] = useState(null);
  const [toast, setToast] = useState(null);
  const [prevDeliveryStatus, setPrevDeliveryStatus] = useState(null);
  const [socket, setSocket] = useState(null);
  const [liveDeliveryLocation, setLiveDeliveryLocation] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getOrderTracking(orderId);
        const data = res?.data || res;
        console.log('📦 Tracking data loaded:', data);
        
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

        console.log('🚚 Driver info:', newTracking.driver);

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

    // Auto-refresh disabled per request
    return () => {};
  }, [orderId]);

  // Initialize Socket.IO connection for live tracking
  useEffect(() => {
    const newSocket = io(process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected for TrackOrderPage');
      // Join the order room using orderId to listen for live updates
      newSocket.emit('joinOrderRoom', orderId);
    });

    // Listen for live delivery location updates from delivery boy
    newSocket.on('deliveryLocationUpdate', (data) => {
      console.log('📍 Live delivery location update:', data);
      if (data.orderId === orderId) {
        setLiveDeliveryLocation({
          lat: data.lat,
          lng: data.lng,
          updatedAt: data.timestamp || new Date().toISOString()
        });
        
        // Update tracking with latest delivery location
        setTracking(prev => prev ? {
          ...prev,
          currentLocation: {
            lat: data.lat,
            lng: data.lng,
            updatedAt: data.timestamp || new Date().toISOString()
          }
        } : null);
      }
    });

    // Listen for order status updates
    newSocket.on('orderStatusUpdate', (data) => {
      console.log('📢 Order status update:', data);
      if (data.orderId === orderId) {
        setTracking(prev => prev ? {
          ...prev,
          status: data.status || prev.status,
          deliveryStatus: data.deliveryStatus || prev.deliveryStatus
        } : null);
      }
    });

    // Listen for delivery boy assignment
    newSocket.on('orderAccepted', (data) => {
      console.log('✅ Delivery boy accepted order:', data);
      console.log('📦 Order accepted event received:', data);
      
      if (data.orderId === orderId) {
        // Create driver object from socket data
        const driver = {
          name: data.driverName,
          phone: data.driverPhone,
          vehicleNumber: data.driverVehicleNumber
        };
        
        console.log('🚚 Driver details extracted:', driver);
        
        // Update tracking with driver info from socket event
        setTracking(prev => {
          if (!prev) return null;
          
          const updated = {
            ...prev,
            driver: driver,
            deliveryStatus: 'PICKED_UP',
            status: 'OUT_FOR_DELIVERY'
          };
          
          console.log('✅ Tracking state updated with driver:', updated.driver);
          return updated;
        });
        
        // Also refresh from API to ensure consistency
        const refreshTracking = async () => {
          try {
            const res = await getOrderTracking(orderId);
            const data = res?.data || res;
            setTracking(prev => prev ? {
              ...prev,
              driver: data.driver || prev.driver,
              status: data.status || prev.status,
              deliveryStatus: data.deliveryStatus || prev.deliveryStatus
            } : null);
          } catch (err) {
            console.error('Failed to refresh tracking after acceptance:', err);
          }
        };
        refreshTracking();
      }
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Socket disconnected from TrackOrderPage');
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [orderId]);

  // Try to use browser geolocation to show user's current position on the map
  useEffect(() => {
    let geoWatchId = null;
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      try {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            setTracking(prev => prev ? {
              ...prev,
              userLocation: {
                lat: coords.latitude,
                lng: coords.longitude,
                updatedAt: new Date().toISOString()
              }
            } : prev);
          },
          () => {},
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
        );

        geoWatchId = navigator.geolocation.watchPosition(
          ({ coords }) => {
            setTracking(prev => prev ? {
              ...prev,
              userLocation: {
                lat: coords.latitude,
                lng: coords.longitude,
                updatedAt: new Date().toISOString()
              }
            } : prev);
          },
          () => {},
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
        );
      } catch {}
    }
    return () => {
      if (geoWatchId) navigator.geolocation.clearWatch(geoWatchId);
    };
  }, []);

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

  // Helper component to fit bounds to both markers when available
  const FitBounds = ({ positions }) => {
    const map = useMap();
    useEffect(() => {
      if (positions && positions.length > 0) {
        const bounds = L.latLngBounds(positions);
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    }, [positions, map]);
    return null;
  };

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
            <span>🚴</span>
          </div>
          <div className="delivery-boy-details">
            <h4>{driver.name || 'Delivery Partner'}</h4>
            {driver.phone && (
              <p>
                <span style={{ fontSize: '1.1rem' }}>📞</span>
                <strong>Phone:</strong> {driver.phone}
              </p>
            )}
            {driver.vehicleNumber && (
              <p>
                <span style={{ fontSize: '1.1rem' }}>🚗</span>
                <strong>Vehicle:</strong> {driver.vehicleNumber}
              </p>
            )}
            {(deliveryBoyLocation || liveDeliveryLocation) && (
              <p style={{ color: '#10b981', fontWeight: 500 }}>
                <span style={{ fontSize: '1.1rem' }}>📍</span>
                <strong>Location:</strong> {(deliveryBoyLocation?.lat || liveDeliveryLocation?.lat)?.toFixed(4)}, {(deliveryBoyLocation?.lng || liveDeliveryLocation?.lng)?.toFixed(4)}
              </p>
            )}
          </div>
        </div>
        {driver.phone && (
          <div className="delivery-boy-actions">
            <button className="call-btn" onClick={() => window.open(`tel:${driver.phone}`)}>
              <span>📞</span> Call Driver
            </button>
          </div>
        )}
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

  // Use live delivery location if available, otherwise use current location from DB
  const deliveryBoyLocation = liveDeliveryLocation || tracking?.currentLocation;
  
  const userLat = tracking?.userLocation?.lat;
  const userLng = tracking?.userLocation?.lng;
  const driverLat = deliveryBoyLocation?.lat;
  const driverLng = deliveryBoyLocation?.lng;

  // Render a live Leaflet map with two markers and a connecting line
  const renderLiveMap = () => {
    const userPos = userLat && userLng ? [userLat, userLng] : null;
    const driverPos = driverLat && driverLng ? [driverLat, driverLng] : null;
    const center = driverPos || userPos || [20.0, 77.0]; // Fallback center (India)

    const positions = [];
    if (userPos) positions.push(userPos);
    if (driverPos) positions.push(driverPos);

    return (
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userPos && (
          <CircleMarker center={userPos} radius={10} color="#ef4444" fillColor="#ef4444" fillOpacity={0.9}>
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>You</Tooltip>
          </CircleMarker>
        )}

        {driverPos && (
          <CircleMarker center={driverPos} radius={10} color="#3b82f6" fillColor="#3b82f6" fillOpacity={0.9}>
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>Delivery Boy</Tooltip>
          </CircleMarker>
        )}

        {userPos && driverPos && (
          <Polyline positions={[userPos, driverPos]} color="#10b981" weight={4} opacity={0.8} />
        )}

        <FitBounds positions={positions} />
      </MapContainer>
    );
  };

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
          {(userLat || driverLat) && (
            <div style={{ 
              position: 'absolute', 
              top: '10px', 
              left: '10px', 
              zIndex: 1000, 
              background: 'rgba(255, 255, 255, 0.95)', 
              padding: '8px 12px', 
              borderRadius: '8px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              fontSize: '0.85rem',
              display: 'flex',
              gap: '12px'
            }}>
              {userLat && userLng && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#ef4444', fontSize: '1.2rem' }}>📍</span>
                  <span>Your Location</span>
                </span>
              )}
              {driverLat && driverLng && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#3b82f6', fontSize: '1.2rem' }}>🚴</span>
                  <span>Delivery Boy</span>
                </span>
              )}
            </div>
          )}
          <div className="map live-map">
            {renderLiveMap()}
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
            {renderLiveMap()}
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