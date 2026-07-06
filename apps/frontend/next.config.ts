import { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, '../../'),
  },

  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cinagloria-service-bucket.s3.us-east-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
