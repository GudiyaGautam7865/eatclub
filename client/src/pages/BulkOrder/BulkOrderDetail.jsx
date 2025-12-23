import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBulkOrderById, cancelBulkOrder } from '../../services/bulkOrdersService';
import { getBulkOrderStatusMessage, getOrderStatusBadge, canCancelBulkOrder, canPayBulkOrder, formatScheduledDateTime } from '../../utils/orderUtils';
import './BulkOrderDetail.css';

const BulkOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const data = await getBulkOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error('Fetch order error:', error);
      alert('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this bulk order?')) return;
    
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    setCancelling(true);
    try {
      await cancelBulkOrder(id, reason);
      alert('Bulk order cancelled successfully');
      fetchOrderDetails();
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const handleProceedToPayment = () => {
    navigate(`/cart?bulkOrderId=${id}`);
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return <div className="error">Order not found</div>;
  }

  const statusBadge = getOrderStatusBadge(order.status);
  const statusMessage = getBulkOrderStatusMessage(order.status, order.bulkDetails);

  return (
    <div className="bulk-order-detail">
      <div className="order-header">
        <div>
          <h1>Bulk Order #{order._id?.slice(-8)}</h1>
          <span className="status-badge" style={{ background: statusBadge.bg, color: statusBadge.color }}>
            {statusBadge.label}
          </span>
        </div>
        <button onClick={() => navigate('/orders')} className="btn-back">
          ← Back to Orders
        </button>
      </div>

      <div className="status-message" style={{ borderLeftColor: statusBadge.color }}>
        <div className="status-icon">{statusMessage.icon}</div>
        <div>
          <h3>{statusMessage.title}</h3>
          <p>{statusMessage.message}</p>
        </div>
      </div>

      <div className="order-content">
        <section className="detail-section">
          <h2>Event Details</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Event:</span>
              <span className="value">{order.bulkDetails?.eventName}</span>
            </div>
            <div className="detail-item">
              <span className="label">Type:</span>
              <span className="value">{order.bulkDetails?.eventType}</span>
            </div>
            <div className="detail-item">
              <span className="label">People:</span>
              <span className="value">{order.bulkDetails?.peopleCount}</span>
            </div>
            <div className="detail-item">
              <span className="label">Scheduled:</span>
              <span className="value">
                {formatScheduledDateTime(order.bulkDetails?.scheduledDate, order.bulkDetails?.scheduledTime)}
              </span>
            </div>
          </div>
        </section>

        <section className="detail-section">
          <h2>Order Summary</h2>
          <div className="items-list">
            {order.items?.map((item, index) => (
              <div key={index} className="item-row">
                <span className="item-name">{item.name}</span>
                <span className="item-qty">x{item.qty}</span>
                <span className="item-price">₹{(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {order.status === 'ACCEPTED' || order.status === 'PAID' || order.status === 'SCHEDULED' || order.status === 'ASSIGNED' || order.status === 'OUT_FOR_DELIVERY' || order.status === 'DELIVERED' ? (
            <div className="pricing-breakdown">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>₹{order.bulkDetails?.subtotal?.toFixed(2) || order.total.toFixed(2)}</span>
              </div>
              {order.bulkDetails?.discount > 0 && (
                <div className="price-row discount">
                  <span>Bulk Discount ({order.bulkDetails?.discount}%):</span>
                  <span>-₹{((order.bulkDetails?.subtotal * order.bulkDetails?.discount) / 100).toFixed(2)}</span>
                </div>
              )}
              {order.bulkDetails?.additionalCharges?.packaging > 0 && (
                <div className="price-row">
                  <span>Packaging:</span>
                  <span>₹{order.bulkDetails.additionalCharges.packaging.toFixed(2)}</span>
                </div>
              )}
              {order.bulkDetails?.additionalCharges?.delivery > 0 && (
                <div className="price-row">
                  <span>Delivery:</span>
                  <span>₹{order.bulkDetails.additionalCharges.delivery.toFixed(2)}</span>
                </div>
              )}
              <div className="price-row total">
                <span>Final Total:</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="pricing-pending">
              <p>⏳ Pricing Pending</p>
              <small>Admin will review your request and confirm pricing within 24 hours</small>
            </div>
          )}
        </section>

        <section className="detail-section">
          <h2>Delivery Address</h2>
          <div className="address-box">
            <p>{order.address?.line1}</p>
            <p>{order.address?.city} - {order.address?.pincode}</p>
          </div>
        </section>

        {order.bulkDetails?.specialInstructions && (
          <section className="detail-section">
            <h2>Special Instructions</h2>
            <p className="instructions">{order.bulkDetails.specialInstructions}</p>
          </section>
        )}

        {(order.bulkDetails?.deliveryBoyName || order.driverName) && (
          <section className="detail-section">
            <h2>Delivery Partner</h2>
            <div className="delivery-info">
              <p><strong>Name:</strong> {order.bulkDetails?.deliveryBoyName || order.driverName}</p>
              <p><strong>Phone:</strong> {order.bulkDetails?.deliveryBoyPhone || order.driverPhone}</p>
            </div>
          </section>
        )}

        <div className="order-actions">
          {canPayBulkOrder(order.status) && (
            <button onClick={handleProceedToPayment} className="btn-primary">
              Proceed to Payment
            </button>
          )}
          {canCancelBulkOrder(order.status) && (
            <button onClick={handleCancel} disabled={cancelling} className="btn-danger">
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkOrderDetail;
