import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { approveBulkOrder, rejectBulkOrder } from '../../../services/adminOrdersService';
import Toast from '../../../components/common/Toast';
import { Check, X, Phone, Mail, Users, Calendar, MapPin, DollarSign, Loader } from 'lucide-react';
import './BulkOrderDetailsPage.css';

export default function BulkOrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [pricingForm, setPricingForm] = useState({
    totalAmount: '',
    perHeadPrice: '',
    discount: '',
    notes: '',
  });
  const [rejectionReason, setRejectionReason] = useState('');

  // Load order details
  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/orders/bulk/${orderId}`);
        if (!response.ok) throw new Error('Failed to load order');
        const data = await response.json();
        setOrder(data.data || data);
      } catch (error) {
        setToast({ message: error.message || 'Failed to load order', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [orderId]);

  const handleApprove = () => {
    if (!order) return;
    setPricingForm({
      totalAmount: order.budgetPerHead ? (order.budgetPerHead * order.peopleCount) : '',
      perHeadPrice: order.budgetPerHead || '',
      discount: '',
      notes: '',
    });
    setShowApprovalModal(true);
  };

  const handleReject = () => {
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const submitApproval = async () => {
    if (!order) return;
    if (!pricingForm.totalAmount || !pricingForm.perHeadPrice) {
      setToast({ message: 'Total Amount and Price Per Head are required', type: 'error' });
      return;
    }

    try {
      setActionLoading(true);
      await approveBulkOrder(order._id || order.id, pricingForm);
      setToast({ message: 'Bulk order approved successfully', type: 'success' });
      setShowApprovalModal(false);
      // Reload order
      const response = await fetch(`/api/admin/orders/bulk/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.data || data);
      }
    } catch (error) {
      setToast({ message: error?.message || 'Failed to approve order', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const submitRejection = async () => {
    if (!order) return;
    if (!rejectionReason.trim()) {
      setToast({ message: 'Please provide a rejection reason', type: 'error' });
      return;
    }

    try {
      setActionLoading(true);
      await rejectBulkOrder(order._id || order.id, rejectionReason);
      setToast({ message: 'Bulk order rejected successfully', type: 'success' });
      setShowRejectionModal(false);
      // Reload order
      const response = await fetch(`/api/admin/orders/bulk/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.data || data);
      }
    } catch (error) {
      setToast({ message: error?.message || 'Failed to reject order', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bulk-order-details-container">
        <div className="loading-spinner">
          <Loader size={32} className="spinner-icon" />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bulk-order-details-container">
        <div className="error-message">
          <p>Order not found</p>
          <button onClick={() => navigate('/admin/orders/bulk')} className="back-btn">
            Back to Bulk Orders
          </button>
        </div>
      </div>
    );
  }

  const totalItemsQty = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + (item.qty || 0), 0)
    : 0;

  const itemsTotal = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + (item.price * item.qty || 0), 0)
    : 0;

  const displayTotal = order.customPricing?.totalAmount || itemsTotal || order.budgetPerHead * order.peopleCount || 0;

  return (
    <div className="bulk-order-details-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="bulk-order-details-header">
        <button className="back-button" onClick={() => navigate('/admin/orders/bulk')}>
          ← Back to Bulk Orders
        </button>
        <h1 className="order-title">Bulk Order {order._id?.substring(0, 8) || order.id?.substring(0, 8)}</h1>
        <div className={`status-badge status-${order.approvalStatus?.toLowerCase()}`}>
          {order.approvalStatus || 'PENDING'}
        </div>
      </div>

      <div className="bulk-order-details-content">
        {/* Left Column - Order Details */}
        <div className="details-left">
          {/* Customer Information */}
          <div className="details-section">
            <h2 className="section-title">Customer Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <p>{order.name || '—'}</p>
              </div>
              <div className="info-item">
                <div className="info-with-icon">
                  <Phone size={16} />
                  <label>Phone</label>
                </div>
                <p>{order.phone || '—'}</p>
              </div>
              <div className="info-item">
                <div className="info-with-icon">
                  <Mail size={16} />
                  <label>Email</label>
                </div>
                <p>{order.email || '—'}</p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="details-section">
            <h2 className="section-title">Event Details</h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-with-icon">
                  <Users size={16} />
                  <label>Number of People</label>
                </div>
                <p>{order.peopleCount || 0}</p>
              </div>
              <div className="info-item">
                <div className="info-with-icon">
                  <Calendar size={16} />
                  <label>Event Date & Time</label>
                </div>
                <p>
                  {order.eventDateTime
                    ? new Date(order.eventDateTime).toLocaleString()
                    : '—'}
                </p>
              </div>
              <div className="info-item">
                <div className="info-with-icon">
                  <MapPin size={16} />
                  <label>Delivery Address</label>
                </div>
                <p>{order.address || '—'}</p>
              </div>
            </div>
          </div>

          {/* Preferences & Budget */}
          <div className="details-section">
            <h2 className="section-title">Preferences & Budget</h2>
            <div className="info-grid">
              {order.brandPreference && (
                <div className="info-item">
                  <label>Brand Preference</label>
                  <p>{order.brandPreference}</p>
                </div>
              )}
              {order.budgetPerHead && (
                <div className="info-item">
                  <div className="info-with-icon">
                    <DollarSign size={16} />
                    <label>Budget Per Head</label>
                  </div>
                  <p>₹{order.budgetPerHead}</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="details-section">
              <h2 className="section-title">Notes</h2>
              <div className="notes-box">
                <p>{order.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Billing & Actions */}
        <div className="details-right">
          {/* Items */}
          {Array.isArray(order.items) && order.items.length > 0 && (
            <div className="details-section">
              <h2 className="section-title">Order Items</h2>
              <div className="items-list">
                {order.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="item-info">
                      <p className="item-name">{item.name || 'Item'}</p>
                      <p className="item-qty">Qty: {item.qty}</p>
                    </div>
                    <p className="item-price">₹{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="items-summary">
                <div className="summary-row">
                  <span>Total Items:</span>
                  <strong>{totalItemsQty}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Pricing & Payment */}
          <div className="details-section">
            <h2 className="section-title">
              {order.customPricing ? 'Approved Pricing' : 'Estimated Pricing'}
            </h2>
            {order.customPricing ? (
              <div className="pricing-box approved">
                <div className="pricing-row">
                  <span>Total Amount:</span>
                  <strong>₹{order.customPricing.totalAmount?.toLocaleString() || '—'}</strong>
                </div>
                <div className="pricing-row">
                  <span>Per Head:</span>
                  <strong>₹{order.customPricing.perHeadPrice?.toLocaleString() || '—'}</strong>
                </div>
                {order.customPricing.discount > 0 && (
                  <div className="pricing-row">
                    <span>Discount:</span>
                    <strong className="discount">-₹{order.customPricing.discount?.toLocaleString()}</strong>
                  </div>
                )}
                {order.customPricing.notes && (
                  <div className="pricing-notes">
                    <p><strong>Notes:</strong> {order.customPricing.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="pricing-box">
                <div className="pricing-row">
                  <span>Budget Per Head:</span>
                  <strong>₹{order.budgetPerHead || 0}</strong>
                </div>
                <div className="pricing-row">
                  <span>Number of People:</span>
                  <strong>{order.peopleCount}</strong>
                </div>
                <div className="pricing-row total">
                  <span>Estimated Total:</span>
                  <strong>₹{(order.budgetPerHead * order.peopleCount).toLocaleString()}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Rejection Reason (if rejected) */}
          {order.rejectionReason && (
            <div className="details-section">
              <h2 className="section-title rejection-title">Rejection Reason</h2>
              <div className="rejection-box">
                <p>{order.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {order.approvalStatus === 'PENDING' && (
            <div className="action-buttons">
              <button
                className="action-btn approve"
                onClick={handleApprove}
                disabled={actionLoading}
              >
                <Check size={18} />
                Approve Order
              </button>
              <button
                className="action-btn reject"
                onClick={handleReject}
                disabled={actionLoading}
              >
                <X size={18} />
                Reject Order
              </button>
            </div>
          )}

          {order.approvalStatus === 'APPROVED' && (
            <div className="status-info approved">
              <Check size={20} />
              <p>Order has been approved. Awaiting customer payment.</p>
            </div>
          )}

          {order.approvalStatus === 'REJECTED' && (
            <div className="status-info rejected">
              <X size={20} />
              <p>This order has been rejected.</p>
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="modal-overlay" onClick={() => !actionLoading && setShowApprovalModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Approve Bulk Order</h3>
              <button className="modal-close" onClick={() => setShowApprovalModal(false)} disabled={actionLoading}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 16, color: '#666' }}>
                Set custom pricing for {order.name}'s order ({order.peopleCount} people)
              </p>

              <div className="form-group">
                <label>Total Amount (₹) *</label>
                <input
                  type="number"
                  value={pricingForm.totalAmount}
                  onChange={(e) => setPricingForm({ ...pricingForm, totalAmount: e.target.value })}
                  placeholder="Enter total amount"
                />
              </div>

              <div className="form-group">
                <label>Price Per Head (₹) *</label>
                <input
                  type="number"
                  value={pricingForm.perHeadPrice}
                  onChange={(e) => setPricingForm({ ...pricingForm, perHeadPrice: e.target.value })}
                  placeholder="Enter price per person"
                />
              </div>

              <div className="form-group">
                <label>Discount (₹)</label>
                <input
                  type="number"
                  value={pricingForm.discount}
                  onChange={(e) => setPricingForm({ ...pricingForm, discount: e.target.value })}
                  placeholder="Enter discount amount"
                />
              </div>

              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  value={pricingForm.notes}
                  onChange={(e) => setPricingForm({ ...pricingForm, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={() => setShowApprovalModal(false)} disabled={actionLoading}>
                Cancel
              </button>
              <button className="modal-btn submit" onClick={submitApproval} disabled={actionLoading}>
                {actionLoading ? 'Approving...' : 'Approve & Notify'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="modal-overlay" onClick={() => !actionLoading && setShowRejectionModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reject Bulk Order</h3>
              <button className="modal-close" onClick={() => setShowRejectionModal(false)} disabled={actionLoading}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 16, color: '#666' }}>
                Please provide a reason for rejecting {order.name}'s order
              </p>

              <div className="form-group">
                <label>Rejection Reason *</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  rows={4}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={() => setShowRejectionModal(false)} disabled={actionLoading}>
                Cancel
              </button>
              <button className="modal-btn danger" onClick={submitRejection} disabled={actionLoading}>
                {actionLoading ? 'Rejecting...' : 'Reject Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
