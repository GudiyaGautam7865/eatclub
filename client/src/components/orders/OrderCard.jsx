import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderStatusBadge from './OrderStatusBadge';
import CancelOrderModal from './CancelOrderModal';
import { cancelOrder as cancelOrderAPI } from '../../services/ordersService';
import './OrderCard.css';

function formatDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const options = {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  const formatted = date.toLocaleDateString('en-US', options);
  return formatted;
}

export default function OrderCard({ order, onOrderUpdate }) {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  const {
    id,
    restaurantName,
    status,
    deliveryStatus,
    totalAmount,
    itemSummary,
    placedAt,
    deliveredAt,
    addressShort,
    acceptedAt,
    refundStatus,
    refundAmount,
  } = order;

  const isOngoing =
    status === 'PLACED' || status === 'ACCEPTED' || status === 'PREPARING' || 
    status === 'READY' || status === 'OUT_FOR_DELIVERY' || status === 'PAID';
  const isDelivered = status === 'DELIVERED';
  const isCancelled = status === 'CANCELLED';

  // Determine date/time string
  const dateTimeString = isDelivered
    ? `Delivered on ${formatDateTime(deliveredAt)}`
    : isCancelled
    ? `Cancelled on ${formatDateTime(order.cancelledAt || placedAt)}`
    : `Placed on ${formatDateTime(placedAt)}`;

  const handleCancelClick = () => {
    setShowCancelModal(true);
    setCancelMessage('');
  };

  const handleConfirmCancel = async () => {
    try {
      setCancelling(true);
      const response = await cancelOrderAPI(id);
      
      if (response.success) {
        setCancelMessage('Order cancelled successfully. Refund will be processed within 3-5 business days.');
        setShowCancelModal(false);
        
        // Refresh orders list
        if (onOrderUpdate) {
          setTimeout(() => {
            onOrderUpdate();
          }, 1000);
        }
      } else {
        setCancelMessage(response.message || 'Failed to cancel order');
        setShowCancelModal(false);
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      const errorMsg = error.message || 'Failed to cancel order. Please try again.';
      setCancelMessage(errorMsg);
      setShowCancelModal(false);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="order-card">
      {/* Top Row */}
      <div className="order-card-top">
        <h3 className="order-card-restaurant">{restaurantName}</h3>
        <div className="order-card-top-right">
          <OrderStatusBadge status={status} />
          <span className="order-card-amount">₹{totalAmount}</span>
        </div>
      </div>

      {/* Body */}
      <div className="order-card-body">
        <p className="order-card-items">{itemSummary}</p>
        <p className="order-card-id">Order ID: {id}</p>
        <p className="order-card-date">{dateTimeString}</p>
        {status === 'OUT_FOR_DELIVERY' && deliveryStatus && (
          <p className="order-card-substatus">Delivery status: {deliveryStatus.replace(/_/g, ' ')}</p>
        )}
        <p className="order-card-address">{addressShort}</p>
        
        {/* Show cancellation/refund message */}
        {cancelMessage && (
          <p className="order-card-cancel-message">{cancelMessage}</p>
        )}
        {isCancelled && refundStatus === 'PENDING' && (
          <p className="order-card-refund-message">
            Refund of ₹{refundAmount} will be processed within 3–5 business days
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="order-card-actions">
        {isOngoing && !isCancelled && (
          <>
            <button 
              className="order-btn-primary"
              onClick={() => navigate(`/track-order/${id}`)}
            >
              Track Order
            </button>
            <button 
              className="order-btn-secondary"
              onClick={handleCancelClick}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </>
        )}
        {isDelivered && (
          <>
            <button className="order-btn-primary">Reorder</button>
            <button className="order-btn-secondary">View Invoice</button>
            <button className="order-btn-text">Need help?</button>
          </>
        )}
        {isCancelled && (
          <button className="order-btn-primary">Order Again</button>
        )}
      </div>

      {/* Cancel Order Modal */}
      <CancelOrderModal 
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        loading={cancelling}
        orderStatus={status}
        acceptedAt={acceptedAt}
      />
    </div>
  );
}
