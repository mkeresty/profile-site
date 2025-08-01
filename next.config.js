/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/profile-site',
  assetPrefix: '/profile-site',
  images: { unoptimized: true },
};

module.exports = nextConfig;