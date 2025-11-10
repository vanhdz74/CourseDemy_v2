"use client";

import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  if (pathname.includes("/teacher") || pathname.includes("/admin")) {
    return null; // Ẩn header trong dashboard
  }

  return (
    <div id="contact" className="h-[200px] mt-[50px] bg-[#2a2b3f] text-[#fff]">
      Footer
    </div>
  );
};

export default Footer;
