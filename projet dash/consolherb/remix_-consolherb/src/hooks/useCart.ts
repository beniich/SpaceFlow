import { useState, useCallback } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: Omit<CartItem, 'qty'> & { qty?: number }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + (item.qty ?? 1) } : i
        );
      }
      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return { cart, addToCart, removeFromCart, clearCart, total };
}
