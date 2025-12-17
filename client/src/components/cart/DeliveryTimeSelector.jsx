import React from 'react';

export default function DeliveryTimeSelector({
  activeSection,
  scheduledSlot,
  onOpenSchedule,
  onToggleDeliverNow,
  onContinue,
  isTimeValid = true,
  timeError = '',
}) {
  const isActive = activeSection === 'time';
  return (
    <div className={`delivery-time-card card ${isActive ? 'active' : ''}`}>
      <div className="card-title">Delivery Time</div>
      <div className="card-body delivery-body">
        <div>
          {!scheduledSlot ? (
            <span className="delivery-now">Deliver Now</span>
          ) : (
            <>
              <span className="delivery-later">Scheduled</span>
              <span className="muted" style={{ marginLeft: 8 }}>{scheduledSlot}</span>
              <button className="change-slot" onClick={onOpenSchedule}>Change</button>
            </>
          )}
        </div>
        <div>
          {!scheduledSlot ? (
            <button className="btn-primary" onClick={onOpenSchedule}>Schedule</button>
          ) : (
            <button className="btn-primary" onClick={onToggleDeliverNow}>Deliver Now</button>
          )}
        </div>
      </div>
      {!isTimeValid && timeError && (
        <div className="error-message">{timeError}</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <button className="btn-primary" onClick={onContinue} disabled={!isTimeValid}>Continue</button>
      </div>
    </div>
  );
}
