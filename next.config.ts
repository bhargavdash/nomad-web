import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Reverse-proxy every `/api/*` request to the backend so clients (this web app
  // AND the Android app) only ever talk to our own origin — never the Railway
  // domain directly. This masks *.up.railway.app, which some ISPs (e.g. Jio)
  // fail to resolve. Rewrites run both on Vercel and in `next dev`, so local
  // development uses the exact same path as production.
  //
  // API_PROXY_TARGET holds the real backend origin (Railway in prod, a local
  // API in dev). When unset, no rewrite is added — set NEXT_PUBLIC_API_URL to an
  // absolute url in that case to call a backend directly.
  async rewrites() {
    const target = process.env.API_PROXY_TARGET;
    if (!target) return [];
    const origin = target.replace(/\/$/, "");
    return [
      // Special case: the backend health check lives at the root `/health`, not
      // under `/api`. Expose it as `/api/health` so it can be reached through the
      // same masked origin. Must precede the catch-all below (first match wins).
      {
        source: "/api/health",
        destination: `${origin}/health`,
      },
      // Everything else: `/api/v1/*` (and any other `/api/*`) forwards verbatim,
      // preserving method, path params, query string, headers (Authorization),
      // and request body — so JSON and multipart both pass through unchanged.
      {
        source: "/api/:path*",
        destination: `${origin}/api/:path*`,
      },
    ];
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
