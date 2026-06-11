"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, Plus } from "lucide-react";
import {
  useCreateActivity,
  useUpdateActivity,
} from "@/features/activity/hooks/useActivityMutations";
import { useCategoriesList } from "@/features/category/hooks/useCategoriesList";
import {
  useProvinces,
  useCitiesByProvince,
} from "@/features/location/hooks/useLocations";
import {
  useUploadImage,
  validateImageFile,
} from "@/features/file/hooks/useUploadImage";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { getErrorMessage } from "@/shared/config/api";
import type { SportActivity } from "@/shared/types";

const activitySchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  price: z.coerce.number().min(1000, "Harga minimal Rp1.000"),
  price_discount: z.coerce.number().min(0),
  facilities: z.string().min(1, "Fasilitas wajib diisi"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  province: z.string().min(1, "Pilih provinsi"),
  city: z.string().min(1, "Pilih kota"),
  location_maps: z.string().optional(),
  categoryId: z.string().min(1, "Pilih kategori"),
});

type ActivityFormData = z.infer<typeof activitySchema>;

interface Props {
  activity?: SportActivity;
  onClose: () => void;
}

export const ActivityFormModal = ({ activity, onClose }: Props) => {
  const isEditing = Boolean(activity);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>(
    activity?.imageUrls || [],
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: categories } = useCategoriesList();
  const { data: provinces } = useProvinces();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema) as Resolver<ActivityFormData>,
    defaultValues: {
      title: activity?.title || "",
      description: activity?.description || "",
      price: activity?.price || 0,
      price_discount: activity?.priceDiscount || 0,
      facilities: activity?.facilities || "",
      address: activity?.address || "",
      province: activity?.province?.name || "",
      city: activity?.city?.name || "",
      location_maps: activity?.locationMap || "",
      categoryId: activity?.sportCategoryId || "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedProvince = watch("province");
  const { data: cities } = useCitiesByProvince(
    provinces?.find((p) => p.name === selectedProvince)?.id || null,
  );

  const { mutate: createActivity, isPending: creating } = useCreateActivity();
  const { mutate: updateActivity, isPending: updating } = useUpdateActivity();
  const { mutateAsync: uploadImage, isPending: uploading } = useUploadImage();
  const isPending = creating || updating;

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { valid, error } = validateImageFile(file);
    if (!valid) {
      setUploadError(error || "File tidak valid");
      return;
    }
    setUploadError(null);
    try {
      const url = await uploadImage(file);
      setImageUrls((prev) => [...prev, url]);
    } catch {
      setUploadError("Gagal mengunggah gambar.");
    }
    if (imgInputRef.current) imgInputRef.current.value = "";
  };

  const removeImage = (idx: number) =>
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = (data: ActivityFormData) => {
    const resolvedImageUrls =
      imageUrls.length > 0 ? imageUrls : (activity?.imageUrls ?? []);
    if (!isEditing && resolvedImageUrls.length === 0) {
      setUploadError("Tambahkan minimal 1 gambar untuk aktivitas baru.");
      return;
    }
    setServerError(null);
    // Extract fields that need transformation
    const {
      categoryId,
      price,
      price_discount,
      province,
      city,
      location_maps,
      ...rest
    } = data;

    // Convert readable names to IDs for the API
    const provinceId = provinces?.find((p) => p.name === province)?.id ?? "";
    const cityId = cities?.find((c) => c.name === city)?.id ?? "";

    const payload = {
      ...rest,
      sportCategoryId: categoryId,
      price,
      priceDiscount: price_discount,
      provinceId,
      cityId,
      locationMap: location_maps ?? "",
      ...(resolvedImageUrls.length > 0 ? { imageUrls: resolvedImageUrls } : {}),
    };

    if (isEditing && activity) {
      updateActivity(
        { id: activity.id, ...payload },
        {
          onSuccess: onClose,
          onError: (err) => setServerError(getErrorMessage(err)),
        },
      );
    } else {
      createActivity(payload, {
        onSuccess: onClose,
        onError: (err) => setServerError(getErrorMessage(err)),
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Aktivitas" : "Tambah Aktivitas"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar{" "}
              {!isEditing && <span className="text-red-500">*</span>}
              {isEditing && (
                <span className="text-gray-400 font-normal text-xs">
                  (opsional saat edit)
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {imageUrls.map((url, i) => (
                <div
                  key={i}
                  className="relative w-24 h-20 rounded-lg overflow-hidden border border-gray-200"
                >
                  <Image
                    src={url}
                    alt={`Gambar ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => imgInputRef.current?.click()}
                className="w-24 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-400 transition-colors"
              >
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-xs text-gray-400 mt-1">Tambah</span>
              </button>
            </div>
            <input
              ref={imgInputRef}
              type="file"
              accept="image/*"
              onChange={handleAddImage}
              className="hidden"
            />
            {uploadError && (
              <p className="text-sm text-red-600">{uploadError}</p>
            )}
          </div>

          <Input
            {...register("title")}
            label="Judul Aktivitas"
            error={errors.title?.message}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Deskripsikan aktivitas ini..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register("price")}
              type="number"
              label="Harga (Rp)"
              error={errors.price?.message}
              required
            />
            <Input
              {...register("price_discount")}
              type="number"
              label="Harga Diskon (Rp)"
              error={errors.price_discount?.message}
              helperText="Isi 0 jika tidak ada"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              {...register("categoryId")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Provinsi <span className="text-red-500">*</span>
              </label>
              <select
                {...register("province")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Pilih Provinsi --</option>
                {provinces?.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.province.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kota <span className="text-red-500">*</span>
              </label>
              <select
                {...register("city")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Pilih Kota --</option>
                {cities?.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          <Input
            {...register("address")}
            label="Alamat Lengkap"
            error={errors.address?.message}
            required
          />
          <Input
            {...register("location_maps")}
            label="URL Google Maps (opsional)"
            placeholder="https://maps.google.com/..."
            error={errors.location_maps?.message}
          />
          <Input
            {...register("facilities")}
            label="Fasilitas (pisah dengan koma)"
            placeholder="Parkir, Loker, Shower"
            error={errors.facilities?.message}
            required
          />

          {serverError && (
            <p className="text-sm text-red-600" role="alert">
              {serverError}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 shrink-0">
          <Button variant="outline" fullWidth onClick={onClose}>
            Batal
          </Button>
          <Button
            fullWidth
            isLoading={isPending}
            disabled={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {isEditing ? "Simpan Perubahan" : "Tambahkan"}
          </Button>
        </div>
      </div>
    </div>
  );
};
