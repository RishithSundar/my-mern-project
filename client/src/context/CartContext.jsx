import { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // The Upgraded addToCart function
  const addToCart = (product) => {
    setCart((prevCart) => {
      // 1. Check if this EXACT item (same ID and same Size) is already in the cart
      const existingItemIndex = prevCart.findIndex(
        (item) => item._id === product._id && item.selectedSize === product.selectedSize
      );

      if (existingItemIndex >= 0) {
        // 2. If it exists, just increase the quantity!
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += (product.quantity || 1);
        return updatedCart;
      } else {
        // 3. If it is brand new, add it to the cart with its quantity
        return [...prevCart, { ...product, quantity: product.quantity || 1 }];
      }
    });
    alert("Added to Cart! 🛒");
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}