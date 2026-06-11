"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUpdateUser } from "@/features/auth/hooks/useAuthMutations";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { getInitials } from "@/shared/utils/helper";
import { getErrorMessage } from "@/shared/config/api";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(50, "Nama maksimal 50 karakter"),
  email: z.string().email("Format email tidak valid"),
  phoneNumber: z
    .string()
    .regex(/^(\+62|62|0)8[0-9]{9,12}$/, "Format nomor telepon tidak valid"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const UserProfile = () => {
  const { user } = useAuthStore();
  const { mutate: updateUser, isPending: updating } = useUpdateUser();
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    setServerError(null);
    setSaved(false);

    if (!user?.id) return;

    updateUser(
      {
        id: user.id,
        data: {
          ...data,
          role: user.role,
        },
      },
      {
        onSuccess: () => {
          setSaved(true);
          toast.success("Profil berhasil diperbarui.");
          setTimeout(() => setSaved(false), 3000);
        },
        onError: (err) => {
          const message = getErrorMessage(err);
          setServerError(message);
          toast.error(message || "Gagal menyimpan profil.");
        },
      },
    );
  };

  const initials = getInitials(user?.name || "U");

  return (
    <div className="max-w-xl">
      <div className="mb-8 flex items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-on-primary shadow-md">
          {initials}
        </div>
        <div>
          <h2 className="text-xl font-bold text-on-surface">{user?.name}</h2>
          <p className="text-sm text-on-surface-variant">{user?.email}</p>
          <span className="mt-1 inline-block rounded-full bg-primary-container px-2 py-0.5 text-xs font-medium text-on-primary capitalize">
            {user?.role}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          {...register("name")}
          label="Nama Lengkap"
          error={errors.name?.message}
          required
        />
        <Input
          {...register("email")}
          type="email"
          label="Email"
          error={errors.email?.message}
          required
        />
        <Input
          {...register("phoneNumber")}
          type="tel"
          label="Nomor Telepon"
          placeholder="08123456789"
          error={errors.phoneNumber?.message}
          required
        />

        {serverError && (
          <p className="text-sm text-red-600" role="alert">
            {serverError}
          </p>
        )}

        <Button type="submit" isLoading={updating} disabled={updating}>
          {saved ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Tersimpan!
            </span>
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </form>
    </div>
  );
};
