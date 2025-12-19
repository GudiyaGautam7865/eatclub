import React, { useState } from "react";
import "./AddressDropdown.css";
import { useAddressContext } from "../../../context/AddressContext";
import AddressModal from "../../address/AddressModal.jsx";

function AddressDropdown({ onClose }) {
  const [locLoading, setLocLoading] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const { addresses, selectAddress, addFromGeolocation, createAddress, updateAddress, deleteAddress } = useAddressContext();
  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await deleteAddress(id);
      closeAddressModal();
      onClose?.();
    } catch (e) {
      alert(e?.message || 'Unable to delete address');
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      setLocLoading(true);
      const { address, latitude, longitude } = await addFromGeolocation();
      const newAddr = await createAddress({
        label: 'Current Location',
        address,
        latitude,
        longitude,
        type: 'Other',
      });
      selectAddress(newAddr.id);
      onClose?.();
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Unable to get your location. Please enable location permissions.");
    } finally {
      setLocLoading(false);
    }
  };

  const openAddressModal = (addr = null) => { setEditingAddress(addr); setAddressModalOpen(true); };
  const closeAddressModal = () => { setEditingAddress(null); setAddressModalOpen(false); };
  const handleSaveAddress = async (payload) => {
    try {
      const saved = editingAddress ? await updateAddress(editingAddress.id, payload) : await createAddress(payload);
      selectAddress(saved.id);
      closeAddressModal();
      onClose?.();
    } catch (e) {
      alert(e?.message || 'Unable to save address');
    }
  };

  const handleSelectAddress = (address) => {
    if (!address) return;
    selectAddress(address.id);
    onClose();
  };

  return (
    <div className="ec-address-dropdown-modal">
      {/* Header */}
      <div className="ec-address-modal-header">
        <h3>Select Delivery Location</h3>
        <button className="ec-close-btn" onClick={(e) => { e.stopPropagation(); onClose?.(); }}>
          ×
        </button>
      </div>

      {/* Removed manual enter-location input; using shared modal for manual entry */}

      {/* Use Current Location */}
      <div className="ec-location-option" style={{ display: 'flex', gap: 8 }}>
        <button className="ec-location-btn" onClick={handleUseCurrentLocation} disabled={locLoading}>
          <span className="ec-location-icon-lg">📍</span>
          <span>{locLoading ? 'Detecting...' : 'Use my current location'}</span>
        </button>
        <button className="ec-location-btn" onClick={() => openAddressModal()}>
          <span className="ec-location-icon-lg">➕</span>
          <span>Add Address</span>
        </button>
      </div>

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <>
          <div className="ec-saved-addresses-header">SAVED ADDRESS</div>
          <div className="ec-saved-addresses-list">
            {addresses.map((addr) => (
              <div key={addr.id} className="ec-saved-address-item" style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  className="ec-saved-address-select"
                  onClick={() => handleSelectAddress(addr)}
                  style={{ display: 'flex', alignItems: 'center', flex: 1 }}
                >
                  <span className="ec-address-type-icon">
                    {addr.type === "Home" ? "🏠" : addr.type === "Work" ? "💼" : "📍"}
                  </span>
                  <div className="ec-address-content">
                    <div className="ec-address-type">{addr.label}</div>
                    <div className="ec-address-detail">{addr.address}</div>
                  </div>
                </button>
                <button className="ec-edit-address-btn" onClick={() => openAddressModal(addr)} style={{ marginLeft: 8 }}>
                  Edit
                </button>
                <button className="ec-delete-address-btn" onClick={() => handleDeleteAddress(addr.id)} style={{ marginLeft: 8 }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}

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
}

export default AddressDropdown;
