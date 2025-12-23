export const ORDER_TYPE = {
  SINGLE: 'SINGLE',
  BULK: 'BULK',
};

export const ORDER_STATUS = {
  REQUESTED: 'REQUESTED',
  REJECTED: 'REJECTED',
  ACCEPTED: 'ACCEPTED',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  PAID: 'PAID',
  SCHEDULED: 'SCHEDULED',
  ASSIGNED: 'ASSIGNED',
  PLACED: 'PLACED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const getOrderStatusBadge = (status) => {
  const badges = {
    [ORDER_STATUS.REQUESTED]: { color: '#FF9800', bg: '#FFF3E0', label: 'REQUESTED' },
    [ORDER_STATUS.REJECTED]: { color: '#F44336', bg: '#FFEBEE', label: 'REJECTED' },
    [ORDER_STATUS.ACCEPTED]: { color: '#4CAF50', bg: '#E8F5E9', label: 'ACCEPTED' },
    [ORDER_STATUS.PAYMENT_PENDING]: { color: '#FF9800', bg: '#FFF3E0', label: 'PAYMENT PENDING' },
    [ORDER_STATUS.PAID]: { color: '#4CAF50', bg: '#E8F5E9', label: 'PAID' },
    [ORDER_STATUS.SCHEDULED]: { color: '#2196F3', bg: '#E3F2FD', label: 'SCHEDULED' },
    [ORDER_STATUS.ASSIGNED]: { color: '#9C27B0', bg: '#F3E5F5', label: 'ASSIGNED' },
    [ORDER_STATUS.PLACED]: { color: '#2196F3', bg: '#E3F2FD', label: 'PLACED' },
    [ORDER_STATUS.PREPARING]: { color: '#FF9800', bg: '#FFF3E0', label: 'PREPARING' },
    [ORDER_STATUS.READY]: { color: '#4CAF50', bg: '#E8F5E9', label: 'READY' },
    [ORDER_STATUS.READY_FOR_PICKUP]: { color: '#4CAF50', bg: '#E8F5E9', label: 'READY FOR PICKUP' },
    [ORDER_STATUS.OUT_FOR_DELIVERY]: { color: '#9C27B0', bg: '#F3E5F5', label: 'OUT FOR DELIVERY' },
    [ORDER_STATUS.DELIVERED]: { color: '#4CAF50', bg: '#E8F5E9', label: 'DELIVERED' },
    [ORDER_STATUS.CANCELLED]: { color: '#F44336', bg: '#FFEBEE', label: 'CANCELLED' },
  };
  return badges[status] || { color: '#757575', bg: '#F5F5F5', label: status };
};

export const getBulkOrderStatusMessage = (status, bulkDetails) => {
  const messages = {
    [ORDER_STATUS.REQUESTED]: {
      icon: '⏳',
      title: 'Waiting for Admin Approval',
      message: 'Your bulk order request is under review. You\'ll be notified once pricing is confirmed.',
    },
    [ORDER_STATUS.REJECTED]: {
      icon: '❌',
      title: 'Order Rejected',
      message: 'Unfortunately, your bulk order request was rejected.',
    },
    [ORDER_STATUS.ACCEPTED]: {
      icon: '✅',
      title: 'Order Approved!',
      message: 'Your bulk order has been confirmed. Please proceed with payment to confirm.',
    },
    [ORDER_STATUS.PAID]: {
      icon: '💳',
      title: 'Payment Successful!',
      message: `Your bulk order is confirmed. Scheduled for: ${bulkDetails?.scheduledDate ? new Date(bulkDetails.scheduledDate).toLocaleDateString() : 'TBD'}`,
    },
    [ORDER_STATUS.SCHEDULED]: {
      icon: '📅',
      title: 'Order Scheduled',
      message: `Delivery Date: ${bulkDetails?.scheduledDate ? new Date(bulkDetails.scheduledDate).toLocaleDateString() : 'TBD'}. Your order will be prepared fresh on the scheduled date.`,
    },
    [ORDER_STATUS.ASSIGNED]: {
      icon: '👤',
      title: 'Delivery Partner Assigned',
      message: `${bulkDetails?.deliveryBoyName || 'Delivery partner'} will deliver your order.`,
    },
    [ORDER_STATUS.OUT_FOR_DELIVERY]: {
      icon: '🚴',
      title: 'On the Way!',
      message: 'Your bulk order is out for delivery.',
    },
    [ORDER_STATUS.DELIVERED]: {
      icon: '✅',
      title: 'Order Delivered Successfully!',
      message: 'Thank you for choosing EatClub! Hope your event was a success! 🎉',
    },
    [ORDER_STATUS.CANCELLED]: {
      icon: '❌',
      title: 'Order Cancelled',
      message: 'This order has been cancelled.',
    },
  };
  return messages[status] || { icon: '📦', title: status, message: '' };
};

export const getOrderTypeBadge = (orderType) => {
  if (orderType === ORDER_TYPE.BULK) {
    return {
      label: 'BULK',
      icon: '🎉',
      color: '#7B1FA2',
      bg: '#F3E5F5',
    };
  }
  return {
    label: 'SINGLE',
    icon: '🛒',
    color: '#1976D2',
    bg: '#E3F2FD',
  };
};

export const canCancelBulkOrder = (status) => {
  return [ORDER_STATUS.REQUESTED, ORDER_STATUS.ACCEPTED].includes(status);
};

export const canPayBulkOrder = (status) => {
  return status === ORDER_STATUS.ACCEPTED;
};

export const formatScheduledDateTime = (date, time) => {
  if (!date) return 'TBD';
  const dateObj = new Date(date);
  const dateStr = dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return time ? `${dateStr}, ${time}` : dateStr;
};
