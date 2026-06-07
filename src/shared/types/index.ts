export interface ApiResponse<T = unknown> {
  code: string;
  status: string;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl: string | null;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type LogoutRequest = Record<string, never>;

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
  phoneNumber: string;
  profilePictureUrl?: string;
  role?: "user" | "admin";
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  role?: "user" | "admin";
}

export interface Province {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface City {
  id: string;
  provinceId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface SportCategory {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  imageUrl: string;
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  id: string;
}

export interface SportActivity {
  id: string;
  sportCategoryId: string;
  title: string;
  description: string;
  price: number;
  // Fields from Postman spec (activity event)
  slot?: number;
  activityDate?: string; // activity_date
  startTime?: string; // start_time
  endTime?: string; // end_time
  mapUrl?: string; // map_url
  // Legacy/optional fields (venue-style UI)
  priceDiscount?: number;
  rating?: number;
  totalReviews?: number;
  facilities?: string;
  address: string;
  provinceId?: string;
  cityId: string;
  locationMap?: string;
  imageUrls?: string[];
  createdAt: string;
  updatedAt: string;
  // Populated fields
  category?: SportCategory;
  province?: Province;
  city?: City;
}

export interface CreateActivityRequest {
  // Client-side model (will be mapped to API snake_case)
  sportCategoryId: string;
  cityId: string;
  title: string;
  description: string;
  slot?: number;
  activityDate?: string;
  startTime?: string;
  endTime?: string;
  mapUrl?: string;
  price: number;
  priceDiscount?: number;
  facilities?: string;
  address: string;
  provinceId?: string;
  locationMap?: string;
  imageUrls?: string[];
}

export interface UpdateActivityRequest extends CreateActivityRequest {
  id: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  imageUrl: string;
  accountNumber: string;
  accountName: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionStatus = "pending" | "success" | "failed" | "cancelled";

export interface TransactionItem {
  sportActivityId: string;
  quantity: number;
  price: number;
  priceDiscount: number;
}

export interface Transaction {
  id: string;
  userId: string;
  paymentMethodId: string;
  status: TransactionStatus;
  totalAmount: number;
  proofPaymentUrl: string | null;
  transactionItems: TransactionItem[];
  createdAt: string;
  updatedAt: string;
  // Populated fields
  user?: User;
  paymentMethod?: PaymentMethod;
  items?: Array<{
    id: string;
    quantity: number;
    price: number;
    priceDiscount: number;
    sportActivity?: SportActivity;
  }>;
}

export interface CreateTransactionRequest {
  paymentMethodId: string;
  transactionItems: TransactionItem[];
}

export interface UpdateProofPaymentRequest {
  transactionId: string;
  proofPaymentUrl: string;
}

export interface UpdateStatus {
  transactionId: string;
  status: string;
}

export interface CartItem {
  activity: SportActivity;
  quantity: number;
}

export interface ActivityFilters {
  categoryId?: string;
  provinceId?: string;
  cityId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest";
}

export interface UploadResponse {
  imageUrl: string;
}
