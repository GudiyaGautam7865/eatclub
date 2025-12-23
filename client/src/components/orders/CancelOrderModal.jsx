import React from 'react';
import './CancelOrderModal.css';

/**
 * Calculate cancellation eligibility and message
 * @param {string} status - Current order status
 * @param {string} acceptedAt - Timestamp when order was accepted
 * @returns {object} - { canCancel, modalMessage, refundInfo }
 */
const getCancellationInfo = (status, acceptedAt) => {
  const currentTime = new Date();
  
  switch (status) {
    case 'PLACED':
      return {
        canCancel: true,
        modalMessage: 'You can cancel this order for free',
        refundInfo: 'Full refund will be processed',
      };
      
    case 'ACCEPTED':
      if (acceptedAt) {
        const diffMinutes = (currentTime - new Date(acceptedAt)) / 60000;
        if (diffMinutes <= 3) {
          return {
            canCancel: true,
            modalMessage: 'You can cancel this order for free',
            refundInfo: 'Full refund will be processed',
          };
        } else {
          return {
            canCancel: true,
            modalMessage: 'Restaurant has accepted your order. Partial refund will apply',
            refundInfo: '80% refund will be processed',
          };
        }
      }
      return {
        canCancel: true,
        modalMessage: 'You can cancel this order for free',
        refundInfo: 'Full refund will be processed',
      };
      
    case 'PREPARING':
      return {
        canCancel: true,
        modalMessage: 'Restaurant has started preparing your food. Partial refund may apply',
        refundInfo: '50% refund will be processed',
      };
      
    case 'READY':
    case 'READY_FOR_PICKUP':
    case 'OUT_FOR_DELIVERY':
    case 'DELIVERED':
      return {
        canCancel: false,
        modalMessage: 'This order can no longer be cancelled',
        refundInfo: 'No refund available at this stage',
      };
      
    default:
      return {
        canCancel: false,
        modalMessage: 'This order cannot be cancelled',
        refundInfo: '',
      };
  }
};

export default function CancelOrderModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading,
  orderStatus,
  acceptedAt,
}) {
  if (!isOpen) return null;

  const { canCancel, modalMessage, refundInfo } = getCancellationInfo(orderStatus, acceptedAt);

  return (
    <div className="cancel-modal-overlay" onClick={onClose}>
      <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cancel-modal-header">
          <h2 className="cancel-modal-title">Cancel Order?</h2>
          <button className="cancel-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="cancel-modal-body">
          <p className="cancel-modal-message">
            {modalMessage}
          </p>
          {canCancel && refundInfo && (
            <p className="cancel-modal-refund">
              {refundInfo}
            </p>
          )}
          {!canCancel && (
            <p className="cancel-modal-blocked">
              Your order is too far along in the process to be cancelled.
            </p>
          )}
        </div>
        
        <div className="cancel-modal-footer">
          <button 
            className="cancel-modal-btn cancel-modal-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Keep Order
          </button>
          {canCancel && (
            <button 
              className="cancel-modal-btn cancel-modal-btn-danger"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? 'Cancelling...' : 'Confirm Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
