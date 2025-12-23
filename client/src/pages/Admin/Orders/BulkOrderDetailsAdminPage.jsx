import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getAdminBulkOrderById, 
  acceptBulkOrder, 
  rejectBulkOrder,
  assignDeliveryToBulkOrder,
  updateBulkOrderStatus 
} from '../../../services/bulkOrdersService';
import { getOrderStatusBadge, formatScheduledDateTime } from '../../../utils/orderUtils';
import './BulkOrderDetailsPage.css';

const AdminBulkOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Pricing form state
  const [showPricingForm, setShowPricingForm] = useState(false);
  const [pricingData, setPricingData] = useState({
    discount: 10,
    discountReason: '',
    packaging: 0,
    delivery: 0,
    service: 0,
    adminNotes: '',
  });

  // Rejection form state
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Delivery assignment state
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    deliveryBoyName: '',
    deliveryBoyPhone: '',
  });

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const data = await getAdminBulkOrderById(id);
      setOrder(data);
      if (data.bulkDetails) {
        setPricingData(prev => ({
          ...prev,
          discount: data.bulkDetails.discount || 10,
          discountReason: data.bulkDetails.discountReason || '',
          packaging: data.bulkDetails.additionalCharges?.packaging || 0,
          delivery: data.bulkDetails.additionalCharges?.delivery || 0,
          service: data.bulkDetails.additionalCharges?.service || 0,
          adminNotes: data.bulkDetails.adminNotes || '',
        }));
      }
    } catch (error) {
      console.error('Fetch order error:', error);
      alert('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalTotal = () => {
    if (!order) return 0;
    const subtotal = order.bulkDetails?.subtotal || order.total;
    const discount = (subtotal * pricingData.discount) / 100;
    const additionalCharges = 
      parseFloat(pricingData.packaging || 0) +
      parseFloat(pricingData.delivery || 0) +
      parseFloat(pricingData.service || 0);
    return subtotal - discount + additionalCharges;
  };

  const handleAccept = async () => {
    if (!confirm('Accept this bulk order with the specified pricing?')) return;
    
    setProcessing(true);
    try {
      await acceptBulkOrder(id, {
        finalTotal: calculateFinalTotal(),
        discount: pricingData.discount,
        discountReason: pricingData.discountReason,
        additionalCharges: {
          packaging: parseFloat(pricingData.packaging || 0),
          delivery: parseFloat(pricingData.delivery || 0),
          service: parseFloat(pricingData.service || 0),
        },
        adminNotes: pricingData.adminNotes,
      });
      alert('Bulk order accepted successfully!');
      setShowPricingForm(false);
      fetchOrderDetails();
    } catch (error) {
      console.error('Accept error:', error);
      alert('Failed to accept order');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    if (!confirm('Reject this bulk order?')) return;
    
    setProcessing(true);
    try {
      await rejectBulkOrder(id, rejectReason);
      alert('Bulk order rejected');
      setShowRejectForm(false);
      fetchOrderDetails();
    } catch (error) {
      console.error('Reject error:', error);
      alert('Failed to reject order');
    } finally {
      setProcessing(false);
    }
  };

  const handleAssignDelivery = async () => {
    if (!deliveryData.deliveryBoyName || !deliveryData.deliveryBoyPhone) {
      alert('Please provide delivery boy name and phone');
      return;
    }
    
    setProcessing(true);
    try {
      await assignDeliveryToBulkOrder(id, deliveryData);
      alert('Delivery boy assigned successfully!');
      setShowAssignForm(false);
      fetchOrderDetails();
    } catch (error) {
      console.error('Assign delivery error:', error);
      alert('Failed to assign delivery boy');
    } finally {
      setProcessing(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!confirm(`Update order status to ${newStatus}?`)) return;
    
    setProcessing(true);
    try {
      await updateBulkOrderStatus(id, newStatus, `Status updated to ${newStatus}`);
      alert('Status updated successfully!');
      fetchOrderDetails();
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update status');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading order details...</div>;
  }

  if (!order) {
    return <div className="admin-error">Order not found</div>;
  }

  const statusBadge = getOrderStatusBadge(order.status);
  const subtotal = order.bulkDetails?.subtotal || order.total;

  return (
    <div className="admin-bulk-order-detail">
      <div className="admin-order-header">
        <div>
          <h1>Bulk Order #{order._id?.slice(-8)}</h1>
          <span className="status-badge" style={{ background: statusBadge.bg, color: statusBadge.color }}>
            {statusBadge.label}
          </span>
        </div>
        <button onClick={() => navigate('/admin/orders')} className="btn-back">
          ← Back to Orders
        </button>
      </div>

      {order.status === 'REQUESTED' && (
        <div className="admin-action-alert">
          ⚠️ ACTION REQUIRED: Review & Price This Order
        </div>
      )}

      <div className="admin-order-content">
        <section className="admin-section">
          <h2>Customer Information</h2>
          <div className="info-grid">
            <div><strong>Name:</strong> {order.user?.name}</div>
            <div><strong>Email:</strong> {order.user?.email}</div>
            <div><strong>Phone:</strong> {order.user?.phone}</div>
          </div>
        </section>

        <section className="admin-section">
          <h2>Event Details</h2>
          <div className="info-grid">
            <div><strong>Event:</strong> {order.bulkDetails?.eventName}</div>
            <div><strong>Type:</strong> {order.bulkDetails?.eventType}</div>
            <div><strong>People:</strong> {order.bulkDetails?.peopleCount}</div>
            <div><strong>Scheduled:</strong> {formatScheduledDateTime(order.bulkDetails?.scheduledDate, order.bulkDetails?.scheduledTime)}</div>
            <div><strong>Submitted:</strong> {new Date(order.createdAt).toLocaleString()}</div>
          </div>
        </section>

        <section className="admin-section">
          <h2>Delivery Address</h2>
          <div className="address-box">
            <p>{order.address?.line1}</p>
            <p>{order.address?.city} - {order.address?.pincode}</p>
          </div>
        </section>

        <section className="admin-section">
          <h2>Requested Items</h2>
          <table className="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price/Unit</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>₹{item.price}</td>
                  <td>₹{(item.qty * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"><strong>Subtotal</strong></td>
                <td><strong>₹{subtotal.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </section>

        {order.bulkDetails?.specialInstructions && (
          <section className="admin-section">
            <h2>Special Instructions</h2>
            <p className="instructions-box">{order.bulkDetails.specialInstructions}</p>
          </section>
        )}

        {order.status === 'REQUESTED' && (
          <section className="admin-section pricing-section">
            <h2>Admin Pricing</h2>
            {!showPricingForm ? (
              <button onClick={() => setShowPricingForm(true)} className="btn-primary">
                Set Pricing & Accept Order
              </button>
            ) : (
              <div className="pricing-form">
                <div className="form-row">
                  <label>Subtotal:</label>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="form-row">
                  <label>Bulk Discount (%):</label>
                  <select 
                    value={pricingData.discount}
                    onChange={(e) => setPricingData({...pricingData, discount: parseFloat(e.target.value)})}
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="10">10%</option>
                    <option value="15">15%</option>
                    <option value="20">20%</option>
                    <option value="25">25%</option>
                  </select>
                  <span>-₹{((subtotal * pricingData.discount) / 100).toFixed(2)}</span>
                </div>

                <div className="form-row">
                  <label>Discount Reason:</label>
                  <input 
                    type="text"
                    value={pricingData.discountReason}
                    onChange={(e) => setPricingData({...pricingData, discountReason: e.target.value})}
                    placeholder="e.g., Corporate bulk order discount"
                  />
                </div>

                <div className="form-row">
                  <label>Packaging Charges:</label>
                  <input 
                    type="number"
                    value={pricingData.packaging}
                    onChange={(e) => setPricingData({...pricingData, packaging: e.target.value})}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-row">
                  <label>Delivery Charges:</label>
                  <input 
                    type="number"
                    value={pricingData.delivery}
                    onChange={(e) => setPricingData({...pricingData, delivery: e.target.value})}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-row">
                  <label>Service Charges:</label>
                  <input 
                    type="number"
                    value={pricingData.service}
                    onChange={(e) => setPricingData({...pricingData, service: e.target.value})}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-row total-row">
                  <label><strong>Final Total:</strong></label>
                  <span><strong>₹{calculateFinalTotal().toFixed(2)}</strong></span>
                </div>

                <div className="form-row">
                  <label>Admin Notes (Internal):</label>
                  <textarea 
                    value={pricingData.adminNotes}
                    onChange={(e) => setPricingData({...pricingData, adminNotes: e.target.value})}
                    rows="3"
                    placeholder="Internal notes..."
                  />
                </div>

                <div className="form-actions">
                  <button onClick={() => setShowPricingForm(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button onClick={handleAccept} disabled={processing} className="btn-success">
                    {processing ? 'Processing...' : 'Accept & Confirm Pricing'}
                  </button>
                </div>
              </div>
            )}

            {!showRejectForm ? (
              <button onClick={() => setShowRejectForm(true)} className="btn-danger" style={{marginTop: '10px'}}>
                Reject Order
              </button>
            ) : (
              <div className="reject-form">
                <label>Rejection Reason:</label>
                <select value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}>
                  <option value="">Select reason...</option>
                  <option value="Items not available">Items not available</option>
                  <option value="Insufficient preparation time">Insufficient preparation time</option>
                  <option value="Outside delivery area">Outside delivery area</option>
                  <option value="Other">Other</option>
                </select>
                <div className="form-actions">
                  <button onClick={() => setShowRejectForm(false)} className="btn-secondary">Cancel</button>
                  <button onClick={handleReject} disabled={processing} className="btn-danger">
                    {processing ? 'Processing...' : 'Confirm Rejection'}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {(order.status === 'PAID' || order.status === 'SCHEDULED') && !order.bulkDetails?.assignedDeliveryBoy && (
          <section className="admin-section">
            <h2>Assign Delivery Partner</h2>
            {!showAssignForm ? (
              <button onClick={() => setShowAssignForm(true)} className="btn-primary">
                Assign Delivery Boy
              </button>
            ) : (
              <div className="assign-form">
                <div className="form-row">
                  <label>Delivery Boy Name:</label>
                  <input 
                    type="text"
                    value={deliveryData.deliveryBoyName}
                    onChange={(e) => setDeliveryData({...deliveryData, deliveryBoyName: e.target.value})}
                    placeholder="Enter name"
                  />
                </div>
                <div className="form-row">
                  <label>Phone Number:</label>
                  <input 
                    type="tel"
                    value={deliveryData.deliveryBoyPhone}
                    onChange={(e) => setDeliveryData({...deliveryData, deliveryBoyPhone: e.target.value})}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="form-actions">
                  <button onClick={() => setShowAssignForm(false)} className="btn-secondary">Cancel</button>
                  <button onClick={handleAssignDelivery} disabled={processing} className="btn-primary">
                    {processing ? 'Assigning...' : 'Assign'}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {order.bulkDetails?.deliveryBoyName && (
          <section className="admin-section">
            <h2>Assigned Delivery Partner</h2>
            <div className="info-grid">
              <div><strong>Name:</strong> {order.bulkDetails.deliveryBoyName}</div>
              <div><strong>Phone:</strong> {order.bulkDetails.deliveryBoyPhone}</div>
            </div>
          </section>
        )}

        {order.status === 'ASSIGNED' && (
          <section className="admin-section">
            <h2>Update Status</h2>
            <div className="status-actions">
              <button onClick={() => handleStatusUpdate('OUT_FOR_DELIVERY')} className="btn-primary">
                Mark as Out for Delivery
              </button>
            </div>
          </section>
        )}

        {order.status === 'OUT_FOR_DELIVERY' && (
          <section className="admin-section">
            <h2>Update Status</h2>
            <div className="status-actions">
              <button onClick={() => handleStatusUpdate('DELIVERED')} className="btn-success">
                Mark as Delivered
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminBulkOrderDetail;
