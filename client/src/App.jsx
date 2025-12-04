import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { UiProvider } from "./context/UiContext";

function App() {
  return (
    <UiProvider>
      <UserProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </UserProvider>
    </UiProvider>
  );
}

export default App;
