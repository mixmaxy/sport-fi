import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/shared/components/providers/AppProviders";
import { AppShell } from "@/shared/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "SportReserve - Reservasi Olahraga Online",
    template: "%s | SportReserve",
  },
  description:
    "Platform reservasi olahraga terpercaya untuk menemukan dan memesan berbagai aktivitas olahraga di seluruh Indonesia. Mudah, cepat, dan aman.",
  keywords: [
    "reservasi olahraga",
    "booking olahraga",
    "aktivitas olahraga",
    "lapangan olahraga",
    "gym",
    "fitness",
    "Indonesia",
  ],
  authors: [{ name: "SportReserve Team" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://sportreserve.com",
    siteName: "SportReserve",
    title: "SportReserve - Reservasi Olahraga Online",
    description:
      "Platform reservasi olahraga terpercaya untuk menemukan dan memesan berbagai aktivitas olahraga di seluruh Indonesia.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
