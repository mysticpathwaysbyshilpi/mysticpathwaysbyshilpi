import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    // Restrict resource usage on shared hosting
    workerThreads: false,
    cpus: 1
  }
};

export default nextConfig;
