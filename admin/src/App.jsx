import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLoginPage from './pages/Login/AdminLoginPage';
import AdminDashboardPage from './pages/Dashboard/AdminDashboardPage';
import AdminProductsPage from './pages/Products/AdminProductsPage';
import AdminAddProductPage from './pages/Products/AdminAddProductPage';
import AdminEditProductPage from './pages/Products/AdminEditProductPage';
import AdminCategoriesPage from './pages/Categories/AdminCategoriesPage';
import AdminOrdersPage from './pages/Orders/AdminOrdersPage';
import AdminUsersPage from './pages/Users/AdminUsersPage';
import AdminReviewsPage from './pages/Reviews/AdminReviewsPage';
import AdminSettingsPage from './pages/Settings/AdminSettingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/products/add" element={<AdminAddProductPage />} />
      <Route path="/admin/products/:id/edit" element={<AdminEditProductPage />} />
      <Route path="/admin/categories" element={<AdminCategoriesPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/reviews" element={<AdminReviewsPage />} />
      <Route path="/admin/settings" element={<AdminSettingsPage />} />
    </Routes>
  );
}

export default App;
