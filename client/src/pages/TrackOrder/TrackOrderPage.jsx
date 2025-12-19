import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TrackOrderPage.css';

export default function TrackOrderPage() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm on my way to pick up your order.", sender: 'delivery', time: '2:30 PM' },
    { id: 2, text: "Great! How long will it take?", sender: 'user', time: '2:31 PM' }
  ]);
  const [newMsg, setNewMsg] = useState('');
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const map = L.map(mapRef.current).setView([18.52, 73.86], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      L.marker([18.52, 73.86]).addTo(map).bindPopup('Restaurant');
      L.marker([18.53, 73.87]).addTo(map).bindPopup('Your Location');
      L.polyline([[18.52, 73.86], [18.53, 73.87]], {color: '#2196F3', weight: 0}).addTo(map);
    };
    document.head.appendChild(script);
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }, []);

  const sendMsg = () => {
    if (newMsg.trim()) {
      setMessages([...messages, { id: Date.now(), text: newMsg, sender: 'user', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) }]);
      setNewMsg('');
    }
  };

  return (
    <div className="track-page">
      <div className="map-side">
        <div className="map-header">
          <button onClick={() => navigate(-1)}>←</button>
          <span>Track Order</span>
        </div>
        <div ref={mapRef} className="map"></div>
      </div>
      
      <div className="info-side">
        {showChat && (
          <div className="chat">
            <div className="chat-header">
              <span>🚴 Rahul Sharma</span>
              <button onClick={() => setShowChat(false)}>×</button>
            </div>
          <div className="msgs">
            {messages.map(m => (
              <div key={m.id} className={`msg ${m.sender}`}>
                <div className="bubble">
                  <div>{m.text}</div> 
                  <small>{m.time}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="input">
            <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMsg()} placeholder="Type message..." />
            <button onClick={sendMsg}>Send</button>
          </div>
        </div>
        )}
        
        <div className="driver-card">
          <div className="avatar">🚴</div>
          <div className="info">
            <h3>Rahul Sharma</h3>
            <div>⭐⭐⭐⭐⭐ 4.8</div>
            <div>📍 Pickup → Drop</div>
            <div className="eta">ETA: 15-20 mins</div>
          </div>
          <div className="actions">
            <button>📞</button>
            <button onClick={() => setShowChat(true)}>💬</button>
          </div>
        </div>
        
        <div className="order-btns">
          <button className="cancel" onClick={() => confirm('Are you sure you want to cancel this order?') && alert('Order cancelled')}>Cancel Order</button>
          <button className="confirm" onClick={() => alert('Order confirmed!')}>Accept / Confirm</button>
        </div>
      </div>
    </div>
  );
}