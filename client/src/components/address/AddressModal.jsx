import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './AddressModal.css';

export default function AddressModal({
  isOpen,
  mode = 'add',
  initialData = {},
  onSave,
  onClose,
  onUseCurrentLocation,
  onDelete,
}) {
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('Home');
  const [type, setType] = useState('Home');
  const [flat, setFlat] = useState('');
  const [floor, setFloor] = useState('');
  const [landmark, setLandmark] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setAddress(initialData.address || '');
    setLabel(initialData.label || initialData.type || 'Home');
    setType(initialData.type || initialData.label || 'Home');
    setFlat(initialData.flat || '');
    setFloor(initialData.floor || '');
    setLandmark(initialData.landmark || '');
    setLatitude(initialData.latitude ?? null);
    setLongitude(initialData.longitude ?? null);
    setError('');
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!address.trim()) {
      setError('Address is required');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSave?.({
        address: address.trim(),
        label: label || type || 'Address',
        type: type || label || 'Other',
        flat: flat.trim(),
        floor: floor.trim(),
        landmark: landmark.trim(),
        latitude,
        longitude,
      });
    } catch (err) {
      setError(err?.message || 'Unable to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!onUseCurrentLocation) return;
    setGeoLoading(true);
    setError('');
    try {
      const { address: detected, latitude: lat, longitude: lng } = await onUseCurrentLocation();
      if (detected) setAddress(detected);
      setLatitude(lat ?? null);
      setLongitude(lng ?? null);
      // Prefill sensible defaults for label/type and landmark when using geolocation
      setType('Other');
      setLabel('Current Location');
      if (!landmark) setLandmark('Detected via GPS');
    } catch (err) {
      setError(err?.message || 'Unable to fetch current location');
    } finally {
      setGeoLoading(false);
    }
  };

  const overlay = (
    <div className="addr-modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="addr-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="addr-modal-header">
          <div className="addr-modal-title">{mode === 'edit' ? 'Edit Address' : 'Add Address'}</div>
          <div className="addr-modal-actions">
            <button className="addr-close" onClick={onClose} aria-label="Close">×</button>
          </div>
        </div>

        {onUseCurrentLocation && (
          <button
            className="addr-geo-btn"
            onClick={handleUseCurrentLocation}
            disabled={geoLoading || saving}
          >
            {geoLoading ? 'Detecting location…' : 'Use my current location'}
          </button>
        )}

        <div className="addr-field">
          <label>Saved as</label>
          <div className="addr-chip-row">
            {['Home', 'Work', 'Other'].map((opt) => (
              <button
                key={opt}
                type="button"
                className={`addr-chip ${type === opt ? 'active' : ''}`}
                onClick={() => { setType(opt); setLabel(opt); }}
                disabled={saving}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="addr-field">
          <label>Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Flat / Street / Area / City"
            rows={3}
            disabled={saving}
          />
        </div>

        <div className="addr-row">
          <div className="addr-field half">
            <label>Flat / House number</label>
            <input
              value={flat}
              onChange={(e) => setFlat(e.target.value)}
              placeholder="Eg: 212, Prestige Flora"
              disabled={saving}
            />
          </div>
          <div className="addr-field half">
            <label>Floor / Block (optional)</label>
            <input
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="Eg: 2nd Floor, A Block"
              disabled={saving}
            />
          </div>
        </div>

        <div className="addr-field">
          <label>Landmark / Direction (optional)</label>
          <input
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="Eg: Near park or hospital"
            disabled={saving}
          />
        </div>

        {error && <div className="addr-error">{error}</div>}

        <div className="addr-actions">
          <button className="addr-btn secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="addr-btn primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Address'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
