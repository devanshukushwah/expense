import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // ✅ Ignore build-time type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
