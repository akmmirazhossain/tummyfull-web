/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.0.216",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
