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
      title="Bergabung sekarang"
      subtitle="Buat akun gratis dan mulai booking venue olahraga premium."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
