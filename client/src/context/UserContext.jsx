// UserContext for managing user state
import React from "react";
import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
	const [user, setUser] = useState(() => {
		try {
			const savedUser = localStorage.getItem('ec_user');
			return savedUser ? JSON.parse(savedUser) : null;
		} catch {
			return null;
		}
	});

	const value = {
		user,
		setUser,
		isLoggedIn: !!user,
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
	const ctx = useContext(UserContext);
	if (!ctx) {
		throw new Error("useUserContext must be used inside UserProvider");
	}
	return ctx;
	}

