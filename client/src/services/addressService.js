const STORAGE_KEY = 'eatclub_addresses_v1';

// Mock reverse geocoding - replace with real API later
const mockReverseGeocode = (lat, lng) => {
  const areas = ['Pimple Saudagar', 'Hinjewadi', 'Wakad', 'Baner', 'Aundh'];
  const area = areas[Math.floor(Math.random() * areas.length)];
  return `${area}, Pune, Maharashtra 411027`;
};

export const addressService = {
  // Get all addresses from localStorage
  getAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  // Get selected address ID
  getSelectedId() {
    try {
      return localStorage.getItem(`${STORAGE_KEY}_selected`) || null;
    } catch {
      return null;
    }
  },

  // Save addresses to localStorage
  save(addresses) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    } catch (e) {
      console.error('Failed to save addresses:', e);
    }
  },

  // Save selected address ID
  saveSelectedId(id) {
    try {
      localStorage.setItem(`${STORAGE_KEY}_selected`, id);
    } catch (e) {
      console.error('Failed to save selected address:', e);
    }
  },

  // Create new address
  create(addressData) {
    const addresses = this.getAll();
    const newAddress = {
      id: Date.now().toString(),
      ...addressData,
      createdAt: new Date().toISOString(),
    };
    addresses.push(newAddress);
    this.save(addresses);
    return newAddress;
  },

  // Update existing address
  update(id, updates) {
    const addresses = this.getAll();
    const index = addresses.findIndex(a => a.id === id);
    if (index === -1) return null;
    addresses[index] = { ...addresses[index], ...updates };
    this.save(addresses);
    return addresses[index];
  },

  // Delete address
  delete(id) {
    const addresses = this.getAll().filter(a => a.id !== id);
    this.save(addresses);
    if (this.getSelectedId() === id) {
      this.saveSelectedId(null);
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
          const address = mockReverseGeocode(latitude, longitude);
          resolve({ latitude, longitude, address });
        },
        (error) => reject(error),
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  },
};
