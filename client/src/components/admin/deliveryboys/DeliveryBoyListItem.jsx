import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DeliveryBoyListItem.css';

export default function DeliveryBoyListItem({ deliveryBoy, onDelete }) {
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
    <div className="delivery-boy-list-item">
      <div className="list-item-profile">
        <div className="list-profile-image">
          <img 
            src={deliveryBoy.profileImage} 
            alt={deliveryBoy.name}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="list-profile-fallback">
            {deliveryBoy.name.charAt(0)}
          </div>
        </div>
        <div className="list-profile-info">
          <h3 className="list-delivery-boy-name">{deliveryBoy.name}</h3>
          <p className="list-delivery-boy-phone">{deliveryBoy.phone}</p>
          <p className="list-delivery-boy-email">{deliveryBoy.email}</p>
        </div>
      </div>

      <div className="list-item-status">
        <div className={`list-status-badge ${statusInfo.class}`}>
          {statusInfo.label}
        </div>
      </div>

      <div className="list-item-stats">
        <div className="list-stat">
          <div className="list-stat-value">{deliveryBoy.totalDeliveries}</div>
          <div className="list-stat-label">Total</div>
        </div>
        <div className="list-stat">
          <div className="list-stat-value">{deliveryBoy.todayDeliveries}</div>
          <div className="list-stat-label">Today</div>
        </div>
        <div className="list-stat">
          <div className="list-stat-value">{deliveryBoy.rating}</div>
          <div className="list-stat-label">Rating</div>
        </div>
      </div>

      <div className="list-item-vehicle">
        <div className="vehicle-type">{deliveryBoy.vehicleType}</div>
        <div className="vehicle-number">{deliveryBoy.vehicleNumber}</div>
      </div>

      <div className="list-item-actions">
        <button className="list-view-btn" onClick={handleViewDetails}>
          View Details
        </button>
        <button className="list-fire-btn" onClick={handleFire}>
          🔥 Fire
        </button>
      </div>
    </div>
  );
}