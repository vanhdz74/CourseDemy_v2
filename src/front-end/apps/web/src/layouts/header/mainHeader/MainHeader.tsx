"use client";

import { Button } from "@/modules/shared/components/ui/button";
import { Input } from "@/modules/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/shared/components/ui/tooltip";
import { ModeToggle } from "@/modules/shared/components/mode-toggle";
import { LanguageSwitcher, useI18n } from "@/modules/shared/i18n";

import { fetchCartThunk } from "@/modules/cart/store/cartThunk";
import { useAppDispatch, useAppSelector } from "@/modules/shared/store/hooks";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Github,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

const MainHeader = () => {
  const { t } = useI18n();
  const { data: session } = useSession();
  const user = session?.user;
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector((state) => state.cart.items);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy keyword từ URL nếu có
  const keywordFromUrl = searchParams.get("keyword") || "";

  // Khi load lại trang, keyword trong input vẫn giữ nguyên
  const [keyword, setKeyword] = useState<string>(keywordFromUrl);

  // Khi URL thay đổi (ví dụ khi người dùng search mới), cập nhật lại input
  useEffect(() => {
    setKeyword(keywordFromUrl);
  }, [keywordFromUrl]);

  useEffect(() => {
    const userId = Number(user?.id);
    if (user?.role !== "STUDENT" || !Number.isFinite(userId) || userId <= 0) {
      return;
    }

    dispatch(fetchCartThunk({ userId }));
  }, [dispatch, user?.id, user?.role]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/courses/search?keyword=${keyword}`);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  // Ẩn Header trên trang login / register
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-border bg-background/95 px-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:px-6"
      style={{ height: "var(--navHeight)" }}
    >
      {/* Logo */}
      <div className="flex min-w-0 items-center">
        <Link href="/" className="flex items-center">
          <Image
            src={"/logo/logo.png"}
            width={142}
            height={48}
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Input Search */}
      <form
        action=""
        onSubmit={handleSubmit}
        className="relative mx-3 hidden min-w-[220px] max-w-2xl flex-1 items-center sm:flex lg:mx-8 lg:flex-none lg:basis-[42%]"
      >
        <Input
          type="text"
          placeholder={t("header.searchPlaceholder")}
          className="h-10 w-full rounded-full border-border bg-muted/60 pl-10 pr-4 text-sm shadow-none transition focus-visible:border-ring focus-visible:bg-background focus-visible:ring-ring/30"
          value={keyword}
          onChange={handleChange}
        />
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
      </form>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://github.com/vanhdz74/CourseDemy_v2"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/25 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
              aria-label={t("header.openGithub")}
            >
              <Github className="h-4 w-4" />
            </a>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>{t("header.github")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <LanguageSwitcher />
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>
            {t("language.label")}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ModeToggle />
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>{t("theme.label")}</TooltipContent>
        </Tooltip>

        {/* Nếu là học viên */}
        {user?.role === "STUDENT" ? (
          <>
            <Link
              href="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/25 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
              aria-label={t("header.cart")}
            >
              <ShoppingCart className="h-4 w-4" />

              {/* Badge */}
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                {cartItem.length}
              </span>
            </Link>

            {/* Dropdown: Khóa học của tôi */}
            <div className="hidden md:block">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35">
                  <BookOpen className="h-4 w-4" />
                  {t("header.myCourses")}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="mt-3 w-56 rounded-xl border-border p-2 shadow-lg"
                  align="end"
                >
                  <DropdownMenuLabel>{t("header.myCourses")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/student/my-course">{t("common.viewAll")}</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : user?.role === "TEACHER" || user?.role === "ADMIN" ? (
          <Button asChild className="rounded-full">
            <Link href={`/user-class`}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              {t("header.dashboard")}
            </Link>
          </Button>
        ) : null}

        {/* Auth */}
        {!user ? (
          <>
            <Button asChild className="rounded-full">
              <Link href="/login">{t("header.login")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="hidden rounded-full sm:inline-flex"
            >
              <Link href="/register">{t("header.register")}</Link>
            </Button>
          </>
        ) : (
          <div className="hidden md:block">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35">
                <Avatar className="h-10 w-10 cursor-pointer border border-border">
                  <AvatarImage src={user?.avatar_url || ""} />
                  <AvatarFallback>
                    {user?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="mt-3 w-72 rounded-xl border-border p-2 shadow-lg"
                align="end"
              >
                <DropdownMenuLabel className="flex gap-x-3 items-center">
                  <Avatar>
                    <AvatarImage src={user?.avatar_url || ""} />
                    <AvatarFallback>
                      {user?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {user?.role === "STUDENT" && (
                  <DropdownMenuItem asChild>
                    <Link href="/student/my-course">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {t("header.myCourses")}
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                  <Link href={`/setting`}>
                    <UserRound className="mr-2 h-4 w-4" />
                    {t("header.profile")}
                  </Link>
                </DropdownMenuItem>

                {/* <DropdownMenuItem asChild>
                  <Link href="/student/transaction-history">
                    Lịch sử giao dịch
                  </Link>
                </DropdownMenuItem> */}

                <DropdownMenuItem asChild>
                  <Link href="/setting">
                    <Settings className="mr-2 h-4 w-4" />
                    {t("common.settings")}
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("header.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};

export default MainHeader;
