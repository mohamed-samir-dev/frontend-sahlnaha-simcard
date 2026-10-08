import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 1080, 1200],
    imageSizes: [64, 128, 256],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
    remotePatterns: [
      { hostname: "ibb.co" },
      { hostname: "i.ibb.co" },
      { protocol: "http", hostname: "localhost", port: "5000" },
      { protocol: "http", hostname: "localhost", port: "3000" },
      { protocol: "https", hostname: "**.railway.app" },
      { protocol: "https", hostname: "**.render.com" },
      { protocol: "https", hostname: "**.onrender.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cloudinary.com" },
    ],
  },
};

export default nextConfig;
