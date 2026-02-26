import { axiosInstance } from './api';

export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post('/auth/admin-login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminProfile = async () => {
  try {
    const response = await axiosInstance.get('/auth/get-admin', {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const adminLogout = async () => {
  try {
    const response = await axiosInstance.post('/auth/logout', {});
    return response.data;
  } catch (error) {
    throw error;
  }
};
