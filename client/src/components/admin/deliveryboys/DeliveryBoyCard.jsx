import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DeliveryBoyCard.css';

export default function DeliveryBoyCard({ deliveryBoy, onDelete }) {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const statusConfig = {
      online: { label: 'Online', class: 'status-online' },
      offline: { label: 'Offline', class: 'status-offline' },
      busy: { label: 'Busy', class: 'status-busy' }
    };
    return statusConfig[status] || statusConfig.offline;
  };

  const handleViewDetails = () => {
    navigate(`/admin/delivery-boys/${deliveryBoy.id}`);
  };

  const handleFire = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to fire ${deliveryBoy.name}?`)) {
      onDelete(deliveryBoy.id);
    }
  };

  const statusInfo = getStatusBadge(deliveryBoy.status);

  return (
    <div className="delivery-boy-card">
      <div className="card-header">
        <div className="profile-section">
          <div className="profile-image">
            <img 
              src={deliveryBoy.profileImage} 
              alt={deliveryBoy.name}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="profile-fallback">
              {deliveryBoy.name.charAt(0)}
            </div>
          </div>
          <div className="profile-info">
            <h3 className="delivery-boy-name">{deliveryBoy.name}</h3>
            <p className="delivery-boy-phone">{deliveryBoy.phone}</p>
          </div>
        </div>
        <div className={`status-badge ${statusInfo.class}`}>
          {statusInfo.label}
        </div>
      </div>

      <div className="card-stats">
        <div className="stat-item">
          <div className="stat-value">{deliveryBoy.totalDeliveries}</div>
          <div className="stat-label">Total Delivered</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{deliveryBoy.todayDeliveries}</div>
          <div className="stat-label">Today's Deliveries</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{deliveryBoy.rating}</div>
          <div className="stat-label">Rating</div>
        </div>
      </div>

      <div className="card-footer">
        <button className="view-details-btn" onClick={handleViewDetails}>
          View Details
        </button>
        <button className="fire-btn" onClick={handleFire}>
          🔥 Fire
        </button>
      </div>
    </div>
  );
}