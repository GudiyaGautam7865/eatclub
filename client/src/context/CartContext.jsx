// CartContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "eatclub_cart_v1";
const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Load initial state from localStorage or fallback
  const initial = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    return {
      items: [],
      membershipHidden: false,
      appliedCoupon: null,
      appliedSavings: 0,
    };
  })();

  // State
  const [items, setItems] = useState(initial.items || []);
  const [membershipHidden, setMembershipHidden] = useState(initial.membershipHidden || false);
  const [hasMembership, setHasMembership] = useState(!initial.membershipHidden);
  const [appliedCoupon, setAppliedCoupon] = useState(initial.appliedCoupon || null);
  const [appliedSavings, setAppliedSavings] = useState(initial.appliedSavings || 0);

  // Derived values
  const itemsCount = items.reduce((s, it) => s + (it.qty || 0), 0);
  const itemsTotal = items.reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0);
  const membershipPrice = hasMembership ? (appliedCoupon ? 0 : 9) : 0;
  const total = Math.max(0, itemsTotal + membershipPrice - appliedSavings);

  // Persist state to localStorage
  useEffect(() => {
    try {
      const out = {
        items,
        membershipHidden,
        appliedCoupon,
        appliedSavings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
    } catch (e) {}
  }, [items, membershipHidden, appliedCoupon, appliedSavings]);

  // Item helpers
  const addItem = (item) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + (item.qty || 1) } : p
        );
      }
      return [...prev, { ...item, qty: item.qty || 1 }];
    });
  };

  const incQty = (id) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it))
    );

  const decQty = (id) =>
    setItems((prev) =>
      prev.flatMap((it) => {
        if (it.id === id) {
          const newQty = it.qty - 1;
          return newQty > 0 ? [{ ...it, qty: newQty }] : [];
        }
        return [it];
      })
    );

  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  // Coupon helpers
  const applyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
    setAppliedSavings(coupon?.save || 0);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setAppliedSavings(0);
  };

  // Membership helpers
  const hideMembership = () => {
    setMembershipHidden(true);
    setHasMembership(false);
  };

  const showMembership = () => {
    setMembershipHidden(false);
    setHasMembership(true);
  };

  const value = {
    // items
    items,
    addItem,
    incQty,
    decQty,
    removeItem,
    itemsCount,
    itemsTotal,

    // membership
    hasMembership,
    membershipHidden,
    hideMembership,
    showMembership,
    membershipPrice,

    // coupons
    appliedCoupon,
    appliedSavings,
    applyCoupon,
    removeCoupon,

    // total cost
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used inside CartProvider");
  return ctx;
}
