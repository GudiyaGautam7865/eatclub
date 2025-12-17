import React, { useState } from 'react';

export default function ScheduleModal({ isOpen, onClose, onSchedule, initial }) {
  const [slot, setSlot] = useState(initial || 'Today, 7:00 PM - 8:00 PM');
  if (!isOpen) return null;
  const slots = [
    'Today, 7:00 PM - 8:00 PM',
    'Today, 8:00 PM - 9:00 PM',
    'Tomorrow, 12:00 PM - 1:00 PM',
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, width: 320 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Schedule Delivery</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {slots.map(s => (
            <label key={s} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="radio" name="slot" checked={slot === s} onChange={() => setSlot(s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => { onSchedule && onSchedule(slot); }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
