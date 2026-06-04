/**
 * Utility Functions
 * 
 * Why: Centralized helper functions for common operations
 * - Consistent formatting across the app
 * - Reusable and testable
 * - Easy to maintain and update
 */

/**
 * Format number to Indonesian Rupiah currency
 * 
 * Why: Provides consistent currency formatting
 * Uses Intl.NumberFormat for proper locale support
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Format date to readable format
 * 
 * Why: Consistent date formatting across the app
 * Uses Intl.DateTimeFormat for locale support
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (format === 'long') {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(dateObj);
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(dateObj);
};

/**
 * Calculate discount percentage
 * 
 * Why: Displays discount percentage for better UX
 */
export const calculateDiscountPercentage = (originalPrice: number, discountPrice: number): number => {
    if (originalPrice <= 0 || discountPrice >= originalPrice) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

/**
 * Truncate text with ellipsis
 * 
 * Why: Prevents UI breaking from long text
 * Useful for card descriptions, titles, etc.
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

/**
 * Debounce function
 * 
 * Why: Optimizes performance for search inputs and scroll events
 * Prevents excessive API calls or expensive operations
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * Validate email format
 * 
 * Why: Client-side validation for better UX
 * Provides immediate feedback before form submission
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (Indonesian format)
 * 
 * Why: Ensures phone numbers are in correct format
 * Supports common Indonesian phone formats
 */
export const isValidPhoneNumber = (phone: string): boolean => {
    // Accepts: 08xxxxxxxxxx or +628xxxxxxxxxx (10-13 digits after prefix)
    const phoneRegex = /^(\+62|62|0)8[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Get initials from name
 * 
 * Why: Useful for avatar placeholders when no profile picture
 */
export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

/**
 * Generate unique ID
 * 
 * Why: Useful for temporary IDs or keys in lists
 */
export const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Sleep/delay function
 * 
 * Why: Useful for testing loading states or rate limiting
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Check if file is image
 * 
 * Why: Validates file uploads before sending to server
 */
export const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
};

/**
 * Format file size
 * 
 * Why: Human-readable file size for upload UI
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get status badge color
 * 
 * Why: Consistent status coloring across the app
 */
export const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        success: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

/**
 * Sanitize HTML to prevent XSS
 * 
 * Why: Security - prevents script injection in user-generated content
 */
export const sanitizeHtml = (html: string): string => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
};