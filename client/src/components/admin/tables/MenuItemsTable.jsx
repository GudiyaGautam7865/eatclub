// src/components/admin/tables/MenuItemsTable.jsx
import React from 'react';
import './MenuItemsTable.css';

export default function MenuItemsTable({ items = [], onDelete = () => {}, onEdit = () => {} }) {
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const mongoId = item._id ?? item.id ?? `tmp-${index}`;
            const membership = item.membershipPrice ?? (item.price ? Math.round(item.price * 0.7) : '—');

            return (
              <tr key={mongoId}>
                <td>{index + 1}</td>
                <td>{item.name ?? '—'}</td>
                <td>{item.categoryName ?? item.categoryId ?? '—'}</td>
                <td>{item.brandName ?? item.brand ?? '—'}</td>
                <td>{item.price != null ? `₹${item.price}` : '—'}</td>
                <td>{membership !== '—' ? `₹${membership}` : '—'}</td>
                <td>
                  <span className={`type-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
                    {item.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                </td>

                <td>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name || 'item'}
                      className="item-image"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  ) : (
                    '—'
                  )}
                </td>

                <td>
                  <div className="action-icons" style={{ display: 'flex', gap: 8 }}>
                    <img
                      src="data:image/webp;base64,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"
                      alt="edit"
                      className="action-icon edit-icon"
                      style={{ width: 20, height: 20, cursor: 'pointer' }}
                      onClick={() => onEdit(item)}
                    />

                    <img
                      src="https://th.bing.com/th/id/OIP.brgvwyQT6gGfzM10xZmjJQHaHa?w=201&h=201&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
                      alt="delete"
                      className="action-icon delete-icon"
                      style={{ width: 20, height: 20, cursor: 'pointer' }}
                      onClick={() => onDelete(mongoId)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
