/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // Correctly enable serverActions
  },
  images: {
    domains: ['utfs.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;