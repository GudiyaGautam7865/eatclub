import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddressContext } from '../../context/AddressContext';
import AddressModal from '../../components/address/AddressModal';
import './ProfilePage.css';
import './AddressesPage.css';
import { useUserContext } from "../../context/UserContext";
import ProfileHeader from '../../components/profile/ProfileHeader';

const AddressesPage = () => {
  const navigate = useNavigate();
  const { addresses, deleteAddress, updateAddress, createAddress, selectAddress, addFromGeolocation } = useAddressContext();
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [savingAddress, setSavingAddress] = useState(false);
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
    } else if (section === 'messages') {
      navigate('/profile/messages');
    } else if (section === 'faqs') {
      navigate('/profile/faq');
    }
  };

  const openAddressModal = (addr = null) => { setEditingAddress(addr); setAddressModalOpen(true); };
  const closeAddressModal = () => { setEditingAddress(null); setAddressModalOpen(false); };

  const handleSaveAddress = async (payload) => {
    try {
      setSavingAddress(true);
      const created = editingAddress
        ? await updateAddress(editingAddress.id, payload)
        : await createAddress(payload);
      selectAddress(created.id);
      closeAddressModal();
    } catch (e) {
      alert(e?.message || 'Unable to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await deleteAddress(id);
      closeAddressModal();
    } catch (e) {
      alert(e?.message || 'Unable to delete address');
    }
  };

  return (
    <div className="profile-page">
      <ProfileHeader />

      <div className="profile-content">
        {/* Sidebar Menu */}
        <div className="profile-sidebar">
          <ul className="profile-menu">
            <li className="menu-item" onClick={() => handleNavigation('orders')}>Manage Orders</li>
            <li className="menu-item" onClick={() => handleNavigation('credits')}>Credits</li>
            <li className="menu-item" onClick={() => handleNavigation('payment')}>Payment</li>
            <li className="menu-item active">Address</li>
            <li className="menu-item" onClick={() => handleNavigation('messages')}>Messages</li>
            <li className="menu-item" onClick={() => handleNavigation('faqs')}>FAQs</li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="profile-main addresses-main">
          {/* Action Button */}
          <div className="addresses-header">
            <button 
              className="add-new-address-btn"
              onClick={() => openAddressModal()}
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
                         onClick={() => openAddressModal(addr)}
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
      <AddressModal
        isOpen={addressModalOpen}
        onClose={closeAddressModal}
        initialData={editingAddress || {}}
        mode={editingAddress ? 'edit' : 'add'}
        onSave={handleSaveAddress}
        onUseCurrentLocation={addFromGeolocation}
        onDelete={handleDeleteAddress}
      />


    </div>
  );
};

export default AddressesPage;