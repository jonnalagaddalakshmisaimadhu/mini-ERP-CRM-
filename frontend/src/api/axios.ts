import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (error.response.status >= 500) {
        // Global error notification could go here, for now using alert
        alert('A server error occurred. Please try again later.');
      } else if (error.response.data && error.response.data.message) {
        console.error('API Error:', error.response.data.message);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
