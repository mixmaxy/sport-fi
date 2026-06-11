import { cn } from "@/shared/utils/cn";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  narrow?: boolean;
  centered?: boolean;
}

export function PageShell({
  children,
  className,
  contentClassName,
  narrow = false,
  centered = false,
}: PageShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div
        className={cn(
          "mx-auto px-4 py-8 pb-16 sm:px-6 lg:px-10",
          narrow ? "max-w-5xl" : "max-w-7xl",
          centered &&
            "flex min-h-[60vh] flex-col items-center justify-center text-center",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
