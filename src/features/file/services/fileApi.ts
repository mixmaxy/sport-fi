import { useMutation } from '@tanstack/react-query';
import { api, getErrorMessage } from '@/config/api';
import type { ApiResponse, UploadResponse } from '@/shared/types';

const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await api.post<ApiResponse<UploadResponse>>(
        '/upload-image',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return data.data.imageUrl;
};

export const useUploadImage = () => {
    return useMutation({
        mutationFn: uploadImage,
        onError: (error) => {
            console.error('Upload image error:', getErrorMessage(error));
        },
    });
};

export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(file => uploadImage(file));
    return Promise.all(uploadPromises);
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!file.type.startsWith('image/')) {
        return { valid: false, error: 'File harus berupa gambar' };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        return { valid: false, error: 'Ukuran file maksimal 5MB' };
    }

    // Check image format
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Format file harus JPG, PNG, atau WebP' };
    }

    return { valid: true };
};