import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // RESTORE USER SESSION
  // ============================================================

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem(
        'ayurveda_user_token'
      );

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await API.get('/auth/me');

        if (res.success && res.data) {
          setUser(res.data);
        } else {
          localStorage.removeItem(
            'ayurveda_user_token'
          );

          setUser(null);
        }
      } catch (error) {
        console.warn(
          'Failed to restore user session:',
          error.message
        );

        localStorage.removeItem(
          'ayurveda_user_token'
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ============================================================
  // LOGIN
  // ============================================================

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', {
        email,
        password,
      });

      if (
        res.success &&
        res.data &&
        res.data.token
      ) {
        localStorage.setItem(
          'ayurveda_user_token',
          res.data.token
        );

        setUser(res.data);
      }

      return res;
    } catch (error) {
      throw error;
    }
  };

  // ============================================================
  // REGISTER
  // ============================================================

  const register = async (userData) => {
    try {
      const res = await API.post(
        '/auth/register',
        userData
      );

      if (
        res.success &&
        res.data &&
        res.data.token
      ) {
        localStorage.setItem(
          'ayurveda_user_token',
          res.data.token
        );

        setUser(res.data);
      }

      return res;
    } catch (error) {
      throw error;
    }
  };

  // ============================================================
  // UPDATE USER PROFILE
  // ============================================================

  const updateProfile = async (profileData) => {
    try {
      const res = await API.put(
        '/auth/profile',
        profileData
      );

      if (res.success && res.data) {
        setUser(res.data);
      }

      return res;
    } catch (error) {
      throw error;
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const logout = () => {
    localStorage.removeItem(
      'ayurveda_user_token'
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);