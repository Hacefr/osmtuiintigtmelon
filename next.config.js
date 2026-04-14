/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/osmtuiintigtmelon', // This MUST match your repository name
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
