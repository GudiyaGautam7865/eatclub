import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './DeliveryApp.css';

export default function DeliveryApp() {
  const [orderId, setOrderId] = useState('');
  const [socket, setSocket] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Delivery app connected');
    });

    return () => newSocket.disconnect();
  }, []);

  const startTracking = () => {
    if (!orderId) {
      alert('Please enter Order ID');
      return;
    }

    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          
          if (socket && orderId) {
            socket.emit('sendLocation', {
              orderId,
              lat: location.lat,
              lng: location.lng
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
      
      setWatchId(id);
      setIsTracking(true);
    } else {
      alert('Geolocation is not supported');
    }
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  };

  return (
    <div className="delivery-app">
      <div className="delivery-container">
        <h1>🚚 Delivery Partner App</h1>
        
        <div className="input-section">
          <input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="order-input"
          />
        </div>

        <div className="tracking-controls">
          {!isTracking ? (
            <button onClick={startTracking} className="start-btn">
              📍 Start Live Tracking
            </button>
          ) : (
            <button onClick={stopTracking} className="stop-btn">
              ⏹️ Stop Tracking
            </button>
          )}
        </div>

        {isTracking && (
          <div className="status-section">
            <div className="status-item">
              <span className="status-label">📡 Status:</span>
              <span className="status-active">Live Tracking Active</span>
            </div>
            <div className="status-item">
              <span className="status-label">📋 Order ID:</span>
              <span>{orderId}</span>
            </div>
            {currentLocation && (
              <>
                <div className="status-item">
                  <span className="status-label">📍 Latitude:</span>
                  <span>{currentLocation.lat.toFixed(6)}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">📍 Longitude:</span>
                  <span>{currentLocation.lng.toFixed(6)}</span>
                </div>
              </>
            )}
          </div>
        )}

        <div className="instructions">
          <h3>📋 Instructions:</h3>
          <ol>
            <li>Enter the Order ID you want to track</li>
            <li>Click "Start Live Tracking"</li>
            <li>Allow location access when prompted</li>
            <li>Your location will be sent to customers in real-time</li>
            <li>Move around to test live tracking</li>
          </ol>
        </div>
      </div>
    </div>
  );
}