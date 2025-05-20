import withPWA from 'next-pwa';

// Vous devrez remplacer 'gammes-musicales' par le nom exact de votre dépôt GitHub
// si vous utilisez un nom différent
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
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  ...nextConfig,
});
