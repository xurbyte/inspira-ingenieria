import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: false,
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
  },
}

export default nextConfig;
