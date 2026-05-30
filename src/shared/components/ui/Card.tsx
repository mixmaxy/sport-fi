import React from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * Card Component
 * 
 * Why:
 * - Consistent card styling across the app
 * - Composable with CardHeader, CardBody, CardFooter
 * - Hover states for interactive cards
 * - Semantic HTML with article/section elements
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean;
    as?: 'div' | 'article' | 'section';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverable = false, as: Component = 'div', children, ...props }, ref) => {
        return (
            <Component
                ref={ref}
                className={cn(
                    'bg-white rounded-lg border border-gray-200 shadow-sm',
                    hoverable && 'transition-shadow hover:shadow-md cursor-pointer',
                    className
                )}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

Card.displayName = 'Card';

/**
 * CardHeader Component
 * 
 * Why: Semantic structure for card titles and actions
 */
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, action, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'px-6 py-4 border-b border-gray-200',
                    action && 'flex items-center justify-between',
                    className
                )}
                {...props}
            >
                {children}
                {action && <div className="ml-4">{action}</div>}
            </div>
        );
    }
);

CardHeader.displayName = 'CardHeader';

/**
 * CardBody Component
 */
export const CardBody = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    return (
        <div ref={ref} className={cn('px-6 py-4', className)} {...props}>
            {children}
        </div>
    );
});

CardBody.displayName = 'CardBody';

/**
 * CardFooter Component
 */
export const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn('px-6 py-4 border-t border-gray-200 bg-gray-50', className)}
            {...props}
        >
            {children}
        </div>
    );
});

CardFooter.displayName = 'CardFooter';