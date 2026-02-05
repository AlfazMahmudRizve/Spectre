/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all for now directly to prevent crashes
      },
    ],
  },
};

export default nextConfig;
