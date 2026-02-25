import { axiosInstance } from './api';

interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  isActive: boolean;
  header?: string;
  image?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get('/articles/get-categories', {});
    console.log('getCategories response:', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const setCategory = async (name: string, description?: string): Promise<Category> => {
  try {
    const response = await axiosInstance.post('/articles/set-category', { name, description });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changeCategoryStatus = async (id: number): Promise<void> => {
  try {
    await axiosInstance.patch(`/articles/change-category-status/${id}`);
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (
  id: number,
  name?: string,
  description?: string
): Promise<Category> => {
  try {
    const response = await axiosInstance.post(`/articles/update-category/${id}`, {
      name,
      description,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
