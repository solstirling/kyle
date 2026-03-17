/** @type {import('next').NextConfig} */
const nextConfig = {
  // Helps Next resolve the correct workspace root (useful when other lockfiles exist above this directory).
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
