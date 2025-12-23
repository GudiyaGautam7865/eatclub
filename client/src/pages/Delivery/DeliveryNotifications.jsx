import React from 'react';

const DeliveryNotifications = () => {
  const notifications = [
    { id: 1, title: 'New Order Assigned', message: 'Order #1234 has been assigned to you', time: '5 min ago', type: 'order' },
    { id: 2, title: 'Payment Received', message: 'Payment of ₹250 received for Order #1233', time: '1 hour ago', type: 'payment' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Notifications</h2>
      <div>
        {notifications.map(notification => (
          <div key={notification.id} style={{ padding: '15px', margin: '10px 0', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderLeft: '4px solid #6366f1' }}>
            <h4 style={{ margin: '0 0 5px 0' }}>{notification.title}</h4>
            <p style={{ margin: '0 0 5px 0', color: '#666' }}>{notification.message}</p>
            <small style={{ color: '#999' }}>{notification.time}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryNotifications;