import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Sources are already sized (Supabase Storage / 1280px thumbnails), so the
    // optimizer only ever transcodes + resizes small images. Cache the
    // optimized variants at the edge for a day to cut repeat cost + latency.
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "qtqignacbrwhblgjbxat.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
