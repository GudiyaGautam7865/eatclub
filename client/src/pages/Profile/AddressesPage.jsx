import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddressContext } from '../../context/AddressContext';
import AddressMapModal from '../../components/cart/AddressMapModal';
import AddressFormModal from '../../components/cart/AddressFormModal';
import './ProfilePage.css';
import './AddressesPage.css';
import { useUserContext } from "../../context/UserContext";

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
   const { user } = useUserContext();
  if (!user) {
  return <div style={{ padding: "20px" }}>Please login to view your profile</div>;
}

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
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phoneNumber || "Not Added"}</p>
          </div>
        </div>
        <button className="edit-btn" onClick={() => setShowEditModal(true)}>EDIT</button>
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

         {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            
            <div className="form-field">
              <label>Name*</label>
              <div className="input-container">
                <input type="text" defaultValue={user?.name} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>
            
            <div className="form-field">
              <label>Phone No.</label>
              <input type="text" defaultValue={user?.phoneNumber || "Not Added"} />
            </div>
            
            <div className="form-field">
              <label>Email*</label>
              <div className="input-container">
                <input type="email" defaultValue={user?.email} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>
            
            <div className="form-field">
              <label>Password*</label>
              <div className="password-container">
                <input type="password" defaultValue="••••••••••" />
                <span className="change-link">Change</span>
              </div>
            </div>
            
            <div className="form-field">
              <label>DOB*</label>
              <div className="dob-container">
                <input type="date" placeholder="Select Date" />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

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