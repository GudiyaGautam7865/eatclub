import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminBulkOrders, approveBulkOrder, rejectBulkOrder } from '../../../services/adminOrdersService';
import Toast from '../../../components/common/Toast';
import { Check, X, DollarSign, Users, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import './BulkOrdersPage.css';

export default function BulkOrdersPage() {
  const navigate = useNavigate();
  const [bulkOrders, setBulkOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [pricingForm, setPricingForm] = useState({
    totalAmount: '',
    perHeadPrice: '',
    discount: '',
    notes: '',
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Load bulk orders from admin API
  useEffect(() => {
    loadOrders();
  }, [page, pageSize]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAdminBulkOrders({ page, limit: pageSize });
      const mapped = (Array.isArray(data) ? data : []).map(o => ({
        ...o,
        id: o._id || o.id,
        name: o.name || '—',
        phone: o.phone || '—',
        email: o.email || '—',
        peopleCount: o.peopleCount || 0,
        eventDateTime: o.eventDateTime || o.eventDate || null,
        brandPreference: o.brandPreference || 'Any',
        budgetPerHead: o.budgetPerHead || 0,
        createdAt: o.createdAt || null,
        status: o.status || 'PENDING',
        approvalStatus: o.approvalStatus || 'PENDING',
        customPricing: o.customPricing || null,
        rejectionReason: o.rejectionReason || null,
      }));
      setBulkOrders(mapped);
    } catch (error) {
      setToast({ message: error?.message || 'Failed to load orders', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on status
  const filteredOrders = bulkOrders.filter((order) => {
    if (filterStatus !== 'all' && order.approvalStatus?.toLowerCase() !== filterStatus.toLowerCase()) {
      return false;
    }
    return true;
  });

  // Sort newest first
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bd - ad;
  });

  // Calculate statistics
  const totalOrders = bulkOrders.length;
  const pendingOrders = bulkOrders.filter((o) => o.approvalStatus === 'PENDING').length;
  const approvedOrders = bulkOrders.filter((o) => o.approvalStatus === 'APPROVED').length;
  const totalRevenue = bulkOrders
    .filter(o => o.customPricing?.totalAmount)
    .reduce((sum, o) => sum + (o.customPricing.totalAmount || 0), 0);

  const handleApprove = (order) => {
    setSelectedOrder(order);
    setPricingForm({
      totalAmount: order.budgetPerHead ? (parseInt(order.budgetPerHead) * parseInt(order.peopleCount || 50)) : '',
      perHeadPrice: order.budgetPerHead || '',
      discount: '',
      notes: '',
    });
    setShowApprovalModal(true);
  };

  const handleReject = (order) => {
    setSelectedOrder(order);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const submitApproval = async () => {
    if (!selectedOrder) return;
    try {
      setActionLoading(true);
      await approveBulkOrder(selectedOrder.id, pricingForm);
      setToast({ message: 'Bulk order approved successfully!', type: 'success' });
      setShowApprovalModal(false);
      loadOrders();
    } catch (error) {
      setToast({ message: error?.message || 'Failed to approve order', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const submitRejection = async () => {
    if (!selectedOrder || !rejectionReason.trim()) {
      setToast({ message: 'Please provide a rejection reason', type: 'error' });
      return;
    }
    try {
      setActionLoading(true);
      await rejectBulkOrder(selectedOrder.id, rejectionReason);
      setToast({ message: 'Bulk order rejected', type: 'success' });
      setShowRejectionModal(false);
      loadOrders();
    } catch (error) {
      setToast({ message: error?.message || 'Failed to reject order', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bulk-orders-container">
      {toast && (
        <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 9999 }}>
          <Toast message={toast.message} type={toast.type} duration={4000} onClose={() => setToast(null)} />
        </div>
      )}

      <div className="bulk-orders-header">
        <h1 className="bulk-orders-title">Bulk Order Management</h1>
        <p className="bulk-orders-subtitle">Review and approve party/event orders</p>
      </div>

      <div className="bulk-orders-stats">
        <div className="bulk-orders-stat">
          <div className="bulk-orders-stat-label">Total Requests</div>
          <div className="bulk-orders-stat-value">{totalOrders}</div>
        </div>
        <div className="bulk-orders-stat pending">
          <div className="bulk-orders-stat-label">Pending Approval</div>
          <div className="bulk-orders-stat-value">{pendingOrders}</div>
        </div>
        <div className="bulk-orders-stat approved">
          <div className="bulk-orders-stat-label">Approved</div>
          <div className="bulk-orders-stat-value">{approvedOrders}</div>
        </div>
        <div className="bulk-orders-stat">
          <div className="bulk-orders-stat-label">Total Revenue</div>
          <div className="bulk-orders-stat-value">₹{totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      <div className="bulk-orders-filters">
        <div className="bulk-orders-filter-group">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Requests</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bulk-orders-empty">Loading bulk orders...</div>
      ) : (
        <div className="bulk-orders-grid">
          {sortedOrders.map((order) => (
            <div 
              key={order.id} 
              className={`bulk-order-card ${order.approvalStatus?.toLowerCase()}`}
              onClick={() => navigate(`/admin/orders/bulk/${order.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="bulk-order-header">
                <div className="bulk-order-status-badge" data-status={order.approvalStatus}>
                  {order.approvalStatus === 'PENDING' && 'Awaiting Approval'}
                  {order.approvalStatus === 'APPROVED' && 'Approved'}
                  {order.approvalStatus === 'REJECTED' && 'Rejected'}
                </div>
                <div className="bulk-order-id">#{order.id.slice(-6)}</div>
              </div>

              <div className="bulk-order-body">
                <div className="bulk-order-row">
                  <Users size={18} />
                  <div>
                    <div className="bulk-order-label">Customer</div>
                    <div className="bulk-order-value">{order.name}</div>
                  </div>
                </div>

                <div className="bulk-order-row">
                  <Phone size={18} />
                  <div>
                    <div className="bulk-order-label">Phone</div>
                    <div className="bulk-order-value">{order.phone}</div>
                  </div>
                </div>

                {order.email && (
                  <div className="bulk-order-row">
                    <Mail size={18} />
                    <div>
                      <div className="bulk-order-label">Email</div>
                      <div className="bulk-order-value">{order.email}</div>
                    </div>
                  </div>
                )}

                <div className="bulk-order-row">
                  <Users size={18} />
                  <div>
                    <div className="bulk-order-label">People Count</div>
                    <div className="bulk-order-value">{order.peopleCount}</div>
                  </div>
                </div>

                <div className="bulk-order-row">
                  <Calendar size={18} />
                  <div>
                    <div className="bulk-order-label">Event Date</div>
                    <div className="bulk-order-value">
                      {order.eventDateTime ? new Date(order.eventDateTime).toLocaleString() : '—'}
                    </div>
                  </div>
                </div>

                <div className="bulk-order-row">
                  <MapPin size={18} />
                  <div>
                    <div className="bulk-order-label">Address</div>
                    <div className="bulk-order-value">{order.address}</div>
                  </div>
                </div>

                {order.budgetPerHead && (
                  <div className="bulk-order-row">
                    <DollarSign size={18} />
                    <div>
                      <div className="bulk-order-label">Budget Per Head</div>
                      <div className="bulk-order-value">₹{order.budgetPerHead}</div>
                    </div>
                  </div>
                )}

                {order.brandPreference && (
                  <div className="bulk-order-row">
                    <div className="bulk-order-label">Brand Preference</div>
                    <div className="bulk-order-value">{order.brandPreference}</div>
                  </div>
                )}

                {order.notes && (
                  <div className="bulk-order-notes">
                    <div className="bulk-order-label">Notes</div>
                    <div className="bulk-order-value">{order.notes}</div>
                  </div>
                )}

                {order.customPricing && (
                  <div className="bulk-order-pricing">
                    <div className="bulk-order-label">Approved Pricing</div>
                    <div className="bulk-order-pricing-details">
                      <div>Total: ₹{order.customPricing.totalAmount?.toLocaleString()}</div>
                      <div>Per Head: ₹{order.customPricing.perHeadPrice}</div>
                      {order.customPricing.discount > 0 && (
                        <div>Discount: ₹{order.customPricing.discount}</div>
                      )}
                    </div>
                  </div>
                )}

                {order.rejectionReason && (
                  <div className="bulk-order-rejection">
                    <div className="bulk-order-label">Rejection Reason</div>
                    <div className="bulk-order-value">{order.rejectionReason}</div>
                  </div>
                )}
              </div>

              {order.approvalStatus === 'PENDING' && (
                <div className="bulk-order-card-actions">
                  <button className="bulk-order-action-btn approve" onClick={() => handleApprove(order)} disabled={actionLoading}>
                    <Check size={18} />
                    Approve
                  </button>
                  <button className="bulk-order-action-btn reject" onClick={() => handleReject(order)} disabled={actionLoading}>
                    <X size={18} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && sortedOrders.length === 0 && (
        <div className="bulk-orders-empty">
          <p>No bulk orders found matching the selected filter.</p>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedOrder && (
        <div className="bulk-order-modal-overlay" onClick={() => !actionLoading && setShowApprovalModal(false)}>
          <div className="bulk-order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bulk-order-modal-header">
              <h3 className="bulk-order-modal-title">Approve Bulk Order</h3>
              <button className="bulk-order-modal-close" onClick={() => setShowApprovalModal(false)} disabled={actionLoading}>
                <X size={20} />
              </button>
            </div>
            <div className="bulk-order-modal-body">
              <p style={{ marginBottom: 16, color: '#666' }}>
                Set custom pricing for {selectedOrder.name}'s order ({selectedOrder.peopleCount} people)
              </p>

              <div className="bulk-order-modal-form-group">
                <label>Total Amount (₹)</label>
                <input
                  type="number"
                  value={pricingForm.totalAmount}
                  onChange={(e) => setPricingForm({ ...pricingForm, totalAmount: e.target.value })}
                  placeholder="Enter total amount"
                />
              </div>

              <div className="bulk-order-modal-form-group">
                <label>Price Per Head (₹)</label>
                <input
                  type="number"
                  value={pricingForm.perHeadPrice}
                  onChange={(e) => setPricingForm({ ...pricingForm, perHeadPrice: e.target.value })}
                  placeholder="Enter price per person"
                />
              </div>

              <div className="bulk-order-modal-form-group">
                <label>Discount (₹)</label>
                <input
                  type="number"
                  value={pricingForm.discount}
                  onChange={(e) => setPricingForm({ ...pricingForm, discount: e.target.value })}
                  placeholder="Enter discount amount"
                />
              </div>

              <div className="bulk-order-modal-form-group">
                <label>Notes (Optional)</label>
                <textarea
                  value={pricingForm.notes}
                  onChange={(e) => setPricingForm({ ...pricingForm, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={3}
                />
              </div>
            </div>
            <div className="bulk-order-modal-footer">
              <button className="bulk-order-modal-btn cancel" onClick={() => setShowApprovalModal(false)} disabled={actionLoading}>
                Cancel
              </button>
              <button className="bulk-order-modal-btn submit" onClick={submitApproval} disabled={actionLoading}>
                {actionLoading ? 'Approving...' : 'Approve & Notify Customer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedOrder && (
        <div className="bulk-order-modal-overlay" onClick={() => !actionLoading && setShowRejectionModal(false)}>
          <div className="bulk-order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bulk-order-modal-header">
              <h3 className="bulk-order-modal-title">Reject Bulk Order</h3>
              <button className="bulk-order-modal-close" onClick={() => setShowRejectionModal(false)} disabled={actionLoading}>
                <X size={20} />
              </button>
            </div>
            <div className="bulk-order-modal-body">
              <p style={{ marginBottom: 16, color: '#666' }}>
                Please provide a reason for rejecting {selectedOrder.name}'s order
              </p>

              <div className="bulk-order-modal-form-group">
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
            <div className="bulk-order-modal-footer">
              <button className="bulk-order-modal-btn cancel" onClick={() => setShowRejectionModal(false)} disabled={actionLoading}>
                Cancel
              </button>
              <button className="bulk-order-modal-btn danger" onClick={submitRejection} disabled={actionLoading}>
                {actionLoading ? 'Rejecting...' : 'Reject Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}