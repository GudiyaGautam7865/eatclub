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
 <div className="menu-table-wrapper">
  <table className="menu-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Item</th>
        <th>Category</th>
        <th>Brand</th>
        <th>Price</th>
        <th>Member</th>
        <th>Type</th>
        <th>Image</th>
        <th></th>
      </tr>
    </thead>

    <tbody>
      {items.map((item, index) => {
        const id = item._id ?? item.id ?? index;
        const memberPrice =
          item.membershipPrice ??
          (item.price ? Math.round(item.price * 0.7) : null);

        return (
          <tr key={id}>
            <td className="id">{index + 1}</td>

            <td>
              <div className="item-name">{item.name}</div>
            </td>

            <td>{item.categoryName || "—"}</td>
            <td>{item.brandName || "—"}</td>

            <td className="price">₹{item.price}</td>
            <td className="member">₹{memberPrice ?? "—"}</td>

            <td>
              <span className={`badge ${item.isVeg ? "veg" : "nonveg"}`}>
                {item.isVeg ? "Veg" : "Non-Veg"}
              </span>
            </td>

            <td>
              {item.imageUrl ? (
                <img src={item.imageUrl} className="preview-img" />
              ) : (
                "—"
              )}
            </td>

            <td>
              <div className="actions">
                <span className="icon edit" onClick={() => onEdit(item)}>✏️</span>
                <span className="icon delete" onClick={() => onDelete(id)}>🗑</span>
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
