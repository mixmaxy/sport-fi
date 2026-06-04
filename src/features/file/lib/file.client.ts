import { api } from "@/shared/config/api";
import { unwrapApiResult } from "@/shared/config/api-envelope";
import type { UploadResponse } from "@/shared/types";

/** API returns `result` as URL string or `{ imageUrl }` / `{ image_url }`. */
function parseUploadUrl(body: unknown): string {
  const result = unwrapApiResult<string | UploadResponse | { image_url: string }>(
    body,
  );

  if (typeof result === "string" && result.length > 0) {
    return result;
  }

  if (result && typeof result === "object") {
    if ("imageUrl" in result && result.imageUrl) {
      return String(result.imageUrl);
    }
    if ("image_url" in result && result.image_url) {
      return String(result.image_url);
    }
  }

  throw new Error("URL gambar tidak ditemukan di respons upload");
}

async function postMultipart(url: string, file: File, fieldName = "file") {
  const formData = new FormData();
  formData.append(fieldName, file);

  const { data } = await api.post(url, formData, {
    headers: {
      Accept: "application/json",
      // Biarkan axios set boundary multipart; jangan pakai application/json.
      "Content-Type": undefined,
    },
  });

  return parseUploadUrl(data);
}

/** Postman: POST /upload-image, form field `file` (bukan `image`). */
export async function uploadImage(file: File): Promise<string> {
  return postMultipart("/upload-image", file, "file");
}

/** Postman: POST /upload-file, form field `file` (pdf, docx, dll.). */
export async function uploadFile(file: File): Promise<string> {
  return postMultipart("/upload-file", file, "file");
}

export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  return Promise.all(files.map((file) => uploadImage(file)));
}

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File harus berupa gambar" };
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: "Ukuran file maksimal 5MB" };
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Format file harus JPG, PNG, atau WebP" };
  }

  return { valid: true };
}
