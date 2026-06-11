import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "**.dibimbing.id" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: "https",
        hostname: "dibimbing-cdn.sgp1.cdn.digitaloceanspaces.com",
      },
      { protocol: "https", hostname: "**.digitaloceanspaces.com" },
      // Bukti bayar / upload dari API lokal atau staging
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
    ],
  },
};

export default nextConfig;
