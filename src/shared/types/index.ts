export interface ApiResponse<T = any> {
    code: string;
    status: string;
    message: string;
    data: T;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    profilePictureUrl: string | null;
    role: 'user' | 'admin';
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

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    passwordRepeat: string;
    phoneNumber: string;
    profilePictureUrl?: string;
    role?: 'user' | 'admin';
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    phoneNumber?: string;
    profilePictureUrl?: string;
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
    priceDiscount: number;
    rating: number;
    totalReviews: number;
    facilities: string;
    address: string;
    provinceId: string;
    cityId: string;
    locationMap: string;
    imageUrls: string[];
    createdAt: string;
    updatedAt: string;
    // Populated fields
    category?: SportCategory;
    province?: Province;
    city?: City;
}

export interface CreateActivityRequest {
    sportCategoryId: string;
    title: string;
    description: string;
    price: number;
    priceDiscount: number;
    facilities: string;
    address: string;
    provinceId: string;
    cityId: string;
    locationMap: string;
    imageUrls: string[];
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

export type TransactionStatus = 'pending' | 'success' | 'cancelled';

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
    sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

export interface UploadResponse {
    imageUrl: string;
}