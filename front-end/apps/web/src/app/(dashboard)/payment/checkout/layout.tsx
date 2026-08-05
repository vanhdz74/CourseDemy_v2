"use client";

import React from "react";
import Link from "next/link";
import { ReactNode } from "react";
import { useAppDispatch } from "@/modules/shared/store/hooks";
import { clearCheckoutCourses } from "@/modules/payment/store/checkoutSlice";
import Image from "next/image";

const CHECKOUT_COURSES_STORAGE_KEY = "checkout_courses";
const CHECKOUT_ITEMS_STORAGE_KEY = "checkout_items";

const CheckoutPage = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

  return (
    <>
      <header
        className="flex z-10 bg-white justify-between items-center px-6 border-b border-gray-200 fixed top-0 right-0 left-0 shadow-sm"
        style={{ height: "var(--navHeight)" }}
      >
        {/* Logo */}
        <div>
          <Link href="/" className="font-bold text-xl text-gray-800">
            <Image src="/logo/logo.png" alt="Logo" width={100} height={100} />
          </Link>
        </div>

        {/* Nút Hủy */}
        <button
          onClick={() => {
            dispatch(clearCheckoutCourses());
            localStorage.removeItem(CHECKOUT_COURSES_STORAGE_KEY);
            localStorage.removeItem(CHECKOUT_ITEMS_STORAGE_KEY);
            window.location.href = "/cart";
          }}
          className="hover:underline"
        >
          Huỷ
        </button>
      </header>
      <div className="mt-[var(--navHeight)] mx-auto w-[90%] md:w-[60%]">
        {children}
      </div>
    </>
  );
};

export default CheckoutPage;
