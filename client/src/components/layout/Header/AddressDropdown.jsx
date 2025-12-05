import React, { useMemo, useState } from "react";
import "./AddressDropdown.css";

function AddressDropdown({ isLoggedIn, addresses = [], onSelect, onClose }) {
  const [searchInput, setSearchInput] = useState("");
  const savedAddresses = useMemo(
    () => (isLoggedIn ? addresses : []),
    [addresses, isLoggedIn]
  );

  const handleUseCurrentLocation = () => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Current location:", position.coords);
          onSelect?.("Using current location");
          onClose();
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please enable location permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSelectAddress = (address) => {
    if (!address) return;
    const label = address.label || address.address || address.type || "Selected address";
    onSelect?.(label);
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

      {/* Saved Addresses - Only if logged in */}
      {isLoggedIn && savedAddresses.length > 0 && (
        <>
          <div className="ec-saved-addresses-header">SAVED ADDRESS</div>
          <div className="ec-saved-addresses-list">
            {savedAddresses.map((addr) => (
              <button
                key={addr.id}
                className="ec-saved-address-item"
                onClick={() => handleSelectAddress(addr)}
              >
                <span className="ec-address-type-icon">
                  {addr.type === "Home" ? "🏠" : "💼"}
                </span>
                <div className="ec-address-content">
                  <div className="ec-address-type">{addr.type}</div>
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
