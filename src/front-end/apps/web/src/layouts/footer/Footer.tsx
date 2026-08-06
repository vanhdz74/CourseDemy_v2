"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const pathname = usePathname();

  if (pathname.includes("/teacher") || pathname.includes("/admin")) {
    return null; // Ẩn footer trong workspace
  }

  return (
    <footer id="contact" className="mt-20 border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        {/* Logo & About */}
        <div className="flex flex-col items-start">
          <Image src="/logo/logo.png" alt="Logo" width={128} height={44} className="h-11 w-auto rounded-sm bg-white px-2 py-1" />
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">
            Nền tảng học trực tuyến hàng đầu giúp bạn nâng cao kỹ năng và đạt
            mục tiêu nhanh hơn.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="mb-4 text-sm font-semibold">Khám phá</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <Link href="/" className="transition hover:text-white">Trang chủ</Link>
            </li>
            <li>
              <Link href="/courses/search" className="transition hover:text-white">Khóa học</Link>
            </li>
            <li>
              <Link href="/home#introduce" className="transition hover:text-white">Về chúng tôi</Link>
            </li>
            <li>
              <Link href="/home#trend" className="transition hover:text-white">Khóa học nổi bật</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="mb-4 text-sm font-semibold">Hỗ trợ</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <Link href="/setting" className="transition hover:text-white">Cài đặt tài khoản</Link>
            </li>
            <li>
              <Link href="/student/my-courses" className="transition hover:text-white">Khóa học của tôi</Link>
            </li>
            <li>
              <Link href="#contact" className="transition hover:text-white">Liên hệ</Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-4 text-sm font-semibold">Kết nối với chúng tôi</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/vietanh.hoang.96199"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-white/30 hover:text-white"
              aria-label="CourseDemy Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987H7.898v-2.89h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.242 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
          </div>
          <h3 className="mb-3 mt-6 text-sm font-semibold">
            Đăng ký làm giảng viên của CourseDemy
          </h3>
          <p className="text-sm leading-6 text-slate-300">Liên hệ qua email:</p>
          <a href="mailto:vanhnekdungso74@gmail.com" className="text-sm text-purple-200 underline-offset-4 hover:underline">
            vanhnekdungso74@gmail.com
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} CourseDemy.
      </div>
    </footer>
  );
};

export default Footer;
