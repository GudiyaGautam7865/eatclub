import Order from '../models/Order.js';

// Shared persistence control for tracking updates.
// WHY: Reduce DB write pressure by throttling and skipping no-op updates.
const lastPersist = new Map(); // orderId -> { ts: number, lat: number, lng: number }

const getConfig = () => {
  return {
    intervalMs: Number(process.env.TRACKING_PERSIST_INTERVAL_MS || 5000), // default 5s
    minDelta: Number(process.env.TRACKING_MIN_LATLNG_DELTA || 0.00005),   // ~5e-5 deg ≈ 5m
    dbMaxTimeMs: Number(process.env.TRACKING_DB_MAX_TIME_MS || 2000),
  };
};

export async function persistOrderLocation(orderId, lat, lng) {
  const { intervalMs, minDelta, dbMaxTimeMs } = getConfig();
  const now = Date.now();

  if (!orderId || typeof lat !== 'number' || typeof lng !== 'number') {
    return { persisted: false, reason: 'invalid-input' };
  }

  const prev = lastPersist.get(orderId);

  // Throttle by time
  if (prev && now - prev.ts < intervalMs) {
    return { persisted: false, reason: 'throttled' };
  }

  // Skip if movement is not meaningful
  if (prev) {
    const dLat = Math.abs(lat - prev.lat);
    const dLng = Math.abs(lng - prev.lng);
    if (dLat < minDelta && dLng < minDelta) {
      return { persisted: false, reason: 'no-change' };
    }
  }

  // Persist atomically to avoid document-level locking delays
  const start = process.hrtime.bigint();
  try {
    await Order.updateOne(
      { _id: orderId },
      { $set: { currentLocation: { lat, lng, updatedAt: new Date() } } },
      { maxTimeMS: dbMaxTimeMs }
    );
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;

    // Update memory state
    lastPersist.set(orderId, { ts: now, lat, lng });

    // Lightweight timing log for observability
    if (durationMs > 250) {
      console.warn('⏱️  Tracking write slow:', Math.round(durationMs), 'ms for order', orderId);
    }

    return { persisted: true };
  } catch (err) {
    console.error('✗ Tracking persist error:', err.message);
    return { persisted: false, reason: 'error', error: err.message };
  }
}

export function cleanupOrderPersistence(orderId) {
  lastPersist.delete(orderId);
}
