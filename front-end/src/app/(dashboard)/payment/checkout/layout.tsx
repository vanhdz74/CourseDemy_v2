"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const router = useRouter();

  return (
    <header
      className="flex z-10 bg-white justify-between items-center px-6 border-b border-gray-200 fixed top-0 right-0 left-0 shadow-sm"
      style={{ height: "var(--navHeight)" }}
    >
      {/* Logo */}
      <div>
        <Link href="/" className="font-bold text-xl text-gray-800">
          LOGO
        </Link>
      </div>

      {/* Nút Hủy */}
      <button onClick={() => router.back()} className="hover:underline">
        Huỷ
      </button>
    </header>
  );
};

export default CheckoutPage;
