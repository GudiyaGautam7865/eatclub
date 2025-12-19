import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { addressService } from '../services/addressService';
import { useUserContext } from './UserContext';

const AddressContext = createContext(null);

export function AddressProvider({ children }) {
  const { user } = useUserContext();
  const userId = useMemo(() => user?.id || user?._id || 'guest', [user]);

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load addresses when user changes
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const remote = await addressService.fetchRemote(userId);
        if (cancelled) return;
        setAddresses(remote);
        const storedSelected = addressService.getSelectedId(userId);
        setSelectedId(storedSelected || remote[0]?.id || null);
      } catch (err) {
        if (cancelled) return;
        const fallback = addressService.getAll(userId);
        setAddresses(fallback);
        setSelectedId(addressService.getSelectedId(userId));
        setError(err?.message || 'Failed to load addresses');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [userId]);

  // Get selected address object
  const selectedAddress = addresses.find(a => a.id === selectedId) || null;

  // Create address
  const createAddress = async (data) => {
    const newAddr = await addressService.create(data, userId);
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== newAddr.id);
      return [...filtered, newAddr];
    });
    setSelectedId(newAddr.id);
    addressService.saveSelectedId(newAddr.id, userId);
    return newAddr;
  };

  // Update address
  const updateAddress = async (id, updates) => {
    const updated = await addressService.update(id, updates, userId);
    if (updated) {
      setAddresses((prev) => prev.map((a) => (a.id === id ? updated : a)));
    }
    return updated;
  };

  // Delete address
  const deleteAddress = async (id) => {
    await addressService.delete(id, userId);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  // Select address
  const selectAddress = (id) => {
    setSelectedId(id);
    addressService.saveSelectedId(id, userId);
  };

  // Get current location and create address
  const addFromGeolocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const { latitude, longitude, address } = await addressService.getCurrentLocation();
      return { latitude, longitude, address };
    } catch (err) {
      setError(err?.message || 'Unable to fetch location');
      throw err;
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
    error,
  };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export function useAddressContext() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error('useAddressContext must be used inside AddressProvider');
  return ctx;
}
