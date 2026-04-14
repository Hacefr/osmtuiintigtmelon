const withPwa = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = withPwa({
  swcMinify: false,
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
});

module.exports = nextConfig;
