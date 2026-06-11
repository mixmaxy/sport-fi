import { cn } from "@/shared/utils/cn";

interface ExternalImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
}

/** For user/API-provided URLs (bukti bayar, dll.) — avoids next/image hostname allowlist. */
export function ExternalImage({
  src,
  alt,
  className,
  fill,
}: ExternalImageProps) {
  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full", className ?? "object-cover")}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  );
}
