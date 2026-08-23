"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/modules/shared/lib/utils";
import { useI18n } from "@/modules/shared/i18n";

const navBarItem = [
  { href: "#home", labelKey: "nav.home" },
  { href: "#trend", labelKey: "nav.explore" },
  { href: "#introduce", labelKey: "nav.introduce" },
  { href: "#contact", labelKey: "nav.contact" },
];

export default function NavMenu() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    // Chỉ chạy observer trên trang chủ
    if (pathname !== "/" && pathname !== "/home") return;

    const sections = ["home", "trend", "introduce", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -50% 0px", // Trực quan hóa phần giữa màn hình
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [pathname]);

  return (
    <header className="sticky top-[calc(var(--navHeight)+16px)] z-40 mx-auto w-full max-w-5xl rounded-full border border-border/40 bg-background/45 backdrop-blur-lg shadow-lg shadow-black/5 dark:bg-background/30 transition-all duration-300">
      <div className="flex h-12 items-center justify-between px-4 sm:px-6">
        {/* Menu */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navBarItem.map(({ href, labelKey }) => {
            const sectionId = href.replace("#", "");
            const isActive = activeSection === sectionId;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent/40 hover:text-accent-foreground",
                )}
              >
                {t(labelKey)}

                {/* underline effect */}
                <span
                  className={cn(
                    "absolute bottom-0.5 left-3.5 right-3.5 h-0.5 rounded-full bg-primary transition-transform duration-300",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden shrink-0 md:block">
          <Link
            href="/login"
            className="inline-flex h-8 items-center rounded-full bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary/95 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
          >
            {t("nav.startLearning")}
          </Link>
        </div>
      </div>
    </header>
  );
}
