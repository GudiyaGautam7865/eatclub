import React from 'react';
import './StatCard.css';

export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-card-title">{title}</div>
      <div className="admin-stat-card-value">{value}</div>
      {subtitle && <div className="admin-stat-card-subtitle">{subtitle}</div>}
    </div>
  );
}
