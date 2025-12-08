import React from 'react';
import './StatCard.css';

export default function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="admin-stat-card">
      <div className="stat-card-header">
        <div className="admin-stat-card-title">{title}</div>
        {icon && <div className="stat-card-icon">{icon}</div>}
      </div>
      <div className="admin-stat-card-value">{value}</div>
      {subtitle && <div className="admin-stat-card-subtitle">{subtitle}</div>}
    </div>
  );
}
