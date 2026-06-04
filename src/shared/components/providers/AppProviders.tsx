"use client";

import { Toaster } from "sonner";
import { AuthHydrationProvider } from "./AuthHydrationProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthHydrationProvider>
      {children}
      <Toaster position="top-right" richColors />
    </AuthHydrationProvider>
  );
}
