import React, { useState } from 'react';

export default function AddressMapModal({ isOpen, onClose, onConfirm }) {
  const [address, setAddress] = useState('');
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, width: 360 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Add Address</div>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => { onConfirm && onConfirm(address || 'My Address'); }}>Use This</button>
        </div>
      </div>
    </div>
  );
}
