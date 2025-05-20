import withPWA from 'next-pwa';

const basePath = process.env.NODE_ENV === 'production' ? '/gamme_trainer' : '';

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  assetPrefix: basePath,
  basePath: basePath,
  output: 'export',
  trailingSlash: true,
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
};

export default withPWA(nextConfig);
