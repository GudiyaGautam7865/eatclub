import React from 'react';
import './TopItemsTable.css';

export default function TopItemsTable({ items = [] }) {
  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  const displayItems = items.length > 0 ? items : [
    { rank: 1, name: 'Butter Chicken', category: 'Main Course', orders: 245, revenue: 98000, trend: '+12%' },
    { rank: 2, name: 'Paneer Tikka', category: 'Appetizers', orders: 198, revenue: 59400, trend: '+8%' },
    { rank: 3, name: 'Biryani Special', category: 'Main Course', orders: 187, revenue: 74800, trend: '+15%' },
    { rank: 4, name: 'Gulab Jamun', category: 'Desserts', orders: 156, revenue: 23400, trend: '+5%' },
    { rank: 5, name: 'Masala Dosa', category: 'Main Course', orders: 142, revenue: 42600, trend: '+10%' },
  ];

  return (
    <div className="top-items-table-container">
      <table className="top-items-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Item Name</th>
            <th>Orders</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.map((item, idx) => (
            <tr key={idx}>
              <td>
                <span className={`rank-badge rank-${idx + 1}`}>#{idx + 1}</span>
              </td>
              <td className="item-name">{item.name}</td>
              <td className="orders-count">{item.sales || item.orders}</td>
              <td className="revenue-amount">{formatCurrency(item.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
