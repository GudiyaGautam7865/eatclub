// Placeholder: CartContext for managing cart state
import React from "react";
import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
	const [items, setItems] = useState([]);

	const value = {
		items,
		setItems,
		// later Omkar can add: addItem, removeItem etc.
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
