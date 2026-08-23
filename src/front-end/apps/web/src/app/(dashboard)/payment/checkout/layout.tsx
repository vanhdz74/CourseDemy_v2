"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { useAppDispatch } from "@/modules/shared/store/hooks";
import { clearCheckoutCourses } from "@/modules/payment/store/checkoutSlice";
import { ModeToggle } from "@/modules/shared/components/mode-toggle";
import { LanguageSwitcher } from "@/modules/shared/i18n";
import { ArrowLeft, CheckCircle2, CreditCard, GraduationCap, ShieldCheck } from "lucide-react";
import Image from "next/image";

const CHECKOUT_COURSES_STORAGE_KEY = "checkout_courses";
const CHECKOUT_ITEMS_STORAGE_KEY = "checkout_items";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    dispatch(clearCheckoutCourses());
    if (typeof window !== "undefined") {
      localStorage.removeItem(CHECKOUT_COURSES_STORAGE_KEY);
      localStorage.removeItem(CHECKOUT_ITEMS_STORAGE_KEY);
      window.location.href = "/cart";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background text-foreground flex flex-col">
      {/* Modern Sticky Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur-md sm:px-8">
        {/* Left: Brand + Back */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo/logo.png"
              alt="CourseDemy Logo"
              width={34}
              height={34}
              className="h-8 w-8 object-contain"
            />
            <span className="font-extrabold text-base tracking-tight text-foreground sm:text-lg">
              Course<span className="text-primary">Demy</span>
            </span>
            <span className="hidden sm:inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
              Checkout
            </span>
          </Link>
        </div>

        {/* Center: Step Indicator (Desktop) */}
        <div className="hidden md:flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Giỏ hàng</span>
          </div>
          <span className="text-muted-foreground/40 font-mono">/</span>
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-primary">
            <CreditCard className="h-3.5 w-3.5" />
            <span>Thanh toán bảo mật</span>
          </div>
          <span className="text-muted-foreground/40 font-mono">/</span>
          <div className="flex items-center gap-1.5 text-muted-foreground/60">
            <GraduationCap className="h-4 w-4" />
            <span>Vào học ngay</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <ModeToggle />
          <div className="h-4 w-[1px] bg-border mx-1" />
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Quay lại giỏ hàng</span>
            <span className="sm:hidden">Hủy</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>

      {/* Subtle Security Footer */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 px-4 sm:justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Mọi giao dịch được mã hóa 256-bit SSL tiêu chuẩn quốc tế</span>
          </div>
          <p>© {new Date().getFullYear()} CourseDemy Inc. Bảo lưu mọi quyền.</p>
        </div>
      </footer>
    </div>
  );
}

