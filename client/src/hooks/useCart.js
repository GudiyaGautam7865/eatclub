import { useCartContext } from '../context/CartContext';

export default function useCart() {
  const cartContext = useCartContext();

  const getItemQuantity = (itemId) => {
    const item = cartContext.items.find((it) => it.id === itemId);
    return item ? item.qty : 0;
  };

  const addToCart = (item) => {
    cartContext.addItem({
      ...item,
      qty: 1,
    });
  };

  const updateItemQuantity = (itemId, nextQuantity) => {
    if (nextQuantity <= 0) {
      cartContext.removeItem(itemId);
    } else {
      const currentQty = getItemQuantity(itemId);
      const diff = nextQuantity - currentQty;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          cartContext.incQty(itemId);
        }
      } else if (diff < 0) {
        for (let i = 0; i < Math.abs(diff); i++) {
          cartContext.decQty(itemId);
        }
      }
    }
  };

  const removeFromCart = (itemId) => {
    cartContext.removeItem(itemId);
  };

  return {
    ...cartContext,
    getItemQuantity,
    addToCart,
    updateItemQuantity,
    removeFromCart,
  };
}
