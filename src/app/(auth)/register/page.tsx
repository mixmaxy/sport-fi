import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { AuthLayout } from "@/shared/components/layout/AuthLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar",
  description:
    "Daftar akun Sport Reserve gratis dan mulai booking aktivitas olahraga sekarang",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Join the game"
      subtitle="Create your account and start booking premium sports venues."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
