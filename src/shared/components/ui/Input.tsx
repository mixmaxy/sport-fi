import React from 'react';
import { cn } from '@/shared/utils/cn';

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
    endAdornment?: React.ReactNode;
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
            endAdornment,
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
                        className="block text-sm font-semibold text-on-surface mb-1.5"
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            // Base styles
                            'w-full px-3 py-2.5 rounded-lg border bg-surface-container-lowest transition-colors text-on-surface',
                            'placeholder:text-on-surface-variant',
                            'focus:outline-none focus:ring-1 focus:ring-offset-0',
                            'disabled:bg-surface-container-low disabled:cursor-not-allowed disabled:text-on-surface-variant',
                            // Icon padding
                            leftIcon && 'pl-10',
                            (rightIcon || endAdornment) && 'pr-10',
                            // Error state
                            error
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-outline-variant focus:border-primary focus:ring-primary',
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
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                            {rightIcon}
                        </div>
                    )}

                    {endAdornment && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {endAdornment}
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
                        className="mt-1.5 text-sm text-on-surface-variant"
                    >
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';