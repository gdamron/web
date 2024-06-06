/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ck$/,
      loader: `raw-loader`,
    });

    return config;
  },
};

export default nextConfig;
