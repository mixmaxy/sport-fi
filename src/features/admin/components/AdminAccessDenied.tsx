"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

interface AdminAccessDeniedProps {
  title?: string;
  description?: string;
  showHomeButton?: boolean;
}

export function AdminAccessDenied({
  title = "Akses Dibatasi",
  description = "Anda tidak memiliki kredensial admin untuk mengakses halaman ini.",
  showHomeButton = true,
}: AdminAccessDeniedProps) {
  const router = useRouter();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center space-y-4 px-4 text-center">
      <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
      <h2 className="text-2xl font-bold text-on-surface">{title}</h2>
      <p className="text-on-surface-variant">{description}</p>
      {showHomeButton ? (
        <Button onClick={() => router.push("/")}>Kembali ke Beranda</Button>
      ) : null}
    </div>
  );
}
