"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const pathname = usePathname();

  if (pathname.includes("/teacher") || pathname.includes("/admin")) {
    return null; // Ẩn footer trong dashboard
  }

  return (
    <footer id="contact" className="bg-[#2a2b3f] text-white mt-20">
      <div className="max-w-6xl mx-auto py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & About */}
        <div className="flex flex-col items-start">
          <Image src="/logo/logo.png" alt="Logo" width={120} height={40} />
          <p className="mt-4 text-gray-300">
            Nền tảng học trực tuyến hàng đầu giúp bạn nâng cao kỹ năng và đạt
            mục tiêu nhanh hơn.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-4">Khám phá</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/">Trang chủ</Link>
            </li>
            <li>
              <Link href="/courses">Khóa học</Link>
            </li>
            <li>
              <Link href="/about">Về chúng tôi</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-4">Hỗ trợ</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/help">Trung tâm trợ giúp</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/contact">Liên hệ</Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold mb-4">Kết nối với chúng tôi</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/vietanh.hoang.96199"
              className="text-gray-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987H7.898v-2.89h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.242 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
          </div>
          <h3 className="font-semibold mb-4 mt-5">
            Đăng ký làm giảng viên của CourseDemy
          </h3>
          Liên hệ qua email:{" "}
          <a href="" className="text-blue-400 hover:underline">
            vanhnekdungso74@gmail.com
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} CourseDemy.
      </div>
    </footer>
  );
};

export default Footer;
