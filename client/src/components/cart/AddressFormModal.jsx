import React, { useState, useEffect } from 'react';

export default function AddressFormModal({ isOpen, onClose, initialAddress = '' }) {
  const [address, setAddress] = useState(initialAddress);
  useEffect(() => { setAddress(initialAddress || ''); }, [initialAddress]);
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, width: 360 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Confirm Address</div>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Full address"
          rows={4}
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
