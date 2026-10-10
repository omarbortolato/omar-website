/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow any HTTPS image source (blog covers can come from any host)
      { protocol: "https", hostname: "**" },
    ],
  },
  async rewrites() {
    return [
      // Guida di viaggio personale: pagina statica in public/thailandia/
      { source: "/thailandia", destination: "/thailandia/index.html" },
    ];
  },
};

export default nextConfig;
