// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// export default nextConfig;
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // other config if needed
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Provide a false fallback for fs to silence the build error
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
}

export default nextConfig
