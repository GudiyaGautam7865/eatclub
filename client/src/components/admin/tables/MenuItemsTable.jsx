import React from 'react';
import './MenuItemsTable.css';

export default function MenuItemsTable({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <p>No menu items found</p>
      </div>
    );
  }

  return (
    <div className="menu-items-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Membership Price</th>
            <th>Type</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.categoryId}</td>
              <td>{item.brand}</td>
              <td>₹{item.price}</td>
              <td>₹{item.membershipPrice || Math.round(item.price * 0.7)}</td>
              <td>
                <span className={`type-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
                  {item.isVeg ? 'Veg' : 'Non-Veg'}
                </span>
              </td>
              <td>
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="item-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}