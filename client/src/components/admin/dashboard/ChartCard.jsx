import React from 'react';
import './ChartCard.css';

export default function ChartCard({ title, children }) {
  return (
    <div className="admin-chart-card">
      <div className="admin-chart-card-title">{title}</div>
      <div className="admin-chart-card-content">
        {children || 'Chart goes here'}
      </div>
    </div>
  );
}
