import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  // Ensure we don't spawn excessive processes in restricted environments
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  staticPageGenerationTimeout: 300,
};

export default nextConfig;
