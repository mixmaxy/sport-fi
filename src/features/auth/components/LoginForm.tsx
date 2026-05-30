'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useLogin } from '@/features/auth/services/authApi';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { getErrorMessage } from '@/config/api';

const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email wajib diisi')
        .email('Format email tidak valid'),
    password: z
        .string()
        .min(1, 'Password wajib diisi')
        .min(6, 'Password minimal 6 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const router = useRouter();
    const { mutate: login, isPending } = useLogin();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur', // Validate on blur for better UX
    });

    const onSubmit = (data: LoginFormData) => {
        setServerError(null);

        login(data, {
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
                        Masuk ke Akun Anda
                    </h1>
                    <p className="text-gray-600">
                        Belum punya akun?{' '}
                        <Link
                            href="/auth/register"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Daftar sekarang
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

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email Input */}
                    <Input
                        {...register('email')}
                        type="email"
                        label="Email"
                        placeholder="nama@email.com"
                        error={errors.email?.message}
                        leftIcon={<Mail className="w-5 h-5" />}
                        autoComplete="email"
                        required
                    />

                    {/* Password Input */}
                    <div className="relative">
                        <Input
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            placeholder="Masukkan password"
                            error={errors.password?.message}
                            leftIcon={<Lock className="w-5 h-5" />}
                            autoComplete="current-password"
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

                    {/* Forgot Password Link */}
                    <div className="flex justify-end">
                        <Link
                            href="/auth/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            Lupa password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        isLoading={isPending}
                        disabled={isPending}
                    >
                        {isPending ? 'Memproses...' : 'Masuk'}
                    </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            Atau masuk dengan
                        </span>
                    </div>
                </div>

                {/* Social Login Buttons (Optional) */}
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" type="button">
                        Google
                    </Button>
                    <Button variant="outline" type="button">
                        Facebook
                    </Button>
                </div>
            </div>
        </div>
    );
};