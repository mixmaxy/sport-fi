"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, MapPin, X } from "lucide-react";
import {
  useCreateActivity,
  useUpdateActivity,
} from "@/features/activity/hooks/useActivityMutations";
import { useCategoriesList } from "@/features/category/hooks/useCategoriesList";
import {
  useProvinces,
  useCitiesByProvince,
} from "@/features/location/hooks/useLocations";
import { useUploadImage } from "@/features/file/hooks/useUploadImage";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { toast } from "sonner";
import type { SportActivity } from "@/shared/types";

interface AdminActivityFormModalProps {
  activity?: SportActivity;
  onClose: () => void;
  onSaved: () => void;
}

export function AdminActivityFormModal({
  activity,
  onClose,
  onSaved,
}: AdminActivityFormModalProps) {
  const editingId = activity?.id ?? null;

  const { data: categories } = useCategoriesList();
  const { data: provinces } = useProvinces();
  const { mutate: createActivity } = useCreateActivity();
  const { mutate: updateActivity } = useUpdateActivity();
  const { mutateAsync: uploadImage } = useUploadImage();

  const [title, setTitle] = useState(activity?.title ?? "");
  const [sportCategoryId, setSportCategoryId] = useState(
    activity?.sportCategoryId ?? "",
  );
  const [description, setDescription] = useState(activity?.description ?? "");
  const [price, setPrice] = useState(
    activity?.price != null ? String(activity.price) : "",
  );
  const [priceDiscount, setPriceDiscount] = useState(
    activity?.priceDiscount != null ? String(activity.priceDiscount) : "",
  );
  const [slot, setSlot] = useState(String(activity?.slot ?? 1));
  const [activityDate, setActivityDate] = useState(
    activity?.activityDate?.slice(0, 10) ?? "",
  );
  const [startTime, setStartTime] = useState(
    activity?.startTime?.slice(0, 5) ?? "08:00",
  );
  const [endTime, setEndTime] = useState(
    activity?.endTime?.slice(0, 5) ?? "10:00",
  );
  const [facilities, setFacilities] = useState(activity?.facilities ?? "");
  const [address, setAddress] = useState(activity?.address ?? "");
  const [provinceId, setProvinceId] = useState(activity?.provinceId ?? "");
  const [cityId, setCityId] = useState(activity?.cityId ?? "");
  const [locationMap, setLocationMap] = useState(activity?.locationMap ?? "");
  const [imageUrls, setImageUrls] = useState<string[]>(
    activity?.imageUrls ?? [],
  );
  const [originalImageUrls] = useState<string[]>(activity?.imageUrls ?? []);
  const [isUploading, setIsUploading] = useState(false);

  const { data: cities } = useCitiesByProvince(provinceId || null);

  const handleMultipleImagesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i]);
        urls.push(url);
      }
      setImageUrls((prev) => [...prev, ...urls]);
      toast.success(`${files.length} gambar berhasil diunggah.`);
    } catch {
      toast.error("Gagal mengunggah beberapa gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Judul aktivitas wajib diisi.");
    if (!sportCategoryId) return toast.error("Kategori wajib dipilih.");
    if (!price || Number(price) <= 0)
      return toast.error("Harga tiket valid wajib diisi.");
    if (
      priceDiscount &&
      (Number(priceDiscount) <= 0 || Number(priceDiscount) >= Number(price))
    ) {
      return toast.error(
        "Harga diskon harus lebih besar dari 0 dan lebih kecil dari harga normal.",
      );
    }
    if (!slot || Number(slot) <= 0)
      return toast.error("Jumlah slot wajib diisi (minimal 1).");
    if (!activityDate) return toast.error("Tanggal aktivitas wajib diisi.");
    if (!startTime) return toast.error("Waktu mulai wajib diisi.");
    if (!endTime) return toast.error("Waktu selesai wajib diisi.");
    if (startTime >= endTime)
      return toast.error("Waktu selesai harus setelah waktu mulai.");
    if (!address.trim()) return toast.error("Alamat aktivitas wajib diisi.");
    if (!provinceId) return toast.error("Provinsi wajib dipilih.");
    if (!cityId) return toast.error("Kota wajib dipilih.");

    const finalImageUrls =
      imageUrls.length > 0 ? imageUrls : editingId ? originalImageUrls : [];
    if (!editingId && finalImageUrls.length === 0)
      return toast.error("Unggah minimal satu gambar untuk aktivitas baru.");

    const activityData = {
      sportCategoryId,
      title,
      description,
      slot: Number(slot),
      activityDate,
      startTime,
      endTime,
      price: Number(price),
      priceDiscount: priceDiscount ? Number(priceDiscount) : 0,
      facilities,
      address,
      provinceId,
      cityId,
      locationMap,
      imageUrls: finalImageUrls,
    };

    if (editingId) {
      updateActivity(
        { id: editingId, ...activityData },
        {
          onSuccess: () => {
            onSaved();
            toast.success("Aktivitas berhasil diperbarui.");
            onClose();
          },
          onError: () => toast.error("Gagal memperbarui aktivitas."),
        },
      );
    } else {
      createActivity(activityData, {
        onSuccess: () => {
          onSaved();
          toast.success("Aktivitas berhasil ditambahkan.");
          onClose();
        },
        onError: () => toast.error("Gagal menambahkan aktivitas."),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/50 p-4 sm:items-center">
      <div className="mb-0 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-outline-variant bg-surface-container-lowest shadow-xl sm:mb-4 sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
          <h3 className="text-lg font-bold text-on-surface">
            {editingId ? "Edit Aktivitas" : "Tambah Aktivitas Baru"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto p-6 text-left"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Nama Aktivitas"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Sewa Lapangan Futsal A"
              required
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-on-surface">
                Kategori Olahraga
              </label>
              <select
                value={sportCategoryId}
                onChange={(e) => setSportCategoryId(e.target.value)}
                required
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Pilih Kategori</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-on-surface">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ketik deskripsi aktivitas..."
              className="h-24 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Harga Tiket (Rp)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Contoh: 100000"
              required
              leftIcon={
                <span className="text-xs font-bold text-on-surface-variant">Rp</span>
              }
            />
            <Input
              label="Harga Diskon (Rp, Opsional)"
              type="number"
              value={priceDiscount}
              onChange={(e) => setPriceDiscount(e.target.value)}
              placeholder="Contoh: 85000"
              leftIcon={
                <span className="text-xs font-bold text-on-surface-variant">Rp</span>
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Jumlah Slot"
              type="number"
              min={1}
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              placeholder="Contoh: 2"
              required
              helperText="Kapasitas peserta / sesi yang tersedia"
            />
            <Input
              label="Tanggal Aktivitas"
              type="date"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              required
            />
            <Input
              label="Waktu Mulai"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <Input
              label="Waktu Selesai"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <Input
            label="Fasilitas (pisahkan dengan koma)"
            value={facilities}
            onChange={(e) => setFacilities(e.target.value)}
            placeholder="Contoh: Toilet, Shower, Parkir, Kantin"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-on-surface">
                Provinsi
              </label>
              <select
                value={provinceId}
                onChange={(e) => {
                  setProvinceId(e.target.value);
                  setCityId("");
                }}
                required
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Pilih Provinsi</option>
                {provinces?.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-on-surface">
                Kota / Kabupaten
              </label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                required
                disabled={!provinceId}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-surface-container-low disabled:text-on-surface-variant"
              >
                <option value="">Pilih Kota</option>
                {cities?.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Alamat Lengkap"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Masukkan jalan, RT/RW, nomor lokasi..."
            required
            leftIcon={<MapPin className="h-4 w-4 text-on-surface-variant" />}
          />

          <Input
            label="Link Peta Lokasi (Iframe Embed URL / Maps Link)"
            value={locationMap}
            onChange={(e) => setLocationMap(e.target.value)}
            placeholder="Contoh: https://www.google.com/maps/embed?..."
          />

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface">
              Gambar Galeri Aktivitas (Minimal 1)
            </label>

            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-3 rounded-xl border border-outline-variant bg-surface-container-low p-3">
                {imageUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative h-16 w-20 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest"
                  >
                    <Image
                      src={url}
                      alt="gallery"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageUrl(idx)}
                      className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <input
                type="file"
                id="act-image-upload"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleMultipleImagesUpload}
                disabled={isUploading}
              />
              <label
                htmlFor="act-image-upload"
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-high ${
                  isUploading ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <Upload className="h-4 w-4" />
                {isUploading
                  ? "Mengunggah..."
                  : "Upload File Gambar (Bisa Pilih Banyak)"}
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-outline-variant pt-4 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="w-full font-bold sm:w-auto"
            >
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
