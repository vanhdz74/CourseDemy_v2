import type { NextConfig } from "next";

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "encrypted-tbn0.gstatic.com"], // thêm hostname Cloudinary ở đây

    remotePatterns: [
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
      },
    ],
  },
};

export default nextConfig;
