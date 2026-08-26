import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });

  const fetchWishlist = async () => {
    if (!user) {
      const local = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
      setWishlist({ products: local });
      return;
    }

    try {
      const res = await API.get('/wishlist');
      if (res.success) {
        setWishlist(res.data);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err.message);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      let local = JSON.parse(localStorage.getItem('guest_wishlist') || '[]');
      const exists = local.some(p => (p._id || p) === productId);
      if (exists) {
        local = local.filter(p => (p._id || p) !== productId);
      } else {
        local.push({ _id: productId });
      }
      localStorage.setItem('guest_wishlist', JSON.stringify(local));
      setWishlist({ products: local });
      return;
    }

    try {
      const res = await API.post(`/wishlist/${productId}`);
      if (res.success) {
        setWishlist(res.data);
      }
    } catch (err) {
      throw err;
    }
  };

  const isInWishlist = (productId) => {
    if (!wishlist || !wishlist.products) return false;
    return wishlist.products.some((p) => (typeof p === 'object' ? p._id === productId : p === productId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
