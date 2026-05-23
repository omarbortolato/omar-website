/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow any HTTPS image source (blog covers can come from any host)
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
