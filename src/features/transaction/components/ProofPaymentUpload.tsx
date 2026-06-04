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
      toast.success("Bukti pembayaran berhasil diunggah!");
      onSuccess?.();
    } catch {
      const message = "Gagal mengunggah bukti pembayaran. Silakan coba lagi.";
      setFileError(message);
      toast.error(message);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
        <CheckCircle2 className="w-5 h-5" />
        Bukti pembayaran berhasil diunggah
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Drop zone / preview */}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-4 cursor-pointer transition-colors text-center"
      >
        {preview ? (
          <div className="relative">
            <div className="relative h-40 mx-auto rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Bukti pembayaran"
                fill
                className="object-contain"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              aria-label="Hapus gambar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-4">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Klik untuk memilih gambar bukti pembayaran
            </p>
            <p className="text-xs text-gray-400 mt-1">
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
