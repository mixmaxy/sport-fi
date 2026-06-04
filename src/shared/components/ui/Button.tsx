import React from 'react';
import { cn } from '@/shared/utils/cn';

/**
 * Button Component
 * 
 * Why:
 * - Consistent button styling across the app
 * - Variants for different use cases
 * - Proper accessibility with disabled states
 * - Loading state support
 * - Semantic HTML with <button> element
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        // Variant styles
        const variants = {
            primary: 'bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] focus-visible:ring-primary shadow-md',
            secondary: 'bg-on-surface-variant text-on-primary hover:brightness-110 focus-visible:ring-on-surface-variant',
            outline: 'border-2 border-primary text-primary hover:bg-surface-container-low active:bg-surface-container focus-visible:ring-primary',
            ghost: 'text-on-surface-variant hover:bg-surface-container-low active:bg-surface-container focus-visible:ring-primary',
            danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500',
        };

        // Size styles
        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    // Base styles
                    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
                    // Variant and size
                    variants[variant],
                    sizes[size],
                    // Full width
                    fullWidth && 'w-full',
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {!isLoading && leftIcon}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';