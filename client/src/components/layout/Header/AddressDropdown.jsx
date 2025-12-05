import React, { useState } from "react";
import "./AddressDropdown.css";
import { useAddressContext } from "../../../context/AddressContext";

function AddressDropdown({ onClose }) {
  const [searchInput, setSearchInput] = useState("");
  const { addresses, selectAddress, addFromGeolocation, createAddress } = useAddressContext();

  const handleUseCurrentLocation = async () => {
    try {
      const { address } = await addFromGeolocation();
      const newAddr = createAddress({
        label: 'Current Location',
        address,
        type: 'Other',
      });
      selectAddress(newAddr.id);
      onClose();
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Unable to get your location. Please enable location permissions.");
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
        <button className="ec-close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      {/* Search Box */}
      <div className="ec-address-search-wrapper">
        <input
          type="text"
          className="ec-address-search"
          placeholder="Enter Delivery Location"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <span className="ec-location-icon">📍</span>
      </div>

      {/* Info Text */}
      <div className="ec-address-info-text">
        <p>Please enable permission to access your location or type your location in the search box above.</p>
        <p style={{ marginTop: "5px" }}>We need your delivery location to serve you a delicious meal!</p>
      </div>

      {/* Use Current Location */}
      <div className="ec-location-option">
        <button className="ec-location-btn" onClick={handleUseCurrentLocation}>
          <span className="ec-location-icon-lg">📍</span>
          <span>Use my current location</span>
        </button>
      </div>

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <>
          <div className="ec-saved-addresses-header">SAVED ADDRESS</div>
          <div className="ec-saved-addresses-list">
            {addresses.map((addr) => (
              <button
                key={addr.id}
                className="ec-saved-address-item"
                onClick={() => handleSelectAddress(addr)}
              >
                <span className="ec-address-type-icon">
                  {addr.type === "Home" ? "🏠" : addr.type === "Work" ? "💼" : "📍"}
                </span>
                <div className="ec-address-content">
                  <div className="ec-address-type">{addr.label}</div>
                  <div className="ec-address-detail">{addr.address}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AddressDropdown;
