import React from 'react';
import './DeliveryBoyStatsCard.css';

export default function DeliveryBoyStatsCard({ title, value, subtitle, icon, color = 'blue' }) {
  return (
    <div className={`delivery-stats-card stats-card-${color}`}>
      <div className="stats-card-header">
        <div className="stats-card-icon">
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