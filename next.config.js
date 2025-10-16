/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // Correctly enable serverActions
  },
  images: {
    domains: ['utfs.io', 'coffee.alexflipnote.dev'],
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