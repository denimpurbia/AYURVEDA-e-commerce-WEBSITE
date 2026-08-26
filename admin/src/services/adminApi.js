import axios from 'axios';

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ayurveda_admin_token') || localStorage.getItem('ayurveda_user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 403) {
      console.warn('Admin Access Denied:', error.response.data.message);
    }
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      'Admin request failed';
    return Promise.reject(new Error(message));
  }
);

export default adminApi;
