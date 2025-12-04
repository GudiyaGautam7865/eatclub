import React, { useState, useEffect } from "react";
import "./ScheduleModal.css";

export default function ScheduleModal({ isOpen, onClose, onSchedule, initial }) {
  const [slot, setSlot] = useState(initial || "");

  useEffect(() => {
    if (isOpen) setSlot(initial || "");
  }, [isOpen, initial]);

  if (!isOpen) return null;

  const slots = [
    "03:00 PM - 03:30 PM",
    "03:30 PM - 04:00 PM",
    "04:00 PM - 04:30 PM",
    "04:30 PM - 05:00 PM",
    "05:00 PM - 05:30 PM",
    "05:30 PM - 06:00 PM",
  ];

  return (
    <div className="sc-modal-backdrop" onMouseDown={onClose}>
      <div className="sc-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="sc-close" onClick={onClose} aria-label="Close">×</button>
        <h3>Schedule For Later</h3>

        <label className="sc-label">DELIVER LATER</label>
        <div className="sc-select-wrap">
          <select value={slot} onChange={(e) => setSlot(e.target.value)}>
            <option value="" disabled>
              Select a time slot
            </option>
            {slots.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div style={{ textAlign: "center", marginTop: 18 }}>
          <button
            className="btn-primary sc-schedule"
            onClick={() => {
              if (!slot) return;
              onSchedule(slot);
            }}
          >
            SCHEDULE
          </button>
        </div>
      </div>
    </div>
  );
}
