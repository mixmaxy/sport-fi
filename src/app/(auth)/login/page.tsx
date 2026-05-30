import { LoginForm } from '@/features/auth/components/LoginForm';
import type { Metadata } from 'next';

/**
 * Login Page
 * 
 * SEO Metadata:
 * - Specific title and description for login page
 * - Helps with search visibility
 */
export const metadata: Metadata = {
    title: 'Masuk',
    description: 'Masuk ke akun SportReserve untuk mulai memesan aktivitas olahraga favoritmu',
};

export default function LoginPage() {
    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <LoginForm />
        </div>
    );
}