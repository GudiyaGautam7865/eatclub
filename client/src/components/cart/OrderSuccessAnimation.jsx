import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function OrderSuccessAnimation({ onComplete }) {
  useEffect(() => {
    // fire a quick burst
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    const t = setTimeout(() => {
      onComplete && onComplete();
    }, 1500);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 12, textAlign: 'center', minWidth: 260 }}>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Order Successful!</div>
        <div style={{ color: '#555' }}>Redirecting to your orders…</div>
      </div>
    </div>
  );
}
