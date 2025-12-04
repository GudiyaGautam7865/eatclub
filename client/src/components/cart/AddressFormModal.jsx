import React, { useState } from 'react';
import './AddressFormModal.css';

export default function AddressFormModal({ isOpen, onClose, initialAddress, onSave }) {
  const [flat, setFlat] = useState('');
  const [floor, setFloor] = useState('');
  const [landmark, setLandmark] = useState('');
  const [tag, setTag] = useState('Other');
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    // validate: if tag is Other then customName required
    if (tag === 'Other' && !customName.trim()) {
      alert('Please provide a custom name for this address.');
      return;
    }

    const address = {
      id: Date.now(),
      label: tag === 'Other' ? customName.trim() : tag,
      title: initialAddress.split(',')[0] || initialAddress,
      text: `${flat ? flat + ', ' : ''}${floor ? floor + ', ' : ''}${landmark ? landmark + ', ' : ''}${initialAddress}`,
    };

    onSave(address);
  };

  return (
    <div className="af-backdrop" onMouseDown={onClose}>
      <div className="af-modal" onMouseDown={e=>e.stopPropagation()}>
        <button className="af-close" onClick={onClose}>×</button>
        <h3>{initialAddress}</h3>

        <div className="af-form">
          <label>FLAT / HOUSE NUMBER, NAME OF BUILDING ETC.</label>
          <input placeholder="Eg: 212, Prestige Flora" value={flat} onChange={e=>setFlat(e.target.value)} />

          <label>FLOOR / BLOCK (OPTIONAL)</label>
          <input placeholder="Eg: 2nd Floor, A Block" value={floor} onChange={e=>setFloor(e.target.value)} />

          <label>LANDMARK / DIRECTION TO REACH (OPTIONAL)</label>
          <input placeholder="Eg: Yellow building, Near CV Raman Hospital" value={landmark} onChange={e=>setLandmark(e.target.value)} />

          <div className="af-tags">
            <div className={`af-tag ${tag==='Home'?'active':''}`} onClick={()=>setTag('Home')}>Home</div>
            <div className={`af-tag ${tag==='Work'?'active':''}`} onClick={()=>setTag('Work')}>Work</div>
            <div className={`af-tag ${tag==='Other'?'active':''}`} onClick={()=>setTag('Other')}>Other</div>
          </div>

          {tag === 'Other' && (
            <>
              <label>CUSTOM NAME</label>
              <input placeholder="Enter custom name" value={customName} onChange={e=>setCustomName(e.target.value)} />
            </>
          )}

          <button className="btn-primary af-save" onClick={handleSave}>Save & Proceed</button>
        </div>
      </div>
    </div>
  );
}
