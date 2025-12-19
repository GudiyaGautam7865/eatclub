import React, { useEffect, useState } from 'react';

export default function AddressFormModal({
  isOpen,
  onClose,
  initialAddress = '',
  onSave,
  saving = false,
}) {
  const [address, setAddress] = useState(initialAddress || '');
  const [label, setLabel] = useState('Home');
  const [type, setType] = useState('Home');
  const [flat, setFlat] = useState('');
  const [floor, setFloor] = useState('');
  const [landmark, setLandmark] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setAddress(initialAddress || '');
  }, [initialAddress]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!address.trim()) {
      setError('Address is required');
      return;
    }
    setError('');
    onSave?.({ address: address.trim(), label, type, flat, floor, landmark });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, width: 400 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Confirm Address</div>

        <label style={{ display: 'block', fontSize: 12, color: '#444', marginBottom: 4 }}>Saved as</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {['Home', 'Work', 'Other'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { setType(opt); setLabel(opt); }}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 8,
                border: type === opt ? '2px solid #111' : '1px solid #ddd',
                background: type === opt ? '#f5f5f5' : '#fff',
                cursor: 'pointer',
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        <label style={{ display: 'block', fontSize: 12, color: '#444', marginBottom: 4 }}>Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Full address"
          rows={4}
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', marginBottom: 12 }}
        />

        <label style={{ display: 'block', fontSize: 12, color: '#444', marginBottom: 4 }}>Flat / House number</label>
        <input
          value={flat}
          onChange={(e) => setFlat(e.target.value)}
          placeholder="Eg: 212, Prestige Flora"
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', marginBottom: 10 }}
        />

        <label style={{ display: 'block', fontSize: 12, color: '#444', marginBottom: 4 }}>Floor / Block (optional)</label>
        <input
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          placeholder="Eg: 2nd Floor, A Block"
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', marginBottom: 10 }}
        />

        <label style={{ display: 'block', fontSize: 12, color: '#444', marginBottom: 4 }}>Landmark / Direction (optional)</label>
        <input
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          placeholder="Eg: Yellow building, Near park"
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', marginBottom: 10 }}
        />

        {error && <div style={{ color: '#d00', fontSize: 12, marginBottom: 10 }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button onClick={onClose} disabled={saving} style={{ padding: '8px 12px' }}>Close</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '8px 12px' }}>
            {saving ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      </div>
    </div>
  );
}
