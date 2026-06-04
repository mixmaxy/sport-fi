"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  Upload,
  FolderOpen,
  Zap,
  MapPin,
  DollarSign,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCategoriesList } from "@/features/category/hooks/useCategoriesList";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/features/category/hooks/useCategoryMutations";
import { useActivitiesList } from "@/features/activity/hooks/useActivitiesList";
import {
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
} from "@/features/activity/hooks/useActivityMutations";
import {
  useProvinces,
  useCitiesByProvince,
} from "@/features/location/hooks/useLocations";
import { useUploadImage } from "@/features/file/hooks/useUploadImage";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Card } from "@/shared/components/ui/Card";
import { formatCurrency } from "@/shared/utils/helper";
import { getActivityImageUrl } from "@/shared/utils/images";
import { toast } from "sonner";
import { SportActivity } from "@/shared/types";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"categories" | "activities">(
    "categories",
  );

  // Verify Admin Role
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/admin");
      return;
    }
    if (user && user.role !== "admin") {
      toast.error("Akses ditolak. Halaman ini hanya untuk Administrator.");
      router.push("/");
    }
  }, [user, isAuthenticated, router]);

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto my-32 max-w-md space-y-4 text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-bold text-on-surface">Akses Dibatasi</h2>
        <p className="text-on-surface-variant">
          Anda tidak memiliki kredensial admin untuk mengakses halaman ini.
        </p>
        <Button onClick={() => router.push("/")}>Kembali ke Beranda</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-outline-variant pb-5 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Kelola data kategori dan aktivitas olahraga Sport Reserve
          </p>
        </div>

        <div className="flex rounded-xl border border-outline-variant bg-surface-container-low p-1.5">
          <button
            onClick={() => setActiveTab("categories")}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all md:text-sm ${
              activeTab === "categories"
                ? "bg-surface-container-lowest text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Manajemen Kategori
          </button>
          <button
            onClick={() => setActiveTab("activities")}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all md:text-sm ${
              activeTab === "activities"
                ? "bg-surface-container-lowest text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Manajemen Aktivitas
          </button>
        </div>
      </div>

      {activeTab === "categories" ? (
        <CategoriesManagement />
      ) : (
        <ActivitiesManagement />
      )}
    </div>
  );
}

