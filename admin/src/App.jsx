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

import AdminMessagesPage from './pages/Messages/AdminMessagesPage';

import AdminSettingsPage from './pages/Settings/AdminSettingsPage';

import { useAdminAuth } from './context/AdminAuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#123D2A] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>

          <p className="text-sm font-medium text-[#123D2A]">
            Checking admin session...
          </p>
        </div>
      </div>
    );
  }

  if (!admin || admin.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Admin Login */}
      <Route
        path="/admin/login"
        element={<AdminLoginPage />}
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboardPage />
          </ProtectedAdminRoute>
        }
      />

      {/* Products */}
      <Route
        path="/admin/products"
        element={
          <ProtectedAdminRoute>
            <AdminProductsPage />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/products/add"
        element={
          <ProtectedAdminRoute>
            <AdminAddProductPage />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/products/:id/edit"
        element={
          <ProtectedAdminRoute>
            <AdminEditProductPage />
          </ProtectedAdminRoute>
        }
      />

      {/* Categories */}
      <Route
        path="/admin/categories"
        element={
          <ProtectedAdminRoute>
            <AdminCategoriesPage />
          </ProtectedAdminRoute>
        }
      />

      {/* Orders */}
      <Route
        path="/admin/orders"
        element={
          <ProtectedAdminRoute>
            <AdminOrdersPage />
          </ProtectedAdminRoute>
        }
      />

      {/* Users */}
      <Route
        path="/admin/users"
        element={
          <ProtectedAdminRoute>
            <AdminUsersPage />
          </ProtectedAdminRoute>
        }
      />

      {/* Reviews */}
      <Route
        path="/admin/reviews"
        element={
          <ProtectedAdminRoute>
            <AdminReviewsPage />
          </ProtectedAdminRoute>
        }
      />

      {/* Messages */}
      <Route
        path="/admin/messages"
        element={
          <ProtectedAdminRoute>
            <AdminMessagesPage />
          </ProtectedAdminRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/admin/settings"
        element={
          <ProtectedAdminRoute>
            <AdminSettingsPage />
          </ProtectedAdminRoute>
        }
      />

      {/* Root */}
      <Route
        path="/"
        element={<Navigate to="/admin/login" replace />}
      />

      {/* Unknown Routes */}
      <Route
        path="*"
        element={<Navigate to="/admin/login" replace />}
      />
    </Routes>
  );
};

export default App;