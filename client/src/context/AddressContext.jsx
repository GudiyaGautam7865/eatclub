import React, { createContext, useContext, useEffect, useState } from 'react';
import { addressService } from '../services/addressService';

const AddressContext = createContext(null);

export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load addresses on mount
  useEffect(() => {
    const loaded = addressService.getAll();
    const selected = addressService.getSelectedId();
    setAddresses(loaded);
    setSelectedId(selected);
  }, []);

  // Get selected address object
  const selectedAddress = addresses.find(a => a.id === selectedId) || null;

  // Create address
  const createAddress = (data) => {
    const newAddr = addressService.create(data);
    setAddresses(prev => [...prev, newAddr]);
    return newAddr;
  };

  // Update address
  const updateAddress = (id, updates) => {
    const updated = addressService.update(id, updates);
    if (updated) {
      setAddresses(prev => prev.map(a => a.id === id ? updated : a));
    }
    return updated;
  };

  // Delete address
  const deleteAddress = (id) => {
    addressService.delete(id);
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  // Select address
  const selectAddress = (id) => {
    setSelectedId(id);
    addressService.saveSelectedId(id);
  };

  // Get current location and create address
  const addFromGeolocation = async () => {
    setLoading(true);
    try {
      const { latitude, longitude, address } = await addressService.getCurrentLocation();
      return { latitude, longitude, address };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    addresses,
    selectedAddress,
    selectedId,
    loading,
    createAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
    addFromGeolocation,
  };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export function useAddressContext() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error('useAddressContext must be used inside AddressProvider');
  return ctx;
}
