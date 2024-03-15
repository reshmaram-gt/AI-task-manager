// axiosWithAuth.js

import axios from 'axios';

const axiosWithAuth = axios.create({
  baseURL: 'http://localhost:8000/api/', // Update the base URL with your API URL
});

axiosWithAuth.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosWithAuth;
