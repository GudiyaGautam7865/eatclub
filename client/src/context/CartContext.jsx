// Placeholder: CartContext for managing cart state
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = 'eatclub_cart_v1';

const CartContext = createContext(null);

export function CartProvider({ children }) {
	// hydrate from localStorage when available
	const initial = (() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) return JSON.parse(raw);
		} catch (e) {}
		return {
			items: [
				{ id: 101, section: 'WeFit - Protein Meals', title: 'Pesto & Paneer Supreme', price: 209, oldPrice: 299, qty: 1 },
				{ id: 102, section: 'WeFit - Protein Meals', title: 'Grilled Veg Delight', price: 209, oldPrice: 299, qty: 1 }
			],
			hasMembership: true,
			appliedCoupon: null,
			appliedSavings: 0,
		};
	})();

	const [items, setItems] = useState(initial.items || []);
	// membershipHidden is the persistent flag indicating the user explicitly hid membership
	const [membershipHidden, setMembershipHidden] = useState(initial.membershipHidden ?? (initial.hasMembership === false));
	const [hasMembership, setHasMembership] = useState(!(membershipHidden));
	const [appliedCoupon, setAppliedCoupon] = useState(initial.appliedCoupon || null);
	const [appliedSavings, setAppliedSavings] = useState(initial.appliedSavings || 0);

	// In dev mode, if no items exist (fresh clone or cleared storage), seed example items
	useEffect(() => {
		if (process.env.NODE_ENV === 'development') {
			if ((!items || items.length === 0) && !initial.items) {
				setItems([
					{ id: 101, section: 'WeFit - Protein Meals', title: 'Pesto & Paneer Supreme', price: 209, oldPrice: 299, qty: 1 },
					{ id: 102, section: 'WeFit - Protein Meals', title: 'Grilled Veg Delight', price: 209, oldPrice: 299, qty: 1 }
				]);
				setMembershipHidden(false);
				setHasMembership(true);
			}
		}
	}, []); 

	// derived values
	const itemsCount = items.reduce((s, it) => s + (it.qty || 0), 0);
	const itemsTotal = items.reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0);
	const membershipPrice = hasMembership ? (appliedCoupon ? 0 : 9) : 0;
	const total = Math.max(0, itemsTotal + membershipPrice - (appliedSavings || 0));

	// persist to localStorage on change
	useEffect(() => {
		try {
			const out = { items, membershipHidden, appliedCoupon, appliedSavings };
			localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
		} catch (e) {}
	}, [items, membershipHidden, appliedCoupon, appliedSavings]);

	// helpers
	const addItem = (item) => {
		setItems(prev => {
			const found = prev.find(p => p.id === item.id);
			if (found) return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + (item.qty || 1) } : p);
			return [...prev, { ...item, qty: item.qty || 1 }];
		});
	};

	const incQty = (id) => setItems(prev => prev.map(it => it.id === id ? { ...it, qty: (it.qty || 0) + 1 } : it));

	const decQty = (id) => setItems(prev => {
		return prev.flatMap(it => {
			if (it.id === id) {
				const nq = Math.max(0, (it.qty || 0) - 1);
				return nq > 0 ? [{ ...it, qty: nq }] : [];
			}
			return [it];
		});
	});

	const removeItem = (id) => setItems(prev => prev.filter(it => it.id !== id));

	const applyCoupon = (coupon) => {
		setAppliedCoupon(coupon);
		setAppliedSavings(coupon?.save || 0);
	};

	const removeCoupon = () => {
		setAppliedCoupon(null);
		setAppliedSavings(0);
	};

	const hideMembership = () => {
		setMembershipHidden(true);
		setHasMembership(false);
	};

	const showMembership = () => {
		setMembershipHidden(false);
		setHasMembership(true);
	};

	const value = {
		items,
		setItems,
		addItem,
		incQty,
		decQty,
		removeItem,
		hasMembership,
		membershipHidden,
		hideMembership,
		showMembership,
		appliedCoupon,
		appliedSavings,
		applyCoupon,
		removeCoupon,
		itemsCount,
		itemsTotal,
		membershipPrice,
		total,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
	const ctx = useContext(CartContext);
	if (!ctx) {
		throw new Error("useCartContext must be used inside CartProvider");
	}
	return ctx;
}
