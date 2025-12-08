import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddressContext } from '../../context/AddressContext';
import AddressMapModal from '../../components/cart/AddressMapModal';
import AddressFormModal from '../../components/cart/AddressFormModal';
import './ProfilePage.css';
import './AddressesPage.css';

const AddressesPage = () => {
  const navigate = useNavigate();
  const { addresses, deleteAddress, updateAddressData } = useAddressContext();
  const [mapOpen, setMapOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingLocation, setPendingLocation] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editFlat, setEditFlat] = useState('');
  const [editFloor, setEditFloor] = useState('');
  const [editLandmark, setEditLandmark] = useState('');

  const handleNavigation = (section) => {
    if (section === 'orders') {
      navigate('/profile');
    } else if (section === 'credits') {
      navigate('/profile/credits');
    } else if (section === 'payment') {
      navigate('/profile/payments');
    } else if (section === 'notification') {
      navigate('/profile/notification');
    } else if (section === 'faqs') {
      navigate('/profile/faq');
    }
  };

  const handleConfirmLocation = (locationString) => {
    setPendingLocation(locationString);
    setMapOpen(false);
    setTimeout(() => setFormOpen(true), 80);
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setEditFlat(addr.flat || '');
    setEditFloor(addr.floor || '');
    setEditLandmark(addr.landmark || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingAddress) {
      updateAddressData(editingAddress.id, {
        flat: editFlat,
        floor: editFloor,
        landmark: editLandmark
      });
      setShowEditModal(false);
      setEditingAddress(null);
    }
  };

  const handleDeleteAddress = (id) => {
    if (confirm('Are you sure you want to delete this address?')) {
      deleteAddress(id);
    }
  };

  return (
    <div className="profile-page">
      {/* Profile Header Section */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
          </div>
        </div>
        <div className="profile-info">
          <div className="profile-details">
            <p><strong>Name:</strong> Vivek</p>
            <p><strong>Email:</strong> vivekjangam73@gmail.com</p>
            <p><strong>Phone:</strong> 9767996768</p>
          </div>
        </div>
        <button className="edit-btn">EDIT</button>
      </div>

      <div className="profile-content">
        {/* Sidebar Menu */}
        <div className="profile-sidebar">
          <ul className="profile-menu">
            <li className="menu-item" onClick={() => handleNavigation('orders')}>Manage Orders</li>
            <li className="menu-item" onClick={() => handleNavigation('credits')}>Credits</li>
            <li className="menu-item" onClick={() => handleNavigation('payment')}>Payment</li>
            <li className="menu-item active">Address</li>
            <li className="menu-item" onClick={() => handleNavigation('notification')}>Manage Notification</li>
            <li className="menu-item" onClick={() => handleNavigation('faqs')}>FAQs</li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="profile-main addresses-main">
          {/* Action Button */}
          <div className="addresses-header">
            <button 
              className="add-new-address-btn"
              onClick={() => setMapOpen(true)}
            >
              + Add New Address
            </button>
          </div>

          {/* Addresses Container */}
          <div className="addresses-container">
            {addresses.length === 0 ? (
              <div className="addresses-empty">
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📍</div>
                <h3>No addresses saved</h3>
                <p>Add your first address to get started!</p>
              </div>
            ) : (
              <div className="addresses-grid">
                {addresses.map((addr) => (
                  <div key={addr.id} className="address-card">
                    {/* Address Header */}
                    <div className="address-header">
                      <div className="address-icon-label">
                        <span className="address-icon">
                          {addr.type === 'Home' ? '🏠' : addr.type === 'Work' ? '💼' : '📍'}
                        </span>
                        <h3 className="address-label">{addr.label}</h3>
                      </div>
                    </div>

                    {/* Address Details */}
                    <div className="address-details">
                      {addr.flat && <div className="address-detail-line">{addr.flat}</div>}
                      {addr.floor && <div className="address-detail-line">{addr.floor}</div>}
                      {addr.landmark && <div className="address-detail-line">{addr.landmark}</div>}
                      <div className="address-full">{addr.address}</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="address-actions">
                      <button
                        className="address-action-btn"
                        onClick={() => handleEditAddress(addr)}
                      >
                        EDIT
                      </button>
                      <button
                        className="address-action-btn"
                        onClick={() => handleDeleteAddress(addr.id)}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddressMapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} onConfirm={handleConfirmLocation} />
      <AddressFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} initialAddress={pendingLocation} />

      {/* Edit Address Modal */}
      {showEditModal && editingAddress && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            
            <h2 style={{ marginBottom: '20px', fontSize: '18px', color: '#333' }}>Edit Address</h2>

            <div className="form-field">
              <label>FLAT / HOUSE NUMBER</label>
              <input 
                type="text" 
                value={editFlat} 
                onChange={(e) => setEditFlat(e.target.value)}
                placeholder="Eg: 212, Prestige Flora"
              />
            </div>

            <div className="form-field">
              <label>FLOOR / BLOCK (OPTIONAL)</label>
              <input 
                type="text" 
                value={editFloor} 
                onChange={(e) => setEditFloor(e.target.value)}
                placeholder="Eg: 2nd Floor, A Block"
              />
            </div>

            <div className="form-field">
              <label>LANDMARK / DIRECTION (OPTIONAL)</label>
              <input 
                type="text" 
                value={editLandmark} 
                onChange={(e) => setEditLandmark(e.target.value)}
                placeholder="Eg: Yellow building, Near CV Raman Hospital"
              />
            </div>

            <button 
              onClick={handleSaveEdit}
              className="save-changes-btn"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressesPage;