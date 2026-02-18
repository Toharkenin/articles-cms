import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginRequest = err.config?.url?.includes('/admin/login');


    if (err.response?.status === 401 && !isLoginRequest) {
      window.location.href = '/admin/login';
    }

    return Promise.reject(err);
  }
);