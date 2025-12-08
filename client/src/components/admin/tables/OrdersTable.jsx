import React from 'react';
import './MenuItemsTable.css';

const dummySingleOrders = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    items: 3,
    total: 849,
    status: 'pending',
    date: '2025-12-08',
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    items: 2,
    total: 599,
    status: 'processing',
    date: '2025-12-08',
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Johnson',
    items: 4,
    total: 1199,
    status: 'completed',
    date: '2025-12-07',
  },
];

const dummyBulkOrders = [
  {
    id: 'BULK-001',
    companyName: 'ABC Corp',
    items: 50,
    total: 12500,
    status: 'pending',
    date: '2025-12-08',
  },
  {
    id: 'BULK-002',
    companyName: 'XYZ Ltd',
    items: 100,
    total: 24900,
    status: 'processing',
    date: '2025-12-08',
  },
];

export default function OrdersTable({ type = 'single', orders = null }) {
  const defaultOrders = type === 'single' ? dummySingleOrders : dummyBulkOrders;
  const dataToDisplay = orders || defaultOrders;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'processing':
        return '#2196f3';
      case 'completed':
        return '#4caf50';
      default:
        return '#999';
    }
  };

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>{type === 'single' ? 'Customer' : 'Company'}</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dataToDisplay.map((order) => (
            <tr key={order.id}>
              <td className="admin-table-id">{order.id}</td>
              <td>{type === 'single' ? order.customerName : order.companyName}</td>
              <td>{order.items}</td>
              <td>₹{order.total}</td>
              <td>
                <span
                  className="admin-status"
                  style={{
                    background: `${getStatusColor(order.status)}20`,
                    color: getStatusColor(order.status),
                  }}
                >
                  ● {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </td>
              <td>{order.date}</td>
              <td>
                <div className="admin-table-actions">
                  <button className="admin-table-btn">View</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
