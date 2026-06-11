"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import {
  useUploadImage,
  validateImageFile,
} from "@/features/file/hooks/useUploadImage";
import { useUpdateProofPayment } from "@/features/transaction/hooks/useTransactions";
import { Button } from "@/shared/components/ui/Button";
import { getErrorMessage } from "@/shared/config/api";
import { toast } from "sonner";

interface ProofPaymentUploadProps {
  transactionId: string;
  existingUrl?: string;
  onSuccess?: () => void;
}

export const ProofPaymentUpload = ({
  transactionId,
  existingUrl,
  onSuccess,
}: ProofPaymentUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(existingUrl || null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const { mutateAsync: uploadImage, isPending: uploading } = useUploadImage();
  const { mutateAsync: updateProof, isPending: updating } =
    useUpdateProofPayment();
  const isPending = uploading || updating;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { valid, error } = validateImageFile(file);
    if (!valid) {
      const message = error || "File tidak valid";
      setFileError(message);
      toast.error(message);
      return;
    }

    setFileError(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      toast.warning("Pilih gambar bukti pembayaran terlebih dahulu.");
      return;
    }

    try {
      // Step 1: Upload image to file server
      const imageUrl = await uploadImage(file);

      // Step 2: Attach URL to transaction
      await updateProof({ transactionId, proofPaymentUrl: imageUrl });

      setDone(true);
      toast.success(
        "Bukti pembayaran berhasil diunggah! Menunggu verifikasi admin.",
      );
      onSuccess?.();
    } catch (err) {
      const message =
        getErrorMessage(err) ||
        "Gagal mengunggah bukti pembayaran. Silakan coba lagi.";
      setFileError(message);
      toast.error(message);
    }
  };

  if (done) {
    return (
      <div className="space-y-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        <div className="flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Bukti pembayaran berhasil diunggah
        </div>
        <p className="text-green-700">
          Status masih <strong>Menunggu</strong> sampai admin memverifikasi
          pembayaran. Setelah disetujui, status akan berubah menjadi{" "}
          <strong>Berhasil</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Drop zone / preview */}
      <div
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-xl border-2 border-dashed border-outline-variant p-4 text-center transition-colors hover:border-primary"
      >
        {preview ? (
          <div className="relative mx-auto h-40 w-full max-w-xs overflow-hidden rounded-lg bg-surface-container-low">
            <Image
              src={preview}
              alt="Bukti pembayaran"
              fill
              className="object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white shadow-sm"
              aria-label="Hapus gambar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="py-4">
            <Upload className="mx-auto mb-2 h-8 w-8 text-on-surface-variant" />
            <p className="text-sm text-on-surface-variant">
              Klik untuk memilih gambar bukti pembayaran
            </p>
            <p className="mt-1 text-xs text-on-surface-variant/70">
              JPG, PNG, WebP — maks 5MB
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload bukti pembayaran"
      />

      {fileError && (
        <p className="text-sm text-red-600" role="alert">
          {fileError}
        </p>
      )}

      {preview && (
        <Button
          fullWidth
          size="sm"
          isLoading={isPending}
          onClick={handleUpload}
          disabled={isPending}
          leftIcon={
            isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )
          }
        >
          {isPending ? "Mengunggah..." : "Unggah Bukti Pembayaran"}
        </Button>
      )}
    </div>
  );
};
