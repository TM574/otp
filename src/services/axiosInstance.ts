import axios from 'axios';
import Cookie from 'js-cookies';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookie.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
