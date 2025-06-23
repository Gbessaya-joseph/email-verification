import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // appDir: true, // Active le répertoire d'application
    serverActions: {
      bodySizeLimit: '10mb',
    },

  },
  output: 'standalone', // Nécessaire pour un build Docker optimisé
};

export default nextConfig;
