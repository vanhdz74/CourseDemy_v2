import type { NextConfig } from "next";

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  // theo dõi các thư viện phụ thuộc
  // output: "export",
  output: "standalone",

  typescript: { ignoreBuildErrors: true },
  turbopack: {
    root: __dirname,
  },

  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img4.thuthuatphanmem.vn",
        pathname: "/**", // cho phép mọi đường dẫn từ domain này
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "/**",
      },
    ],
  },
};
// module.exports = nextConfig;

export default nextConfig;
