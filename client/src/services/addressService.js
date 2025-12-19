import apiClient from './apiClient.js';

const STORAGE_KEY = 'eatclub_addresses_v2';

const getKey = (userId) => `${STORAGE_KEY}_${userId || 'guest'}`;
const getSelectedKey = (userId) => `${getKey(userId)}_selected`;

const normalizeAddressText = (address) => (address || '').trim().toLowerCase();
const normalizeDoc = (doc) => {
  if (!doc) return null;
  const { _id, id, ...rest } = doc;
  return { id: id || _id, ...rest };
};

export const addressService = {
  // Local cache helpers
  getAll(userId) {
    try {
      const raw = localStorage.getItem(getKey(userId));
      const parsed = raw ? JSON.parse(raw) : [];
      return parsed.map(normalizeDoc);
    } catch {
      return [];
    }
  },

  getSelectedId(userId) {
    try {
      const val = localStorage.getItem(getSelectedKey(userId));
      return val || null;
    } catch {
      return null;
    }
  },

  save(addresses, userId) {
    try {
      localStorage.setItem(getKey(userId), JSON.stringify(addresses || []));
    } catch (e) {
      console.error('Failed to save addresses:', e);
    }
  },

  saveSelectedId(id, userId) {
    try {
      localStorage.setItem(getSelectedKey(userId), id || '');
    } catch (e) {
      console.error('Failed to save selected address:', e);
    }
  },

  // Remote sync
  async fetchRemote(userId) {
    const resp = await apiClient('/addresses', { method: 'GET' });
    const list = (resp.data || resp.addresses || resp || []).map(normalizeDoc);
    this.save(list, userId);
    return list;
  },

  // Create new address with server + cache
  async create(addressData, userId) {
    if (!addressData?.address) {
      throw new Error('Address line is required');
    }

    // Dedupe locally before hitting backend
    const cached = this.getAll(userId);
    const normalized = normalizeAddressText(addressData.address);
    const existing = cached.find((a) => normalizeAddressText(a.address) === normalized);
    if (existing) {
      this.saveSelectedId(existing.id, userId);
      return existing;
    }

    const resp = await apiClient('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
    const created = normalizeDoc(resp.data || resp.address || resp);
    const updatedCache = [...cached.filter((a) => a.id !== created.id), created];
    this.save(updatedCache, userId);
    return created;
  },

  async update(id, updates, userId) {
    const resp = await apiClient(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    const updated = normalizeDoc(resp.data || resp.address || resp);
    const cache = this.getAll(userId).map((a) => (a.id === id ? updated : a));
    this.save(cache, userId);
    return updated;
  },

  async delete(id, userId) {
    await apiClient(`/addresses/${id}`, { method: 'DELETE' });
    const cache = this.getAll(userId).filter((a) => a.id !== id);
    this.save(cache, userId);
    if (this.getSelectedId(userId) === id) {
      this.saveSelectedId(null, userId);
    }
  },

  // Get current location using browser geolocation
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Placeholder reverse geocode; replace with real API
          const address = `Detected location (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`;
          resolve({ latitude, longitude, address });
        },
        (error) => reject(error),
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  },
};
