import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './TrackOrderPage.css';

export default function TrackOrderPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const mapRef = useRef(null);
  
  // Order status state - TODO: Replace with backend-driven status updates
  const [orderStatus, setOrderStatus] = useState('out_for_delivery');
  
  const [orderData] = useState({
    _id: orderId || 'ORD123456',
    items: [
      { name: 'Chicken Biryani', qty: 2, price: 350 },
      { name: 'Paneer Butter Masala', qty: 1, price: 280 },
      { name: 'Garlic Naan', qty: 3, price: 60 }
    ],
    total: 1040
  });
  
  // Static delivery boy data - TODO: Populate from backend order assignment API
  const [deliveryBoy] = useState({
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    vehicle: 'MH12AB1234',
    rating: 4.8
  });

  // Status configuration
  const statusConfig = {
    processing: { text: 'Order is being processed', icon: '⏳', color: '#ff9800' },
    preparing: { text: 'Restaurant is preparing your order', icon: '👨‍🍳', color: '#2196f3' },
    delivery_assigned: { text: 'Delivery partner assigned', icon: '🚴', color: '#9c27b0' },
    out_for_delivery: { text: 'Out for delivery – track your order', icon: '🛵', color: '#4caf50' },
    delivered: { text: 'Order delivered', icon: '✅', color: '#4caf50' }
  };

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = initializeMap;
    document.head.appendChild(script);
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;
    
    // Static coordinates - TODO: Replace with live GPS data from backend/socket
    const restaurantCoords = [18.5204, 73.8567]; // FC Road
    const userCoords = [18.5362, 73.8953]; // Koregaon Park
    const deliveryBoyCoords = [18.5283, 73.8759]; // Current position
    
    const map = L.map(mapRef.current).setView(deliveryBoyCoords, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // User address marker
    L.marker(userCoords)
      .addTo(map)
      .bindPopup('🏠 Your Location');
    
    // Delivery boy marker (only show if delivery assigned)
    if (['delivery_assigned', 'out_for_delivery'].includes(orderStatus)) {
      L.marker(deliveryBoyCoords)
        .addTo(map)
        .bindPopup('🚴 ' + deliveryBoy.name);
    }
    
    // Dashed polyline route
    L.polyline([ deliveryBoyCoords, userCoords], {
      color: '#4caf50',
      weight: 2,
      dashArray: '10, 10'
    }).addTo(map);
    
    // Fit map to show all markers
    const group = new L.featureGroup([L.marker(userCoords)]);
    map.fitBounds(group.getBounds().pad(0.1));
  };

  // Status Card Component
  const StatusCard = () => {
    const config = statusConfig[orderStatus];
    return (
      <div className="status-card" style={{ borderColor: config.color }}>
        <div className="status-icon" style={{ backgroundColor: config.color }}>
          {config.icon}
        </div>
        <div className="status-text">
          <h3>Order #{orderData._id}</h3>
          <p>{config.text}</p>
        </div>
      </div>
    );
  };

  // Delivery Boy Card Component (only show when delivery assigned)
  const DeliveryBoyCard = () => {
    if (!['delivery_assigned', 'out_for_delivery', 'delivered'].includes(orderStatus)) {
      return null;
    }
    
    return (
      <div className="delivery-boy-card">
        <div className="delivery-boy-info">
          <div className="delivery-boy-avatar">
            <span>🚴</span>
          </div>
          <div className="delivery-boy-details">
            <h4>{deliveryBoy.name}</h4>
            <p>⭐ {deliveryBoy.rating} • {deliveryBoy.vehicle}</p>
            <p className="eta">ETA: 15-20 mins</p>
          </div>
        </div>
        <div className="delivery-boy-actions">
          <button className="call-btn" onClick={() => window.open(`tel:${deliveryBoy.phone}`)}>
            📞
          </button>
        </div>
      </div>
    );
  };

  // Order Items Card Component
  const OrderItemsCard = () => (
    <div className="order-items-card">
      <h4>Order Items</h4>
      <div className="items-list">
        {orderData.items.map((item, index) => (
          <div key={index} className="order-item">
            <img src="/api/placeholder/60/60" alt={item.name} className="item-image" />
            <div className="item-details">
              <h5>{item.name}</h5>
              <p>Qty: {item.qty}</p>
            </div>
            <div className="item-price">
              ₹{item.price}
            </div>
          </div>
        ))}
      </div>
      <div className="order-total">
        <strong>Total: ₹{orderData.total}</strong>
      </div>
    </div>
  );

  return (
    <div className="track-order-page">
      {/* Header */}
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
          <div ref={mapRef} className="map"></div>
        </div>
        
        {/* Bottom Sheet */}
        <div className="bottom-sheet">
          <div className="sheet-handle"></div>
          <StatusCard />
          <DeliveryBoyCard />
          <OrderItemsCard />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="desktop-layout">
        {/* Map Side */}
        <div className="map-side">
          <div ref={mapRef} className="map"></div>
        </div>
        
        {/* Info Side */}
        <div className="info-side">
          <StatusCard />
          <DeliveryBoyCard />
          <OrderItemsCard />
        </div>
      </div>
    </div>
  );
}
