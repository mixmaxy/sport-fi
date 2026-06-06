"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useLogout } from "@/features/auth/hooks/useAuthMutations";
import { Button } from "../ui/Button";
import { cn } from "@/shared/utils/cn";
import { toast } from "sonner";

const navLinks = [
  { href: "/", label: "Home", match: (path: string) => path === "/" },
  {
    href: "/activities",
    label: "Venues",
    match: (path: string) =>
      path === "/activities" || path.startsWith("/activities/"),
  },
  {
    href: "/dashboard",
    label: "My Bookings",
    match: (path: string) => path.startsWith("/dashboard"),
  },
  {
    href: "/me",
    label: "Profil",
    match: (path: string) => path === "/me",
    authOnly: true,
  },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const { totalItems } = useCartStore();
  const { mutate: logout } = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const visibleNavLinks = navLinks.filter(
    (link) => isAuthenticated || !("authOnly" in link && link.authOnly),
  );

  const handleLogout = () => {
    logout({
      onSuccess: () => {
        toast.success("Berhasil keluar. Sampai jumpa!");
      },
      onError: () => {
        toast.error("Gagal logout dari server, sesi lokal telah dihapus.");
      },
    });
    setIsMobileMenuOpen(false);
  };

  const closeMobile = () => setIsMobileMenuOpen(false);

  return (
    <header
      className="sticky top-0 z-50 border-b border-outline-variant bg-background/90 shadow-sm backdrop-blur-md"
      role="banner"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-primary transition-colors hover:text-primary/90"
        >
          Sport Reserve
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {visibleNavLinks.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-semibold tracking-wide transition-colors duration-200",
                  active
                    ? "border-b-2 border-primary pb-1 text-primary"
                    : "text-on-surface-variant hover:text-primary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/cart"
            className="relative rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
            aria-label={`Keranjang, ${totalItems} item`}
          >
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-outline-variant text-on-surface hover:border-primary hover:bg-surface-container-low"
                  >
                    Admin
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                leftIcon={<LogOut className="h-4 w-4" />}
              >
                Keluar
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button
                size="sm"
                className="rounded-lg bg-primary px-6 font-bold shadow-md hover:brightness-110 active:scale-95"
              >
                Login
              </Button>
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-outline-variant bg-background/95 backdrop-blur-md md:hidden">
          <div className="space-y-1 px-4 py-4">
            {visibleNavLinks.map((link) => {
              const active = link.match(pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-base font-semibold transition-colors",
                    active
                      ? "bg-surface-container-low text-primary"
                      : "text-on-surface-variant hover:bg-surface-container-low",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/categories"
              onClick={closeMobile}
              className="block rounded-lg px-3 py-2.5 text-base font-medium text-on-surface-variant hover:bg-surface-container-low"
            >
              Categories
            </Link>

            <Link
              href="/cart"
              onClick={closeMobile}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-on-surface-variant hover:bg-surface-container-low"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Keranjang
              </span>
              {totalItems > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-on-primary">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={closeMobile}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-medium text-primary hover:bg-surface-container-low"
                  >
                    <Shield className="h-5 w-5" />
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={closeMobile}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-medium text-on-surface-variant hover:bg-surface-container-low"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  Keluar
                </button>
              </>
            ) : (
              <div className="flex gap-3 border-t border-outline-variant pt-4">
                <Link href="/login" onClick={closeMobile} className="flex-1">
                  <Button
                    fullWidth
                    size="sm"
                    className="bg-primary font-bold hover:brightness-110"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={closeMobile} className="flex-1">
                  <Button
                    fullWidth
                    variant="outline"
                    size="sm"
                    className="border-outline-variant"
                  >
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
