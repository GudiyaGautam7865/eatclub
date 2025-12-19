import React, { useState } from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import './DeliveryEarnings.css';

const DeliveryEarnings = () => {
  const { earningsData } = useDelivery();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const periods = [
    { key: 'today', label: 'Today' },
    { key: 'weekly', label: 'This Week' },
    { key: 'monthly', label: 'This Month' }
  ];

  const currentData = earningsData[selectedPeriod];

  const earningsBreakdown = [
    {
      label: 'Delivery Fees',
      amount: currentData.deliveryFees,
      icon: '🚚',
      color: '#2196f3'
    },
    {
      label: 'Tips',
      amount: currentData.tips,
      icon: '💝',
      color: '#4caf50'
    },
    {
      label: 'Incentives',
      amount: currentData.incentives,
      icon: '🎯',
      color: '#ff9800'
    }
  ];

  return (
    <div className="delivery-earnings">
      <div className="earnings-header">
        <h1>My Earnings</h1>
        <p>Track your delivery earnings and performance</p>
      </div>

      <div className="period-selector">
        {periods.map(period => (
          <button
            key={period.key}
            className={`period-btn ${selectedPeriod === period.key ? 'active' : ''}`}
            onClick={() => setSelectedPeriod(period.key)}
          >
            {period.label}
          </button>
        ))}
      </div>

      <div className="earnings-summary">
        <div className="total-earnings-card">
          <div className="earnings-icon">💰</div>
          <div className="earnings-info">
            <h2>₹{currentData.totalEarnings}</h2>
            <p>Total Earnings ({periods.find(p => p.key === selectedPeriod)?.label})</p>
          </div>
          <div className="orders-count">
            <span className="count">{currentData.completedOrders}</span>
            <span className="label">Orders</span>
          </div>
        </div>
      </div>

      <div className="earnings-breakdown">
        <h3>Earnings Breakdown</h3>
        <div className="breakdown-grid">
          {earningsBreakdown.map((item, index) => (
            <div key={index} className="breakdown-card">
              <div 
                className="breakdown-icon"
                style={{ backgroundColor: `${item.color}20`, color: item.color }}
              >
                {item.icon}
              </div>
              <div className="breakdown-info">
                <h4>₹{item.amount}</h4>
                <p>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="earnings-details">
        <div className="performance-metrics">
          <h3>Performance Metrics</h3>
          <div className="metrics-list">
            <div className="metric-item">
              <span className="metric-label">Average per Order</span>
              <span className="metric-value">
                ₹{Math.round(currentData.totalEarnings / currentData.completedOrders)}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Delivery Fee per Order</span>
              <span className="metric-value">
                ₹{Math.round(currentData.deliveryFees / currentData.completedOrders)}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Average Tips</span>
              <span className="metric-value">
                ₹{Math.round(currentData.tips / currentData.completedOrders)}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Incentive Rate</span>
              <span className="metric-value">
                {Math.round((currentData.incentives / currentData.totalEarnings) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="earnings-tips">
          <h3>💡 Earning Tips</h3>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-icon">⚡</span>
              <div>
                <strong>Peak Hours</strong>
                <p>Work during lunch (12-2 PM) and dinner (7-10 PM) for higher earnings</p>
              </div>
            </div>
            <div className="tip-item">
              <span className="tip-icon">⭐</span>
              <div>
                <strong>Maintain Rating</strong>
                <p>Keep your rating above 4.5 to get more order assignments</p>
              </div>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🎯</span>
              <div>
                <strong>Complete Challenges</strong>
                <p>Finish daily/weekly challenges to earn bonus incentives</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryEarnings;