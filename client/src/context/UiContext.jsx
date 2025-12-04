import React from "react";
import { createContext, useContext, useState } from "react";

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const value = {
    isLoading,
    setIsLoading,
    // later you can add: showToast, openModal, etc.
  };

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUiContext() {
  const ctx = useContext(UiContext);
  if (!ctx) {
    throw new Error("useUiContext must be used inside UiProvider");
  }
  return ctx;
}
