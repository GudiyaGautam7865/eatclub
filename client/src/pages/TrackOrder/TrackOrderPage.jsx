import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import './TrackOrderPage.css';

export default function TrackOrderPage() {
  // Get orderId from URL parameters (/track-order/:orderId)
  const { orderId } = useParams();
  
  // State variables for tracking data
  const [orderData, setOrderData] = useState(null);           // Order details from database
  const [currentLocation, setCurrentLocation] = useState(null); // Delivery partner location
  const [userLocation, setUserLocation] = useState(null);     // User's GPS location
  const [socket, setSocket] = useState(null);                 // WebSocket connection
  const [loading, setLoading] = useState(true);               // Loading state
  
  // Map-related state
  const mapRef = useRef(null);                                // Reference to map DOM element
  const [map, setMap] = useState(null);                       // Leaflet map instance
  const [deliveryMarker, setDeliveryMarker] = useState(null); // Delivery partner marker
  const [userMarker, setUserMarker] = useState(null);         // User location marker
  const [routeLine, setRouteLine] = useState(null);           // Blue line between markers

  // Main effect - runs when component loads
  useEffect(() => {
    fetchOrderData();        // Get order details from database
    getUserLocation();       // Get user's GPS location
    
    // Create WebSocket connection for real-time updates
    const newSocket = io(process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:5000');
    setSocket(newSocket);

    // When socket connects, join the order room
    newSocket.on('connect', () => {
      console.log('Connected to tracking socket');
      newSocket.emit('joinOrder', orderId);  // Join room for this specific order
    });

    // Listen for live location updates from delivery partner
    newSocket.on('liveLocation', (data) => {
      console.log('Live location received:', data);
      const newLocation = {
        lat: data.lat,
        lng: data.lng,
        updatedAt: data.updatedAt
      };
      setCurrentLocation(newLocation);      // Update state
      updateDeliveryMarker(newLocation);    // Move marker on map
    });

    // Listen for driver assignment notifications
    newSocket.on('driverAssigned', (data) => {
      console.log('Driver assigned:', data);
      setOrderData(prev => ({
        ...prev,
        driver: data.driver,
        status: data.status
      }));
    });

    // Cleanup: disconnect socket when component unmounts
    return () => newSocket.disconnect();
  }, [orderId]);

  // Get user's current GPS location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);              // Save to state
          updateUserLocationOnServer(location);   // Send to server
        },
        (error) => {
          console.log('Error getting user location:', error);
        }
      );
    }
  };

  // Send user location to server for delivery partner to see
  const updateUserLocationOnServer = async (location) => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';
      await fetch(`${apiUrl}/orders/${orderId}/user-location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(location)
      });
    } catch (error) {
      console.error('Error updating user location:', error);
    }
  };

  // Test function - simulate delivery partner location (for testing only)
  const simulateDeliveryLocation = async () => {
    const testLocation = {
      lat: 18.51672 + (Math.random() - 0.5) * 0.1,  // Pune coordinates with random variation
      lng: 73.85625 + (Math.random() - 0.5) * 0.1
    };
    
    try {
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';
      await fetch(`${apiUrl}/orders/${orderId}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testLocation)
      });
      alert('Test location sent! Map will update in a moment.');
    } catch (error) {
      console.error('Error sending test location:', error);
    }
  };

  // Initialize Leaflet map
  const initializeMap = () => {
    if (mapRef.current && !map) {
      // Create map centered on Pune with zoom level 13
      const mapInstance = L.map(mapRef.current).setView([18.5204, 73.8567], 13);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);
      
      setMap(mapInstance);
    }
  };

  // Update delivery partner marker on map
  const updateDeliveryMarker = (location) => {
    if (map && location) {
      if (deliveryMarker) {
        // Move existing marker to new position
        deliveryMarker.setLatLng([location.lat, location.lng]);
      } else {
        // Create new delivery marker with truck icon
        const marker = L.marker([location.lat, location.lng], {
          icon: L.divIcon({
            html: '<div style="background: #4CAF50; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🚚</div>',
            iconSize: [30, 30],
            className: 'delivery-marker'
          })
        }).addTo(map);
        setDeliveryMarker(marker);
      }
      updateRouteLine(location);                    // Update blue line
      map.setView([location.lat, location.lng], 15); // Center map on delivery partner
    }
  };

  // Create user location marker (only once)
  const updateUserMarker = (location) => {
    if (map && location && !userMarker) {
      const marker = L.marker([location.lat, location.lng], {
        icon: L.divIcon({
          html: '<div style="background: #2196F3; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">📍</div>',
          iconSize: [30, 30],
          className: 'user-marker'
        })
      }).addTo(map);
      setUserMarker(marker);
      
      // If delivery location exists, draw route line
      if (currentLocation) {
        updateRouteLine(currentLocation);
      }
    }
  };

  // Draw blue line between delivery partner and user
  const updateRouteLine = (deliveryLocation) => {
    if (map && deliveryLocation && userLocation) {
      // Remove existing line
      if (routeLine) {
        map.removeLayer(routeLine);
      }
      
      // Create new blue line
      const line = L.polyline([
        [deliveryLocation.lat, deliveryLocation.lng],  // From delivery partner
        [userLocation.lat, userLocation.lng]           // To user
      ], {
        color: '#2196F3',    // Blue color
        weight: 4,           // Line thickness
        opacity: 0.8        // Transparency
      }).addTo(map);
      
      setRouteLine(line);
      
      // Adjust map view to show both markers
      const group = L.featureGroup([
        deliveryMarker || L.marker([deliveryLocation.lat, deliveryLocation.lng]), 
        userMarker || L.marker([userLocation.lat, userLocation.lng])
      ]);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  };

  // Update user marker when user location changes
  useEffect(() => {
    if (userLocation && map) {
      updateUserMarker(userLocation);
    }
  }, [userLocation, map]);

  // Update delivery marker when delivery location changes
  useEffect(() => {
    if (currentLocation && map) {
      updateDeliveryMarker(currentLocation);
    }
  }, [currentLocation, map]);

  // Load Leaflet library and initialize map
  useEffect(() => {
    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    
    // Load Leaflet JavaScript
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        setTimeout(initializeMap, 100);  // Initialize map after library loads
      };
      document.head.appendChild(script);
    } else {
      setTimeout(initializeMap, 100);    // Library already loaded
    }
  }, []);

  // Fetch order details from database
  const fetchOrderData = async () => {
    try {
      const apiUrl = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/orders/${orderId}/tracking`);
      const data = await response.json();
      
      if (data.success) {
        setOrderData(data.data);
        // If order has existing location, set it
        if (data.data.currentLocation && data.data.currentLocation.lat && data.data.currentLocation.lng) {
          setCurrentLocation(data.data.currentLocation);
        }
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create status timeline steps
  const getStatusSteps = () => {
    const steps = [
      { key: 'PLACED', label: 'Order Placed', icon: '📝' },
      { key: 'PREPARING', label: 'Preparing', icon: '👨🍳' },
      { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: '🚚' },
      { key: 'DELIVERED', label: 'Delivered', icon: '✅' }
    ];

    const statusOrder = ['PLACED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(orderData?.status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,  // Mark as completed if current or past
      active: index === currentIndex     // Mark as active if current step
    }));
  };

  // Loading and error states
  if (loading) return <div className="track-loading">Loading...</div>;
  if (!orderData) return <div className="track-error">Order not found</div>;

  return (
    <div className="track-order-page">
      <div className="track-container">
        {/* Page title and order ID */}
        <h1>Track Your Order</h1>
        <div className="order-id">Order ID: {orderId}</div>

        {/* Status timeline showing order progress */}
        <div className="status-timeline">
          {getStatusSteps().map((step, index) => (
            <div key={step.key} className={`timeline-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
              <div className="step-icon">{step.icon}</div>
              <div className="step-label">{step.label}</div>
              {index < getStatusSteps().length - 1 && <div className="step-line"></div>}
            </div>
          ))}
        </div>

        {/* Driver information (shows when driver is assigned) */}
        {orderData.driver && (
          <div className="driver-info">
            <h3>🚗 Delivery Partner</h3>
            <div>👤 {orderData.driver.name}</div>
            <div>📞 <a href={`tel:${orderData.driver.phone}`}>{orderData.driver.phone}</a></div>
            {orderData.driver.vehicleNumber && <div>🚗 {orderData.driver.vehicleNumber}</div>}
          </div>
        )}

        {/* Live tracking map */}
        <div className="map-container">
          <h3>📍 Live Tracking</h3>
          <div ref={mapRef} className="map"></div>
          {currentLocation && (
            <div className="location-info">
              <div>🚚 Delivery: {currentLocation.lat?.toFixed(6)}, {currentLocation.lng?.toFixed(6)}</div>
              <div>🕒 Updated: {new Date(currentLocation.updatedAt).toLocaleTimeString()}</div>
            </div>
          )}
        </div>

        {/* Control buttons */}
        <div className="refresh-section">
          <button onClick={() => window.location.reload()} className="refresh-btn">
            🔄 Refresh Tracking
          </button>
          <button onClick={simulateDeliveryLocation} className="test-btn">
            📍 Test Delivery Location
          </button>
        </div>
      </div>
    </div>
  );
}