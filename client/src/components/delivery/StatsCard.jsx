import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, color = '#ff6b35', subtitle }) => {
  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <div className="stats-icon" style={{ backgroundColor: `${color}20`, color }}>
          {icon}
        </div>
        <div className="stats-info">
          <h3 className="stats-title">{title}</h3>
          <div className="stats-value">{value}</div>
          {subtitle && <div className="stats-subtitle">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;