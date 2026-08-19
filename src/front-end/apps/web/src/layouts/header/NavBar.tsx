"use client";

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

  return (
    <header className="sticky top-[var(--navHeight)] z-40 -mx-4 border-b border-border bg-background/90 backdrop-blur sm:-mx-6 lg:-mx-8">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Menu */}
        <nav className="flex items-center gap-2 overflow-x-auto">
          {navBarItem.map(({ href, labelKey }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35",
                  isActive && "bg-accent text-accent-foreground",
                )}
              >
                {t(labelKey)}

                {/* underline effect */}
                <span className="inset-x-3 -bottom-[5px] h-[2px] scale-x-0 rounded-full bg-primary transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden shrink-0 md:block">
          <Link
            href="/login"
            className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
          >
            {t("nav.startLearning")}
          </Link>
        </div>
      </div>
    </header>
  );
}
