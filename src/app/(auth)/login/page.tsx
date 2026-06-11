import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthLayout } from "@/shared/components/layout/AuthLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk",
  description:
    "Masuk ke akun Sport Reserve untuk mulai memesan aktivitas olahraga favoritmu",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Selamat datang kembali"
      subtitle="Masuk untuk mengelola pemesanan dan menemukan venue olahraga favoritmu."
    >
      <LoginForm />
    </AuthLayout>
  );
}
