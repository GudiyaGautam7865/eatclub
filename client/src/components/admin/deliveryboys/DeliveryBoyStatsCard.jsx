import React from 'react';
import './DeliveryBoyStatsCard.css';

export default function DeliveryBoyStatsCard({ title, value, subtitle, icon, color = 'blue' }) {
  return (
    <div className={`delivery-stats-card stats-card-${color}`} style={{border: 'none', outline: 'none', boxShadow: 'none'}}>
      <div className="stats-card-header" style={{border: 'none', outline: 'none'}}>
        <div className="stats-card-icon" style={{border: 'none', outline: 'none'}}>
          {icon}
        </div>
        <div className="stats-card-title">{title}</div>
      </div>
      
      <div className="stats-card-value">{value}</div>
      
      {subtitle && (
        <div className="stats-card-subtitle">{subtitle}</div>
      )}
    </div>
  );
}