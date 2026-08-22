/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow images from external domains (Clerk avatars, etc.)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.clerk.com' },
      { protocol: 'https', hostname: '**.cloudflare.com' },
    ],
  },
  // Experimental features for Neon + Prisma
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@neondatabase/serverless'],
  },
};

module.exports = nextConfig;
