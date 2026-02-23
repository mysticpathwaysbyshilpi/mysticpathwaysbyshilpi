import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  // Ensure we don't spawn excessive processes in restricted environments
  experimental: {
    workerThreads: false
  }
};

export default nextConfig;
