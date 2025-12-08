import React from 'react';
import './QuickStats.css';

export default function QuickStats() {
  const stats = [
    { label: 'Avg Order Value', value: '₹425', change: '+5.2%', positive: true },
    { label: 'Customer Satisfaction', value: '4.8/5', change: '+0.3', positive: true },
    { label: 'Delivery Time', value: '28 min', change: '-2 min', positive: true },
    { label: 'Return Rate', value: '2.1%', change: '-0.5%', positive: true },
  ];

  return (
    <div className="quick-stats-container">
      {stats.map((stat, index) => (
        <div key={index} className="quick-stat-item">
          <div className="quick-stat-label">{stat.label}</div>
          <div className="quick-stat-value">{stat.value}</div>
          <div className={`quick-stat-change ${stat.positive ? 'positive' : 'negative'}`}>
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  );
}
