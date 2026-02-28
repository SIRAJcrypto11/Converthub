/** @type {import('next').NextConfig} */
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
  serverExternalPackages: ['canvas', 'tesseract.js'],
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'commonjs canvas' }];
    return config;
  },
};

module.exports = nextConfig;