export const formatCurrency = (amount: number): string => {
  const value = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (
  date: string | Date,
  format: "short" | "long" = "short",
): string => {
  if (!date) return "-";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(dateObj.getTime())) return "-";

  if (format === "long") {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(dateObj);
};

/** "13:00:00" → "13:00", optional end time for a session slot label. */
export function formatTimeSlot(
  start?: string | null,
  end?: string | null,
): string | null {
  if (!start) return null;
  const trim = (value: string) => value.slice(0, 5);
  const startLabel = trim(start);
  return end ? `${startLabel} – ${trim(end)}` : startLabel;
}

export function hasActivityDiscount(
  price: number,
  priceDiscount?: number | null,
): priceDiscount is number {
  return (
    typeof priceDiscount === "number" &&
    Number.isFinite(priceDiscount) &&
    priceDiscount > 0 &&
    price > 0 &&
    priceDiscount < price
  );
}

/** Effective price shown to users and used in cart totals. */
export function getActivityFinalPrice(
  price: number,
  priceDiscount?: number | null,
): number {
  return hasActivityDiscount(price, priceDiscount) ? priceDiscount : price;
}

export const calculateDiscountPercentage = (
  originalPrice: number,
  discountPrice?: number | null,
): number => {
  if (!hasActivityDiscount(originalPrice, discountPrice)) return 0;
  return Math.round(((originalPrice - discountPrice!) / originalPrice) * 100);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  // Accepts: 08xxxxxxxxxx or +628xxxxxxxxxx (10-13 digits after prefix)
  const phoneRegex = /^(\+62|62|0)8[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    success: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
};

export const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    pending: "Menunggu",
    success: "Berhasil",
    cancelled: "Dibatalkan",
    failed: "Ditolak",
  };

  return statusLabels[status.toLowerCase()] ?? status;
};

export const sanitizeHtml = (html: string): string => {
  const div = document.createElement("div");
  div.textContent = html;
  return div.innerHTML;
};
