import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomerById } from '../../../services/adminCustomersService';
import './CustomerDetailPage.css';

export default function CustomerDetailPage() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getCustomerById(customerId);
        setCustomer(data);
      } catch (err) {
        setError(err.message || 'Failed to load customer');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  if (loading) {
    return <div className="customer-detail-page"><div className="empty-card">Loading customer…</div></div>;
  }

  if (error || !customer) {
    return (
      <div className="customer-detail-page">
        <div className="customer-header-row">
          <button className="ghost-btn" onClick={() => navigate('/admin/customer-detail')}>← Back to Customers</button>
        </div>
        <div className="empty-card">{error || 'Customer not found.'}</div>
      </div>
    );
  }

  const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : '—');
  const formatDateTime = (iso) => (iso ? new Date(iso).toLocaleString() : '—');
  const formatCurrency = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`;
  const stats = customer.stats || {};
  const orders = customer.orders || [];
  const addresses = customer.addresses || [];

  return (
    <div className="customer-detail-page">
      <div className="customer-header-row">
        <button className="ghost-btn" onClick={() => navigate('/admin/customer-detail')}>← Back to Customers</button>
        <div>
          <p className="eyebrow">Customer</p>
          <h1>{customer.name}</h1>
          <p className="subtitle">Joined {formatDate(customer.joinedDate)}</p>
        </div>
        <span className={`status-pill ${customer.status?.toLowerCase() || 'neutral'}`}>{customer.status}</span>
      </div>

      <div className="detail-grid">
        <div className="card overview-card">
          <div className="overview-top">
            <div>
              <div className="eyebrow">Overview</div>
              <div className="customer-name">{customer.name}</div>
              <div className="contact-row">{customer.email}</div>
              <div className="contact-row">{customer.phone}</div>
              <div className="contact-row">Joined {formatDate(customer.joinedDate)}</div>
            </div>
          </div>
        </div>

        <div className="card stats-card">
          <div className="stat-item">
            <div className="label">Total Orders</div>
            <div className="value">{stats.totalOrders || 0}</div>
          </div>
          <div className="stat-item">
            <div className="label">Total Spend</div>
            <div className="value">{formatCurrency(stats.totalSpend)}</div>
          </div>
          <div className="stat-item">
            <div className="label">Avg Order Value</div>
            <div className="value">{formatCurrency(stats.avgOrderValue)}</div>
          </div>
          <div className="stat-item">
            <div className="label">Last Order</div>
            <div className="value">{formatDate(stats.lastOrderDate)}</div>
          </div>
        </div>
      </div>

      <div className="card section-card">
        <div className="section-head">
          <div>
            <p className="eyebrow">Orders</p>
            <h3>Order History</h3>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id || o._id}</td>
                  <td>{formatDateTime(o.date || o.createdAt)}</td>
                  <td>{formatCurrency(o.total)}</td>
                  <td>
                    <span className={`status-pill ${o.status?.toLowerCase() || 'neutral'}`}>{o.status}</span>
                  </td>
                  <td>
                    <button className="link-btn" onClick={() => navigate(`/admin/orders/${o.id || o._id}`)}>View Order →</button>
                  </td>
                </tr>
              ))}
              {!orders.length && (
                <tr>
                  <td colSpan={5} className="empty-state">No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card section-card">
        <div className="section-head">
          <div>
            <p className="eyebrow">Addresses</p>
            <h3>Saved Addresses</h3>
          </div>
        </div>
        <div className="addresses-grid">
          {addresses.map((a, idx) => (
            <div key={idx} className="address-card">
              <div className="address-label">{a.label}</div>
              <div className="address-line">{a.line1}</div>
              <div className="address-line">{a.city}</div>
              <div className="address-line">{a.pincode}</div>
            </div>
          ))}
          {!addresses.length && (
            <div className="empty-state">No saved addresses.</div>
          )}
        </div>
      </div>
    </div>
  );
}