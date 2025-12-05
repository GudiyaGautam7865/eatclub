import React from "react";
import AppRoutes from "./routes/AppRoutes";
import MenuPage from "./pages/Menu/MenuPage";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { UiProvider } from "./context/UiContext";
import { AddressProvider } from "./context/AddressContext";

function App() {
  return (
    <UiProvider>
      <UserProvider>
        <AddressProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AddressProvider>
      </UserProvider>
    </UiProvider>
  );
}

export default App;

