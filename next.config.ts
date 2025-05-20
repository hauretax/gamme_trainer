const withPWA = require('next-pwa')({
  dest: 'public',
  // basePath: '/gamme_trainer'
});


module.exports = withPWA({
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  assetPrefix: '/gamme_trainer',
  basePath:'/gamme_trainer',
  output: 'export',
  trailingSlash: true,
});