const CategoriesManagement = () => {
  const {
    data: categories,
    isLoading,
    refetch: refetchCategories,
  } = useCategoriesList();
  const { mutate: createCategory } = useCreateCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();
  const { mutateAsync: uploadImage } = useUploadImage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setImageUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: {
    id: string;
    name: string;
    imageUrl: string;
  }) => {
    setEditingId(cat.id);
    setName(cat.name);
    setImageUrl(cat.imageUrl);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin menghapus kategori ini? Semua aktivitas di kategori ini mungkin akan terpengaruh.",
      )
    )
      return;
    deleteCategory(id, {
      onSuccess: () => {
        refetchCategories();
        toast.success("Kategori berhasil dihapus.");
      },
      onError: () => toast.error("Gagal menghapus kategori."),
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      toast.success("Gambar kategori berhasil diunggah.");
    } catch {
      toast.error("Gagal mengunggah gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Nama kategori wajib diisi.");
    if (!editingId && !imageUrl)
      return toast.error("Gambar kategori wajib diunggah untuk kategori baru.");

    if (editingId) {
      updateCategory(
        { id: editingId, name, imageUrl },
        {
          onSuccess: () => {
            refetchCategories();
            toast.success("Kategori berhasil diperbarui.");
            setIsModalOpen(false);
          },
          onError: () => toast.error("Gagal memperbarui kategori."),
        },
      );
    } else {
      createCategory(
        { name, imageUrl },
        {
          onSuccess: () => {
            refetchCategories();
            toast.success("Kategori berhasil ditambahkan.");
            setIsModalOpen(false);
          },
          onError: () => toast.error("Gagal menambahkan kategori."),
        },
      );
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-44 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={openCreateModal}
          className="bg-blue-600 text-white hover:bg-blue-700 font-bold gap-2"
        >
          <Plus className="w-5 h-5" />
          Tambah Kategori
        </Button>
      </div>

      {categories?.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-2xs">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800">Kategori Kosong</h3>
          <p className="text-sm text-gray-500">
            Silakan tambahkan kategori olahraga pertama Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories?.map((cat) => (
            <Card
              key={cat.id}
              className="overflow-hidden border border-gray-150 rounded-2xl bg-white flex flex-col h-full shadow-2xs"
            >
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h4 className="font-bold text-gray-900 text-base">
                  {cat.name}
                </h4>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs border-gray-200 hover:bg-gray-50 font-bold"
                    onClick={() => openEditModal(cat)}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs border-red-150 hover:bg-red-50 text-red-600 font-bold"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Hapus
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingId ? "Edit Kategori" : "Tambah Kategori Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 overflow-y-auto flex-1"
            >
              <Input
                label="Nama Kategori"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Badminton, Futsal"
                required
              />

              {/* Upload image */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Gambar Kategori
                </label>
                {imageUrl && (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mb-2">
                    <Image
                      src={imageUrl}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="relative">
                  <input
                    type="file"
                    id="cat-image-file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="cat-image-file"
                    className={`flex items-center justify-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 font-bold text-gray-700 px-4 py-3 rounded-xl text-sm transition-colors ${
                      isUploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    {isUploading
                      ? "Mengunggah..."
                      : imageUrl
                        ? "Ubah Gambar"
                        : "Upload Gambar"}
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="bg-blue-600 text-white hover:bg-blue-700 font-bold"
                >
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ActivitiesManagement = () => {
  const {
    data: activitiesPage,
    isLoading,
    refetch: refetchActivities,
  } = useActivitiesList({ isPaginate: false }, true);
  const { data: categories } = useCategoriesList();
  const { data: provinces } = useProvinces();

  const { mutate: createActivity } = useCreateActivity();
  const { mutate: updateActivity } = useUpdateActivity();
  const { mutate: deleteActivity } = useDeleteActivity();
  const { mutateAsync: uploadImage } = useUploadImage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [sportCategoryId, setSportCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceDiscount, setPriceDiscount] = useState("");
  const [facilities, setFacilities] = useState("");
  const [address, setAddress] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [locationMap, setLocationMap] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Cascading Location cities select hook
  const { data: cities } = useCitiesByProvince(provinceId || null);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setSportCategoryId("");
    setDescription("");
    setPrice("");
    setPriceDiscount("");
    setFacilities("");
    setAddress("");
    setProvinceId("");
    setCityId("");
    setLocationMap("");
    setImageUrls([]);
    setOriginalImageUrls([]);
    setIsModalOpen(true);
  };

  const openEditModal = (act: SportActivity) => {
    setEditingId(act.id);
    setTitle(act.title);
    setSportCategoryId(act.sportCategoryId);
    setDescription(act.description);
    setPrice(String(act.price));
    setPriceDiscount(String(act.priceDiscount || ""));
    setFacilities(act.facilities || "");
    setAddress(act.address);
    setProvinceId(act.provinceId ?? "");
    setCityId(act.cityId);
    setLocationMap(act.locationMap || "");
    const existing = act.imageUrls || [];
    setImageUrls(existing);
    setOriginalImageUrls(existing);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin menghapus aktivitas olahraga ini?",
      )
    )
      return;
    deleteActivity(id, {
      onSuccess: () => {
        refetchActivities();
        toast.success("Aktivitas berhasil dihapus.");
      },
      onError: () => toast.error("Gagal menghapus aktivitas."),
    });
  };

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
    if (!address.trim()) return toast.error("Alamat aktivitas wajib diisi.");
    if (!provinceId) return toast.error("Provinsi wajib dipilih.");
    if (!cityId) return toast.error("Kota wajib dipilih.");
    const finalImageUrls =
      imageUrls.length > 0
        ? imageUrls
        : editingId
          ? originalImageUrls
          : [];
    if (!editingId && finalImageUrls.length === 0)
      return toast.error("Unggah minimal satu gambar untuk aktivitas baru.");

    const activityData = {
      sportCategoryId,
      title,
      description,
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
            refetchActivities();
            toast.success("Aktivitas berhasil diperbarui.");
            setIsModalOpen(false);
          },
          onError: () => toast.error("Gagal memperbarui aktivitas."),
        },
      );
    } else {
      createActivity(activityData, {
        onSuccess: () => {
          refetchActivities();
          toast.success("Aktivitas berhasil ditambahkan.");
          setIsModalOpen(false);
        },
        onError: () => toast.error("Gagal menambahkan aktivitas."),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={openCreateModal}
          className="bg-blue-600 text-white hover:bg-blue-700 font-bold gap-2"
        >
          <Plus className="w-5 h-5" />
          Tambah Aktivitas
        </Button>
      </div>

      {activitiesPage?.data?.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-2xs">
          <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800">Aktivitas Kosong</h3>
          <p className="text-sm text-gray-500">
            Silakan buat aktivitas olahraga pertama Anda.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-55 border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-4">Aktivitas</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Harga</th>
                  <th className="px-6 py-4">Lokasi</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {activitiesPage?.data?.map((act) => (
                  <tr key={act.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="relative w-12 h-8 rounded overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={getActivityImageUrl(act.imageUrls)}
                          alt={act.title}
                          fill
                          className="object-cover"
                          unoptimized={!act.imageUrls?.[0]}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 truncate max-w-[200px]">
                        {act.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {act.category?.name || "-"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      {formatCurrency(act.priceDiscount || act.price)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 truncate max-w-[150px]">
                      {act.city?.name ?? act.cityId}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(act)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(act.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingId ? "Edit Aktivitas" : "Tambah Aktivitas Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 overflow-y-auto flex-1 text-left"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nama Aktivitas"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Sewa Lapangan Futsal A"
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Kategori Olahraga
                  </label>
                  <select
                    value={sportCategoryId}
                    onChange={(e) => setSportCategoryId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
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
                <label className="block text-sm font-medium text-gray-700">
                  Deskripsi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ketik deskripsi aktivitas..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Harga Tiket (Rp)"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Contoh: 100000"
                  required
                  leftIcon={<DollarSign className="w-4 h-4 text-gray-400" />}
                />
                <Input
                  label="Harga Diskon (Rp, Opsional)"
                  type="number"
                  value={priceDiscount}
                  onChange={(e) => setPriceDiscount(e.target.value)}
                  placeholder="Contoh: 85000"
                  leftIcon={<DollarSign className="w-4 h-4 text-gray-400" />}
                />
              </div>

              <Input
                label="Fasilitas (pisahkan dengan koma)"
                value={facilities}
                onChange={(e) => setFacilities(e.target.value)}
                placeholder="Contoh: Toilet, Shower, Parkir, Kantin"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Provinsi
                  </label>
                  <select
                    value={provinceId}
                    onChange={(e) => {
                      setProvinceId(e.target.value);
                      setCityId("");
                    }}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
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
                  <label className="block text-sm font-medium text-gray-700">
                    Kota / Kabupaten
                  </label>
                  <select
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    required
                    disabled={!provinceId}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm disabled:bg-gray-50 disabled:text-gray-400"
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
                leftIcon={<MapPin className="w-4 h-4 text-gray-400" />}
              />

              <Input
                label="Link Peta Lokasi (Iframe Embed URL / Maps Link)"
                value={locationMap}
                onChange={(e) => setLocationMap(e.target.value)}
                placeholder="Contoh: https://www.google.com/maps/embed?..."
              />

              {/* Upload Images */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Gambar Galeri Aktivitas (Minimal 1)
                </label>

                {imageUrls.length > 0 && (
                  <div className="flex flex-wrap gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    {imageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-16 rounded-lg overflow-hidden border border-gray-300 bg-white"
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
                          className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold hover:bg-red-650"
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
                    className={`flex items-center justify-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 font-bold text-gray-700 px-4 py-3 rounded-xl text-sm transition-colors ${
                      isUploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    {isUploading
                      ? "Mengunggah..."
                      : "Upload File Gambar (Bisa Pilih Banyak)"}
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="bg-blue-600 text-white hover:bg-blue-700 font-bold"
                >
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
