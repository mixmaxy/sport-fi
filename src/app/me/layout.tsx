import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Saya",
  description: "Data akun dari endpoint GET /me",
};

export default function MeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
