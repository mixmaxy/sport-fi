"use client";

import React, { useId, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Loader2, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUpdateUser } from "@/features/auth/hooks/useAuthMutations";
import {
  useUploadImage,
  validateImageFile,
} from "@/features/file/hooks/useUploadImage";
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
  const { mutateAsync: uploadImage, isPending: uploading } = useUploadImage();

  const avatarInputId = useId();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { valid, error } = validateImageFile(file);
    if (!valid) {
      setUploadError(error || "File tidak valid");
      return;
    }

    setUploadError(null);
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setServerError(null);
    setSaved(false);

    if (!user?.id) return;

    let profilePictureUrl = user?.profilePictureUrl;

    if (avatarFile) {
      try {
        profilePictureUrl = await uploadImage(avatarFile);
      } catch {
        const message = "Gagal mengunggah foto profil.";
        setUploadError(message);
        toast.error(message);
        return;
      }
    }

    updateUser(
      {
        id: user.id,
        data: { ...data, profilePictureUrl: profilePictureUrl ?? undefined },
      },
      {
        onSuccess: () => {
          setSaved(true);
          setAvatarFile(null);
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

  const avatarSrc = avatarPreview || user?.profilePictureUrl;
  const initials = getInitials(user?.name || "U");

  return (
    <div className="max-w-xl">
      {/* Avatar */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          {avatarSrc ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
              <Image
                src={avatarSrc}
                alt="Profile picture"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-on-primary shadow-md">
              {initials}
            </div>
          )}
          <label
            htmlFor={avatarInputId}
            className="absolute right-0 bottom-0 cursor-pointer rounded-full border-2 border-outline-variant bg-surface-container-lowest p-1.5 shadow-sm hover:bg-surface-container-low"
            aria-label="Ganti foto profil"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-on-surface-variant" />
            ) : (
              <Camera className="h-4 w-4 text-on-surface-variant" />
            )}
          </label>
          <input
            id={avatarInputId}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            disabled={uploading}
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-on-surface">{user?.name}</h2>
          <p className="text-sm text-on-surface-variant">{user?.email}</p>
          <span className="mt-1 inline-block rounded-full bg-primary-container px-2 py-0.5 text-xs font-medium text-on-primary capitalize">
            {user?.role}
          </span>
        </div>
      </div>

      {uploadError && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {uploadError}
        </p>
      )}

      {/* Form */}
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

        <Button
          type="submit"
          isLoading={updating}
          disabled={updating || uploading}
        >
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
