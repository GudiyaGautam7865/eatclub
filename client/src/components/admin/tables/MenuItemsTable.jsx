import React from 'react';
import './MenuItemsTable.css';

const dummyMenuItems = [
  {
    id: 1,
    name: 'Butter Chicken',
    category: 'Curries',
    price: 299,
    status: 'active',
  },
  {
    id: 2,
    name: 'Paneer Tikka Masala',
    category: 'Curries',
    price: 279,
    status: 'active',
  },
  {
    id: 3,
    name: 'Chicken Biryani',
    category: 'Rice',
    price: 349,
    status: 'active',
  },
  {
    id: 4,
    name: 'Dal Makhani',
    category: 'Curries',
    price: 229,
    status: 'inactive',
  },
  {
    id: 5,
    name: 'Garlic Naan',
    category: 'Breads',
    price: 69,
    status: 'active',
  },
];

export default function MenuItemsTable({ items = dummyMenuItems }) {
  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="admin-table-name">{item.name}</td>
              <td>{item.category}</td>
              <td>₹{item.price}</td>
              <td>
                <span
                  className={`admin-status ${
                    item.status === 'active' ? 'active' : 'inactive'
                  }`}
                >
                  ● {item.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <div className="admin-table-actions">
                  <button className="admin-table-btn">Edit</button>
                  <button className="admin-table-btn delete">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
