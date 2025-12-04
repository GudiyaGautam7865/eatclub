import React, { useState } from 'react';
import './AddressMapModal.css';

export default function AddressMapModal({ isOpen, onClose, onConfirm }) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  // In a real app we'd integrate Google Maps / Places. Here we simulate selection.
  const mockPlace = () => {
    return 'Ganesham Phase Building-G2, Sai Nagar Park, Pimple Saudagar, Pimpri-Chinchwad, Maharashtra 411027, India';
  };

  return (
    <div className="am-backdrop" onMouseDown={onClose}>
      <div className="am-modal" onMouseDown={e => e.stopPropagation()}>
        <button className="am-close" onClick={onClose}>×</button>
        <h3>Choose Delivery Location</h3>

        <div className="am-search">
          <input placeholder="Search for area, street name etc." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>

        <div className="am-map">{/* placeholder map area */}
          <div className="am-pin">📍</div>
        </div>

        <div className="am-actions">
          <button className="btn-secondary" onClick={() => { onConfirm(mockPlace()); }}>Use Current Location</button>
          <button className="btn-primary" onClick={() => { onConfirm(mockPlace()); }}>Confirm Location</button>
        </div>
      </div>
    </div>
  );
}
