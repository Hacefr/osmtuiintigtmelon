/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/osmtuiintigtmelon', // This MUST match your repository name exactly!
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
