import { axiosInstance } from './api';

export const adminLogin = async (email: string, password: string) => {
  console.log('adminLogin called with:', { email, password });
  try {
    const response = await axiosInstance.post('/auth/admin-login', { email, password });
    console.log('adminLogin response:', response.data);
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
