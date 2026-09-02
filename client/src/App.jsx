import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import SplashScreen from './components/SplashScreen';
import ScrollToTop from './components/ScrollToTop';
import MobileBottomNav from './components/mobile/MobileBottomNav';

import HomePage from './pages/Home/HomePage';
import ShopPage from './pages/Shop/ShopPage';
import ProductDetailsPage from './pages/ProductDetails/ProductDetailsPage';
import CartPage from './pages/Cart/CartPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import AccountPage from './pages/Account/AccountPage';
import OrdersPage from './pages/Orders/OrdersPage';
import WishlistPage from './pages/Wishlist/WishlistPage';
import AboutPage from './pages/About/AboutPage';
import ContactPage from './pages/Contact/ContactPage';
import FaqPage from './pages/FAQ/FaqPage';
import LegalPage from './pages/Legal/LegalPage';
import ProductReviewPage from './pages/ProductReview/ProductReviewPage';

function App() {
  const [loading, setLoading] = useState(() => {
    return window.innerWidth < 1024;
  });

  useEffect(() => {
    // Desktop / Laptop par splash bilkul nahi
    if (window.innerWidth >= 1024) {
      setLoading(false);
      return;
    }

    // Mobile par splash
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ONLY MOBILE SPLASH SCREEN */}
      {loading && <SplashScreen />}

      <div className="min-h-screen pb-[76px] lg:pb-0">
        <ScrollToTop />

        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* Shop */}
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/category/:slug" element={<ShopPage />} />

          {/* Product Details */}
          <Route
            path="/product/:slug"
            element={<ProductDetailsPage />}
          />

          {/* Cart & Checkout */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Account */}
          <Route path="/account" element={<AccountPage />} />

          {/* Orders */}
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrdersPage />} />

          {/* Product Review */}
          <Route
            path="/product-review/:productId"
            element={<ProductReviewPage />}
          />

          {/* Wishlist */}
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Information Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />

          {/* Legal Pages */}
          <Route path="/privacy" element={<LegalPage />} />
          <Route path="/terms" element={<LegalPage />} />
          <Route
            path="/refund-policy"
            element={<LegalPage />}
          />
        </Routes>

        {/* MOBILE BOTTOM NAVIGATION */}
        <MobileBottomNav />
      </div>
    </>
  );
}

export default App;