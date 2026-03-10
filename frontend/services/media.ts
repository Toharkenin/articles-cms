import { axiosInstance } from './api';

interface UploadImageResponse {
  success: boolean;
  imageUrl?: string;
  key?: string;
  bucket?: string;
  message?: string;
}

export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axiosInstance.post('/media/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Image upload response:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('Image upload error:', error);
    throw error?.response?.data || { success: false, message: 'Failed to upload image' };
  }
};
