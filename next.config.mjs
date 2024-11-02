// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: "export",
//   reactStrictMode: false,
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "192.168.0.216",
//         pathname: "**",
//       },
//     ],
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: "export",
  // basePath: "/", // Replace 'mazftp' with your actual subdirectory name
  // assetPrefix: "/", // Replace 'mazftp' with your actual subdirectory name
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
