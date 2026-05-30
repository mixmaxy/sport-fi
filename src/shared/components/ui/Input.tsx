import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Input Component
 * 
 * Why:
 * - Semantic HTML with proper labels
 * - Accessibility with ARIA attributes
 * - Error state handling
 * - Support for React Hook Form
 * - Consistent styling across forms
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            id,
            required,
            ...props
        },
        ref
    ) => {
        // Generate ID if not provided (needed for label association)
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            // Base styles
                            'w-full px-3 py-2 rounded-lg border transition-colors',
                            'placeholder:text-gray-400',
                            'focus:outline-none focus:ring-2 focus:ring-offset-1',
                            'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
                            // Icon padding
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            // Error state
                            error
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                            className
                        )}
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={
                            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                        }
                        required={required}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {/* Error message */}
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="mt-1.5 text-sm text-red-600"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                {/* Helper text */}
                {helperText && !error && (
                    <p
                        id={`${inputId}-helper`}
                        className="mt-1.5 text-sm text-gray-500"
                    >
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';