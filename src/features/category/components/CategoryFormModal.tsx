'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, Loader2 } from 'lucide-react';
import {
    useCreateCategory,
    useUpdateCategory,
} from '@/features/category/services/categoryApi';
import { useUploadImage, validateImageFile } from '@/features/file/services/fileApi';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { getErrorMessage } from '@/config/api';
import type { SportCategory } from '@/shared/types';

/**
 * CategoryFormModal Component
 * 
 * Why modal:
 * - Inline editing without page navigation
 * - Contextual form within the list view
 * - Better UX than separate routes for CRUD
 * 
 * Why same component for create & update:
 * - DRY principle
 * - Shared validation schema
 * - Category prop determines mode
 */

const categorySchema = z.object({
    name: z.string().min(2, 'Nama minimal 2 karakter').max(50, 'Nama maksimal 50 karakter'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
    category?: SportCategory; // If provided, update mode; otherwise create mode
    onClose: () => void;
}

export const CategoryFormModal = ({ category, onClose }: CategoryFormModalProps) => {
    const isEditing = Boolean(category);
    const inputRef = useRef<HTMLInputElement>(null);

    const [imageUrl, setImageUrl] = useState<string>(category?.imageUrl || '');
    const [preview, setPreview] = useState<string>(category?.imageUrl || '');
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutate: createCategory, isPending: creating } = useCreateCategory();
    const { mutate: updateCategory, isPending: updating } = useUpdateCategory();
    const { mutateAsync: uploadImage, isPending: uploading } = useUploadImage();
    const isPending = creating || updating || uploading;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: category?.name || '' },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const { valid, error } = validateImageFile(file);
        if (!valid) { setUploadError(error || 'File tidak valid'); return; }

        setUploadError(null);
        // Local preview
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        // Upload
        try {
            const url = await uploadImage(file);
            setImageUrl(url);
        } catch {
            setUploadError('Gagal mengunggah gambar.');
        }
    };

    const onSubmit = (data: CategoryFormData) => {
        if (!imageUrl) { setUploadError('Gambar kategori wajib diunggah.'); return; }
        setServerError(null);

        const payload = { name: data.name, imageUrl };

        if (isEditing && category) {
            updateCategory(
                { id: category.id, ...payload },
                {
                    onSuccess: onClose,
                    onError: (err) => setServerError(getErrorMessage(err)),
                }
            );
        } else {
            createCategory(payload, {
                onSuccess: onClose,
                onError: (err) => setServerError(getErrorMessage(err)),
            });
        }
    };

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {isEditing ? 'Edit Kategori' : 'Tambah Kategori'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Tutup">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                    <Input
                        {...register('name')}
                        label="Nama Kategori"
                        placeholder="Contoh: Futsal, Renang, Yoga"
                        error={errors.name?.message}
                        required
                    />

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Gambar Kategori <span className="text-red-500">*</span>
                        </label>
                        <div
                            onClick={() => inputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-4 cursor-pointer transition-colors"
                        >
                            {preview ? (
                                <div className="relative h-36 rounded-lg overflow-hidden">
                                    <Image src={preview} alt="Preview" fill className="object-cover" />
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Klik untuk upload gambar</p>
                                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — maks 5MB</p>
                                </div>
                            )}
                        </div>
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}
                    </div>

                    {serverError && (
                        <p className="text-sm text-red-600" role="alert">{serverError}</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" fullWidth onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" fullWidth isLoading={isPending} disabled={isPending}>
                            {isEditing ? 'Simpan' : 'Tambahkan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};