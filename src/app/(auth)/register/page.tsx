import { RegisterForm } from '@/features/auth/components/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Daftar',
    description: 'Daftar akun SportReserve gratis dan mulai booking aktivitas olahraga sekarang',
};

export default function RegisterPage() {
    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <RegisterForm />
        </div>
    );
}