"use client";

import { usePathname } from "next/navigation";
import MainHeader from "./mainHeader/MainHeader";

const Header = () => {
  const pathname = usePathname();

  if (pathname.includes("/teacher") || pathname.includes("/admin")) {
    return null; // Ẩn header trong workspace
  }

  return <MainHeader />;
};

export default Header;
