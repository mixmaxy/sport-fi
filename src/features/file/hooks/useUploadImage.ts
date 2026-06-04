"use client";

import { getErrorMessage } from "@/shared/config/api";
import { uploadFile, uploadImage } from "@/features/file/lib/file.client";
import { useMutation } from "@/shared/hooks/useMutation";

export function useUploadImage() {
  const mutation = useMutation(uploadImage);

  return {
    ...mutation,
    mutate: (file: File, options?: Parameters<typeof mutation.mutate>[1]) =>
      mutation.mutate(file, {
        ...options,
        onError: (error) => {
          console.error("Upload image error:", getErrorMessage(error));
          options?.onError?.(error);
        },
      }),
  };
}

export function useUploadFile() {
  const mutation = useMutation(uploadFile);

  return {
    ...mutation,
    mutate: (file: File, options?: Parameters<typeof mutation.mutate>[1]) =>
      mutation.mutate(file, {
        ...options,
        onError: (error) => {
          console.error("Upload file error:", getErrorMessage(error));
          options?.onError?.(error);
        },
      }),
  };
}

export {
  validateImageFile,
  uploadMultipleImages,
} from "@/features/file/lib/file.client";
