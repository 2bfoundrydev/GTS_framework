/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Turbopack (required in Next 16 when a webpack config exists)
  turbopack: {},

  // Existing webpack customization (used only when building with webpack)
  webpack: (config) => {
    config.ignoreWarnings = [{ module: /node_modules\/punycode/ }];
    return config;
  },
};

module.exports = nextConfig;