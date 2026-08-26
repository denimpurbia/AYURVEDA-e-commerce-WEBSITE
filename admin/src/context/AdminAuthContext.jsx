import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '../services/adminApi';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      // Only admin token is allowed in the admin panel
      const token = localStorage.getItem('ayurveda_admin_token');

      if (!token) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      try {
        const res = await adminApi.get('/auth/me');

        if (res.success && res.data?.role === 'admin') {
          setAdmin(res.data);
        } else {
          console.warn('User is not an admin. Access revoked.');

          localStorage.removeItem('ayurveda_admin_token');
          setAdmin(null);
        }
      } catch (err) {
        console.warn('Admin session expired or invalid.');

        localStorage.removeItem('ayurveda_admin_token');
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const loginAdmin = async (email, password) => {
    const res = await adminApi.post('/auth/login', {
      email: email.trim(),
      password,
    });

    if (res.success && res.data?.token) {
      if (res.data.role !== 'admin') {
        throw new Error(
          'Access Denied: Admin privileges required to access this dashboard.'
        );
      }

      // Store only the verified admin token
      localStorage.setItem('ayurveda_admin_token', res.data.token);

      setAdmin(res.data);
    }

    return res;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('ayurveda_admin_token');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);