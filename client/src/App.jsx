import React from 'react';
import { Routes, Route } from 'react-router-dom';

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
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/shop" element={<ShopPage />} />
      <Route path="/category/:slug" element={<ShopPage />} />

      <Route
        path="/product/:slug"
        element={<ProductDetailsPage />}
      />

      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/account" element={<AccountPage />} />

      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:id" element={<OrdersPage />} />

      {/* Product Review - Delivered Order Only */}
      <Route
        path="/product-review/:productId"
        element={<ProductReviewPage />}
      />

      <Route path="/wishlist" element={<WishlistPage />} />

      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FaqPage />} />

      <Route path="/privacy" element={<LegalPage />} />
      <Route path="/terms" element={<LegalPage />} />
      <Route path="/refund-policy" element={<LegalPage />} />
    </Routes>
  );
}

export default App;