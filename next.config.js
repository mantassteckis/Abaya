/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  // Adding webpack configuration to fix potential issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = [...(config.externals || []), { canvas: "canvas" }];
    }
    return config;
  },
  // Disable type checking during build (can be re-enabled later)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build (can be re-enabled later)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 