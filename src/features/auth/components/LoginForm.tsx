"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useLogin } from "@/features/auth/hooks/useAuthMutations";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { getErrorMessage } from "@/shared/config/api";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(6, "Password minimal 6 karakter"),
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
    mode: "onBlur",
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError(null);
    login(data, {
      onSuccess: () => {
        toast.success("Login berhasil! Selamat datang kembali.");
        router.push("/");
        router.refresh();
      },
      onError: (error) => {
        const message = getErrorMessage(error);
        setServerError(message);
        toast.error(message || "Login gagal. Periksa email dan password.");
      },
    });
  };

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm sm:p-8">
      {serverError && (
        <div
          className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4"
          role="alert"
        >
          <p className="text-sm text-red-800">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          {...register("email")}
          type="email"
          label="Email"
          placeholder="nama@email.com"
          error={errors.email?.message}
          leftIcon={<Mail className="h-5 w-5" />}
          autoComplete="email"
          required
        />

        <div className="relative">
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Masukkan password"
            error={errors.password?.message}
            leftIcon={<Lock className="h-5 w-5" />}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-on-surface-variant hover:text-primary"
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isPending}
          disabled={isPending}
          className="font-bold uppercase tracking-wide"
        >
          {isPending ? "Memproses..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-on-surface-variant">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
};
