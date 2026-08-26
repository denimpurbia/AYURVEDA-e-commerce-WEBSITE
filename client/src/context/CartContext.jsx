import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, shippingFee: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      // Local storage fallback for unauthenticated visitors
      const localCart = JSON.parse(localStorage.getItem('guest_cart') || '{"items":[],"subtotal":0,"shippingFee":0,"totalAmount":0}');
      setCart(localCart);
      return;
    }

    try {
      setLoading(true);
      const res = await API.get('/cart');
      if (res.success) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Error loading cart:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      // Guest cart logic
      const localCart = JSON.parse(localStorage.getItem('guest_cart') || '{"items":[]}');
      const productId = product._id || product.id;
      const price = product.discountPrice > 0 ? product.discountPrice : product.price;

      const existingIndex = localCart.items.findIndex(item => (item.product._id || item.product) === productId);

      if (existingIndex > -1) {
        localCart.items[existingIndex].quantity += quantity;
      } else {
        localCart.items.push({
          product: product,
          quantity: quantity,
          price: price,
        });
      }

      const subtotal = localCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
      const totalAmount = subtotal + shippingFee;

      const updated = { items: localCart.items, subtotal, shippingFee, totalAmount };
      localStorage.setItem('guest_cart', JSON.stringify(updated));
      setCart(updated);
      return { success: true, message: 'Added to cart' };
    }

    try {
      const res = await API.post('/cart', { productId: product._id || product.id, quantity });
      if (res.success) {
        setCart(res.data);
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) {
      const localCart = JSON.parse(localStorage.getItem('guest_cart') || '{"items":[]}');
      const idx = localCart.items.findIndex(item => (item.product._id || item.product) === productId);
      if (idx > -1) {
        localCart.items[idx].quantity = quantity;
        const subtotal = localCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
        const totalAmount = subtotal + shippingFee;
        const updated = { items: localCart.items, subtotal, shippingFee, totalAmount };
        localStorage.setItem('guest_cart', JSON.stringify(updated));
        setCart(updated);
      }
      return;
    }

    try {
      const res = await API.put(`/cart/${productId}`, { quantity });
      if (res.success) {
        setCart(res.data);
      }
    } catch (err) {
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) {
      const localCart = JSON.parse(localStorage.getItem('guest_cart') || '{"items":[]}');
      localCart.items = localCart.items.filter(item => (item.product._id || item.product) !== productId);
      const subtotal = localCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
      const totalAmount = subtotal + shippingFee;
      const updated = { items: localCart.items, subtotal, shippingFee, totalAmount };
      localStorage.setItem('guest_cart', JSON.stringify(updated));
      setCart(updated);
      return;
    }

    try {
      const res = await API.delete(`/cart/${productId}`);
      if (res.success) {
        setCart(res.data);
      }
    } catch (err) {
      throw err;
    }
  };

  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem('guest_cart');
      setCart({ items: [], subtotal: 0, shippingFee: 0, totalAmount: 0 });
      return;
    }

    try {
      const res = await API.delete('/cart');
      if (res.success) {
        setCart({ items: [], subtotal: 0, shippingFee: 0, totalAmount: 0 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const cartCount = cart.items ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, loading, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
