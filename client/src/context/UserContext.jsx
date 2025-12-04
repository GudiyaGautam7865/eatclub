// UserContext for managing user state
import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
	const [user, setUser] = useState(null); // later Siddhesh can integrate real data

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

