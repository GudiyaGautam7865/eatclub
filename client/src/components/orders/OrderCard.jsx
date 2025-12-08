import React from "react";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderCard({ order }) {
  const formatDate = (dateString, isDelivered = false) => {
    const date = new Date(dateString);
    const options = { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    };
    const formatted = date.toLocaleDateString('en-GB', options);
    const prefix = isDelivered ? "Delivered on" : "Placed on";
    return `${prefix} ${formatted}`;
  };

  const handleTrackOrder = () => {
    console.log("Track order:", order.id);
  };

  const handleCancelOrder = () => {
    console.log("Cancel order:", order.id);
  };

  const handleReorder = () => {
    console.log("Reorder:", order.id);
  };

  const handleViewInvoice = () => {
    console.log("View invoice:", order.id);
  };

  const handleNeedHelp = () => {
    console.log("Need help:", order.id);
  };

  const isOngoing = ["PLACED", "PREPARING", "OUT_FOR_DELIVERY"].includes(order.status);
  const isDelivered = order.status === "DELIVERED";

  return (
    <div className="order-card">
      <div className="order-card-header">
        <h3 className="order-restaurant-name">{order.restaurantName}</h3>
        <div className="order-header-right">
          <OrderStatusBadge status={order.status} />
          <span className="order-total">₹{order.totalAmount}</span>
        </div>
      </div>

      <div className="order-details">
        <p className="order-item-summary">{order.itemSummary}</p>
        <p className="order-id">Order ID: {order.id}</p>
        <p className="order-date">
          {formatDate(
            order.deliveredAt || order.placedAt, 
            !!order.deliveredAt
          )}
        </p>
        <p className="order-address">{order.addressShort}</p>
      </div>

      <div className="order-actions">
        {isOngoing && (
          <>
            <button className="order-btn-primary" onClick={handleTrackOrder}>
              Track Order
            </button>
            <button className="order-btn-ghost" onClick={handleCancelOrder}>
              Cancel Order
            </button>
          </>
        )}
        
        {isDelivered && (
          <>
            <button className="order-btn-primary" onClick={handleReorder}>
              Reorder
            </button>
            <button className="order-btn-ghost" onClick={handleViewInvoice}>
              View Invoice
            </button>
            <a href="#" className="order-help-link" onClick={handleNeedHelp}>
              Need help?
            </a>
          </>
        )}

        {order.status === "CANCELLED" && (
          <button className="order-btn-primary" onClick={handleReorder}>
            Reorder
          </button>
        )}
      </div>
    </div>
  );
}