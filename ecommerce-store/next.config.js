/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["res.cloudinary.com", "via.placeholder.com"],
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 4,
  },
  webpack: (config, { isServer, webpack }) => {
    // Fix for Stripe module resolution issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    
    // Handle dynamic imports that might cause './en' module errors
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/en$/,
        contextRegExp: /@stripe/,
      })
    );
    
    return config;
  },
};

module.exports = nextConfig;
