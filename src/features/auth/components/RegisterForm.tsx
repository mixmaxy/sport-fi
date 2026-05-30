'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useRegister } from '@/features/auth/services/authApi';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { getErrorMessage } from '@/config/api';

/**
 * Register Form Component
 * 
 * Why:
 * - Complete validation with Zod
 * - Password confirmation matching
 * - Phone number format validation
 * - Accessible form with proper labels
 */

// Zod validation schema
const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, 'Nama wajib diisi')
            .min(3, 'Nama minimal 3 karakter')
            .max(50, 'Nama maksimal 50 karakter'),
        email: z
            .string()
            .min(1, 'Email wajib diisi')
            .email('Format email tidak valid'),
        phoneNumber: z
            .string()
            .min(1, 'Nomor telepon wajib diisi')
            .regex(/^(\+62|62|0)8[0-9]{9,12}$/, 'Format nomor telepon tidak valid (contoh: 08123456789)'),
        password: z
            .string()
            .min(1, 'Password wajib diisi')
            .min(6, 'Password minimal 6 karakter')
            .max(50, 'Password maksimal 50 karakter'),
        passwordRepeat: z
            .string()
            .min(1, 'Konfirmasi password wajib diisi'),
    })
    .refine((data) => data.password === data.passwordRepeat, {
        message: 'Password tidak cocok',
        path: ['passwordRepeat'],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const router = useRouter();
    const { mutate: register, isPending } = useRegister();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
    });

    const onSubmit = (data: RegisterFormData) => {
        setServerError(null);

        register(data, {
            onSuccess: () => {
                router.push('/');
                router.refresh();
            },
            onError: (error) => {
                setServerError(getErrorMessage(error));
            },
        });
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Daftar Akun Baru
                    </h1>
                    <p className="text-gray-600">
                        Sudah punya akun?{' '}
                        <Link
                            href="/auth/login"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Masuk di sini
                        </Link>
                    </p>
                </div>

                {/* Server Error Alert */}
                {serverError && (
                    <div
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                        role="alert"
                    >
                        <p className="text-sm text-red-800">{serverError}</p>
                    </div>
                )}

                {/* Register Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name Input */}
                    <Input
                        {...registerField('name')}
                        type="text"
                        label="Nama Lengkap"
                        placeholder="Masukkan nama lengkap"
                        error={errors.name?.message}
                        leftIcon={<User className="w-5 h-5" />}
                        autoComplete="name"
                        required
                    />

                    {/* Email Input */}
                    <Input
                        {...registerField('email')}
                        type="email"
                        label="Email"
                        placeholder="nama@email.com"
                        error={errors.email?.message}
                        leftIcon={<Mail className="w-5 h-5" />}
                        autoComplete="email"
                        required
                    />

                    {/* Phone Number Input */}
                    <Input
                        {...registerField('phoneNumber')}
                        type="tel"
                        label="Nomor Telepon"
                        placeholder="08123456789"
                        error={errors.phoneNumber?.message}
                        leftIcon={<Phone className="w-5 h-5" />}
                        autoComplete="tel"
                        helperText="Format: 08xxxxxxxxxx"
                        required
                    />

                    {/* Password Input */}
                    <div className="relative">
                        <Input
                            {...registerField('password')}
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            placeholder="Minimal 6 karakter"
                            error={errors.password?.message}
                            leftIcon={<Lock className="w-5 h-5" />}
                            autoComplete="new-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Password Confirmation Input */}
                    <div className="relative">
                        <Input
                            {...registerField('passwordRepeat')}
                            type={showPasswordRepeat ? 'text' : 'password'}
                            label="Konfirmasi Password"
                            placeholder="Ulangi password"
                            error={errors.passwordRepeat?.message}
                            leftIcon={<Lock className="w-5 h-5" />}
                            autoComplete="new-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}
                            className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                            aria-label={showPasswordRepeat ? 'Hide password' : 'Show password'}
                        >
                            {showPasswordRepeat ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Terms Agreement */}
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            id="terms"
                            className="mt-1"
                            required
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600">
                            Saya setuju dengan{' '}
                            <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                                Syarat & Ketentuan
                            </Link>{' '}
                            dan{' '}
                            <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                                Kebijakan Privasi
                            </Link>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        isLoading={isPending}
                        disabled={isPending}
                    >
                        {isPending ? 'Mendaftar...' : 'Daftar Sekarang'}
                    </Button>
                </form>
            </div>
        </div>
    );
};