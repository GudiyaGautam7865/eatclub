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

  // For bulk orders type
  if (type === 'bulk') {
    const dataToDisplay = orders || dummyBulkOrders;

    return (
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>People</th>
              <th>Event Date & Time</th>
              <th>Brand</th>
              <th>Budget/Head</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataToDisplay && dataToDisplay.length > 0 ? (
              dataToDisplay.map((order) => {
                // Format createdAt date
                let formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
                let formattedEventDate = order.eventDateTime ? new Date(order.eventDateTime).toLocaleString() : 'N/A';

                return (
                  <tr key={order.id}>
                    <td className="admin-table-id">{order.id}</td>
                    <td>{order.name || 'N/A'}</td>
                    <td>{order.phone || 'N/A'}</td>
                    <td>{order.peopleCount || 'N/A'}</td>
                    <td>{formattedEventDate}</td>
                    <td>{order.brandPreference || 'Any'}</td>
                    <td>₹{order.budgetPerHead || '0'}</td>
                    <td>{formattedDate}</td>
                    <td>
                      <span
                        className="admin-status"
                        style={{
                          background: `${getStatusColor(order.status)}20`,
                          color: getStatusColor(order.status),
                        }}
                      >
                        ● {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="admin-table-btn">View</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No bulk orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // For single orders type (default)
  if (type === 'single') {
    const dataToDisplay = orders || dummySingleOrders;

    return (
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Amount</th>
              <th>Items Count</th>
              <th>Payment Method</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataToDisplay && dataToDisplay.length > 0 ? (
              dataToDisplay.map((order) => {
                // Format date
                let formattedDate = order.date ? new Date(order.date).toLocaleDateString() : 'N/A';
                // Handle items count - could be a number (dummy data) or array (real data)
                const itemsCount = order.itemsCount || 
                  (Array.isArray(order.items) ? order.items.reduce((sum, item) => sum + (item.qty || 1), 0) : order.items || 0);

                return (
                  <tr key={order.id}>
                    <td className="admin-table-id">{order.id}</td>
                    <td>₹{order.totalAmount || '0'}</td>
                    <td>{itemsCount}</td>
                    <td>{order.paymentMethod || 'COD'}</td>
                    <td>{formattedDate}</td>
                    <td>
                      <span
                        className="admin-status"
                        style={{
                          background: `${getStatusColor(order.status)}20`,
                          color: getStatusColor(order.status),
                        }}
                      >
                        ● {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="admin-table-btn">View</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No single orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
