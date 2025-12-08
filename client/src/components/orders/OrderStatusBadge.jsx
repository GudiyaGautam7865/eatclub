import React from "react";

export default function OrderStatusBadge({ status }) {
  const getStatusLabel = (status) => {
    switch (status) {
      case "PLACED":
        return "Placed";
      case "PREPARING":
        return "Preparing";
      case "OUT_FOR_DELIVERY":
        return "Out for Delivery";
      case "DELIVERED":
        return "Delivered";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
      case "PREPARING":
        return "order-status-badge--placed";
      case "OUT_FOR_DELIVERY":
        return "order-status-badge--out-for-delivery";
      case "DELIVERED":
        return "order-status-badge--delivered";
      case "CANCELLED":
        return "order-status-badge--cancelled";
      default:
        return "order-status-badge--placed";
    }
  };

  return (
    <span className={`order-status-badge ${getStatusClass(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}