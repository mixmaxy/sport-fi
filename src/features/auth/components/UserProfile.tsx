'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUpdateUser } from '@/features/auth/services/authApi';
import { useUploadImage, validateImageFile } from '@/features/file/services/fileApi';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { getInitials } from '@/shared/lib/helpers';
import { getErrorMessage } from '@/config/api';

/**
 * UserProfile Component
 * 
 * Why:
 * - Allows users to update their profile info
 * - Profile picture upload with preview
 * - Form validation with Zod
 */

const profileSchema = z.object({
    name: z.string().min(3, 'Nama minimal 3 karakter').max(50, 'Nama maksimal 50 karakter'),
    email: z.string().email('Format email tidak valid'),
    phoneNumber: z
        .string()
        .regex(/^(\+62|62|0)8[0-9]{9,12}$/, 'Format nomor telepon tidak valid'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const UserProfile = () => {
    const { user } = useAuthStore();
    const { mutate: updateUser, isPending: updating } = useUpdateUser();
    const { mutateAsync: uploadImage, isPending: uploading } = useUploadImage();

    const inputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || '',
        },
    });

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const { valid, error } = validateImageFile(file);
        if (!valid) { setUploadError(error || 'File tidak valid'); return; }

        setUploadError(null);
        const reader = new FileReader();
        reader.onload = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data: ProfileFormData) => {
        setServerError(null);
        setSaved(false);

        let profilePictureUrl = user?.profilePictureUrl;

        // Upload new avatar if selected
        const file = inputRef.current?.files?.[0];
        if (file) {
            try {
                profilePictureUrl = await uploadImage(file);
            } catch {
                setUploadError('Gagal mengunggah foto profil.');
                return;
            }
        }

        updateUser(
            { ...data, profilePictureUrl: profilePictureUrl ?? undefined },
            {
                onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 3000); },
                onError: (err) => setServerError(getErrorMessage(err)),
            }
        );
    };

    const avatarSrc = avatarPreview || user?.profilePictureUrl;
    const initials = getInitials(user?.name || 'U');

    return (
        <div className="max-w-xl">
            {/* Avatar */}
            <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                    {avatarSrc ? (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                            <Image src={avatarSrc} alt="Profile picture" fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                            {initials}
                        </div>
                    )}
                    <button
                        onClick={() => inputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-white border-2 border-gray-200 rounded-full p-1.5 hover:bg-gray-50 shadow-sm"
                        aria-label="Ganti foto profil"
                    >
                        {uploading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                        ) : (
                            <Camera className="w-4 h-4 text-gray-600" />
                        )}
                    </button>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                    <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium capitalize">
                        {user?.role}
                    </span>
                </div>
            </div>

            {uploadError && (
                <p className="mb-4 text-sm text-red-600" role="alert">{uploadError}</p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                    {...register('name')}
                    label="Nama Lengkap"
                    error={errors.name?.message}
                    required
                />
                <Input
                    {...register('email')}
                    type="email"
                    label="Email"
                    error={errors.email?.message}
                    required
                />
                <Input
                    {...register('phoneNumber')}
                    type="tel"
                    label="Nomor Telepon"
                    placeholder="08123456789"
                    error={errors.phoneNumber?.message}
                    required
                />

                {serverError && (
                    <p className="text-sm text-red-600" role="alert">{serverError}</p>
                )}

                <Button type="submit" isLoading={updating} disabled={updating || uploading}>
                    {saved ? (
                        <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Tersimpan!
                        </span>
                    ) : 'Simpan Perubahan'}
                </Button>
            </form>
        </div>
    );
};