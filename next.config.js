// next.config.js
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  ...(isProd && {
    basePath: '/profile-site',
    assetPrefix: '/profile-site',
  }),
};
