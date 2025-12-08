import React from 'react';
import './TopItemsTable.css';

const topItems = [
  { rank: 1, name: 'Butter Chicken', category: 'Main Course', orders: 245, revenue: '₹98,000', trend: '+12%' },
  { rank: 2, name: 'Paneer Tikka', category: 'Appetizers', orders: 198, revenue: '₹59,400', trend: '+8%' },
  { rank: 3, name: 'Biryani Special', category: 'Main Course', orders: 187, revenue: '₹74,800', trend: '+15%' },
  { rank: 4, name: 'Gulab Jamun', category: 'Desserts', orders: 156, revenue: '₹23,400', trend: '+5%' },
  { rank: 5, name: 'Masala Dosa', category: 'Main Course', orders: 142, revenue: '₹42,600', trend: '+10%' },
];

export default function TopItemsTable() {
  return (
    <div className="top-items-table-container">
      <table className="top-items-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Orders</th>
            <th>Revenue</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {topItems.map((item) => (
            <tr key={item.rank}>
              <td>
                <span className={`rank-badge rank-${item.rank}`}>#{item.rank}</span>
              </td>
              <td className="item-name">{item.name}</td>
              <td>
                <span className="category-badge">{item.category}</span>
              </td>
              <td className="orders-count">{item.orders}</td>
              <td className="revenue-amount">{item.revenue}</td>
              <td>
                <span className="trend-positive">{item.trend}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
