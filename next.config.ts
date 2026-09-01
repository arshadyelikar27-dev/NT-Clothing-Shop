import type { NextConfig } from "next";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}
// JWT_SECRET must be set in environment — no insecure fallback

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  // Tree-shake lucide-react properly — reduces JS bundle size
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // Cache client-side router data for instant back/forward & revisits
    staleTimes: {
      dynamic: 30,  // cache dynamic pages for 30s on client
      static: 180,  // cache static pages for 3 min on client
    },
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },

  // Aggressive HTTP cache headers for static assets
  async headers() {
    return [
      {
        // JS, CSS, fonts — cache 1 year (immutable because Next.js hashes filenames)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Public folder images and assets — cache 30 days
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Fonts
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
