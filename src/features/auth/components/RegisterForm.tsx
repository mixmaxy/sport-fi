"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { useRegister } from "@/features/auth/hooks/useAuthMutations";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { getErrorMessage } from "@/shared/config/api";
import { toast } from "sonner";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama wajib diisi")
      .min(3, "Nama minimal 3 karakter")
      .max(50, "Nama maksimal 50 karakter"),
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid"),
    phoneNumber: z
      .string()
      .min(1, "Nomor telepon wajib diisi")
      .regex(
        /^(\+62|62|0)8[0-9]{9,12}$/,
        "Format nomor telepon tidak valid (contoh: 08123456789)",
      ),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(6, "Password minimal 6 karakter")
      .max(50, "Password maksimal 50 karakter"),
    passwordRepeat: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: "Password tidak cocok",
    path: ["passwordRepeat"],
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
    mode: "onBlur",
  });

  const onSubmit = (data: RegisterFormData) => {
    setServerError(null);

    register(data, {
      onSuccess: () => {
        toast.success(
          "Pendaftaran berhasil! Selamat bergabung di Sport Reserve.",
        );
        router.push("/");
        router.refresh();
      },
      onError: (error) => {
        const message = getErrorMessage(error);
        setServerError(message);
        toast.error(message || "Pendaftaran gagal. Silakan coba lagi.");
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
        {/* Name Input */}
        <Input
          {...registerField("name")}
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
          {...registerField("email")}
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
          {...registerField("phoneNumber")}
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
            {...registerField("password")}
            type={showPassword ? "text" : "password"}
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
            className="absolute right-3 top-[38px] text-on-surface-variant hover:text-primary"
            aria-label={showPassword ? "Hide password" : "Show password"}
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
            {...registerField("passwordRepeat")}
            type={showPasswordRepeat ? "text" : "password"}
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
            className="absolute right-3 top-[38px] text-on-surface-variant hover:text-primary"
            aria-label={showPasswordRepeat ? "Hide password" : "Show password"}
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
          <input type="checkbox" id="terms" className="mt-1" required />
          <label htmlFor="terms" className="text-sm text-on-surface-variant">
            Saya setuju dengan Syarat & Ketentuan serta Kebijakan Privasi Sport
            Reserve.
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isPending}
          disabled={isPending}
          className="font-bold uppercase tracking-wide"
        >
          {isPending ? "Mendaftar..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-on-surface-variant">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Masuk di sini
        </Link>
      </p>
    </div>
  );
};
