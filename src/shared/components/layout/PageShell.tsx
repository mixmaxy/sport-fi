import { cn } from "@/shared/utils/cn";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export function PageShell({
  children,
  className,
  narrow = false,
}: PageShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div
        className={cn(
          "mx-auto px-4 py-8 sm:px-6 lg:px-10",
          narrow ? "max-w-5xl" : "max-w-7xl",
        )}
      >
        {children}
      </div>
    </div>
  );
}
