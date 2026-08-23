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
  Clock,
  X,
  Sparkles,
  CornerDownLeft,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { useState, ChangeEvent, useEffect, useRef } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

const POPULAR_SUGGESTIONS = [
  "React",
  "Next.js",
  "JavaScript",
  "TypeScript",
  "Java",
  "Spring Boot",
  "Python",
  "Node.js",
  "NestJS",
  "Tailwind CSS",
  "HTML & CSS",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "Kubernetes",
  "UI/UX Design",
  "Figma",
  "Flutter",
  "Golang",
  "C++",
  "C# / .NET",
  "Machine Learning",
  "Data Science",
  "DevOps",
];

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.trim().toLowerCase() ? (
      <span key={i} className="text-primary font-bold">
        {part}
      </span>
    ) : (
      part
    )
  );
}

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
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const containerRef = useRef<HTMLFormElement>(null);

  // Khi URL thay đổi (ví dụ khi người dùng search mới), cập nhật lại input
  useEffect(() => {
    setKeyword(keywordFromUrl);
  }, [keywordFromUrl]);

  // Load search history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("coursedemy.search-history") || "[]");
    setSearchHistory(history);
  }, []);

  // Close search history when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const saveSearchHistory = (term: string) => {
    if (!term || !term.trim()) return;
    const cleanTerm = term.trim();
    const history = JSON.parse(localStorage.getItem("coursedemy.search-history") || "[]");
    const updatedHistory = [
      cleanTerm,
      ...history.filter((h: string) => h.toLowerCase() !== cleanTerm.toLowerCase())
    ].slice(0, 5);
    localStorage.setItem("coursedemy.search-history", JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim()) {
      saveSearchHistory(keyword);
      setShowHistory(false);
      router.push(`/courses/search?keyword=${keyword}`);
    }
  };

  const handleHistoryItemClick = (term: string) => {
    setKeyword(term);
    setShowHistory(false);
    saveSearchHistory(term);
    router.push(`/courses/search?keyword=${term}`);
  };

  const removeHistoryItem = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    e.preventDefault();
    const updated = searchHistory.filter((h) => h !== term);
    setSearchHistory(updated);
    localStorage.setItem("coursedemy.search-history", JSON.stringify(updated));
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSearchHistory([]);
    localStorage.removeItem("coursedemy.search-history");
  };

  const handleFocus = () => {
    const history = JSON.parse(localStorage.getItem("coursedemy.search-history") || "[]");
    setSearchHistory(history);
    setShowHistory(true);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  // Ẩn Header trên trang login / register
  if (pathname === "/login" || pathname === "/register") return null;

  const query = keyword.trim().toLowerCase();

  // Lọc từ khóa đã tìm kiếm trước đó khớp với chữ đang gõ
  const matchedHistory = searchHistory.filter((item) =>
    item.toLowerCase().includes(query)
  );

  // Lọc gợi ý từ khóa chủ đề khớp với chữ đang gõ
  const matchedSuggestions = POPULAR_SUGGESTIONS.filter(
    (item) =>
      item.toLowerCase().includes(query) &&
      !matchedHistory.some((h) => h.toLowerCase() === item.toLowerCase())
  );

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
        ref={containerRef}
        action=""
        onSubmit={handleSubmit}
        className="relative group mx-3 hidden min-w-[220px] max-w-2xl flex-1 items-center sm:flex lg:mx-8 lg:flex-none lg:basis-[42%]"
      >
        <Input
          type="text"
          placeholder={t("header.searchPlaceholder")}
          className="h-10 w-full rounded-full border-border bg-muted/30 pl-10 pr-4 text-sm shadow-none transition-all duration-300 hover:border-border/80 hover:bg-muted/50 focus-visible:border-primary/50 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/10"
          value={keyword}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground/60 transition-colors duration-300 group-focus-within:text-primary" />

        {/* Search History & Live Autocomplete Suggestions Dropdown overlay */}
        {showHistory && (
          <div className="absolute top-11 left-0 right-0 z-50 rounded-2xl border border-border bg-popover/95 p-3 shadow-xl backdrop-blur-md flex flex-col gap-2.5">
            {/* Khi người dùng ĐANG GÕ chữ vào ô tìm kiếm */}
            {query.length > 0 ? (
              <div className="flex flex-col gap-2">
                {/* Hành động tìm kiếm trực tiếp từ đang gõ */}
                <div
                  onMouseDown={() => handleHistoryItemClick(keyword)}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-foreground bg-primary/5 hover:bg-primary/10 border border-primary/20 transition duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Search className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">
                      Tìm kiếm cho <span className="font-bold text-primary">"{keyword}"</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground/80 bg-muted px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                    Enter <CornerDownLeft className="h-2.5 w-2.5" />
                  </span>
                </div>

                {/* Danh sách từ ĐÃ TỪNG TÌM KIẾM khớp với chữ đang gõ */}
                {matchedHistory.length > 0 && (
                  <div className="flex flex-col gap-1 border-t border-border/40 pt-2">
                    <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-primary" />
                      Từ khóa đã tìm trước đó
                    </div>
                    <div className="flex flex-col gap-0.5 max-h-[140px] overflow-y-auto scrollbar-none">
                      {matchedHistory.map((term) => (
                        <div
                          key={`hist-${term}`}
                          onMouseDown={() => handleHistoryItemClick(term)}
                          className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition duration-200 cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground/45 shrink-0" />
                            <span className="truncate font-medium">
                              {highlightMatch(term, keyword)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground/70 font-medium">
                              Lịch sử
                            </span>
                            <button
                              type="button"
                              onMouseDown={(e) => removeHistoryItem(e, term)}
                              className="p-1 rounded-full text-muted-foreground/45 hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Danh sách GỢI Ý CHỦ ĐỀ khớp với chữ đang gõ */}
                {matchedSuggestions.length > 0 && (
                  <div className="flex flex-col gap-1 border-t border-border/40 pt-2">
                    <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-primary" />
                      Gợi ý chủ đề liên quan
                    </div>
                    <div className="flex flex-col gap-0.5 max-h-[160px] overflow-y-auto scrollbar-none">
                      {matchedSuggestions.slice(0, 6).map((term) => (
                        <div
                          key={`sugg-${term}`}
                          onMouseDown={() => handleHistoryItemClick(term)}
                          className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition duration-200 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Search className="h-3.5 w-3.5 text-muted-foreground/45 shrink-0" />
                            <span className="truncate font-medium">
                              {highlightMatch(term, keyword)}
                            </span>
                          </div>
                          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Khi không khớp cả lịch sử lẫn gợi ý */}
                {matchedHistory.length === 0 && matchedSuggestions.length === 0 && (
                  <div className="text-center py-3 text-xs text-muted-foreground select-none">
                    Nhấn <strong>Enter</strong> để tìm kiếm mọi khóa học liên quan đến "{keyword}".
                  </div>
                )}
              </div>
            ) : (
              /* Khi ô tìm kiếm ĐANG TRỐNG */
              <>
                {searchHistory.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between px-2 pb-1 border-b border-border/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                      <span>Tìm kiếm gần đây</span>
                      <button
                        type="button"
                        onMouseDown={clearHistory}
                        className="hover:text-destructive transition-colors duration-250 cursor-pointer"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto scrollbar-none">
                      {searchHistory.map((term) => (
                        <div
                          key={term}
                          onMouseDown={() => handleHistoryItemClick(term)}
                          className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition duration-200 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground/40" />
                            <span className="font-semibold">{term}</span>
                          </div>
                          <button
                            type="button"
                            onMouseDown={(e) => removeHistoryItem(e, term)}
                            className="p-1 rounded-full text-muted-foreground/45 hover:text-destructive hover:bg-destructive/10 transition-all duration-250"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-xs text-muted-foreground/80 font-medium select-none">
                    Chưa có lịch sử tìm kiếm gần đây.
                  </div>
                )}

                {/* Popular Suggested Searches */}
                <div className="border-t border-border/40 pt-2.5 flex flex-col gap-2">
                  <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                    Gợi ý tìm kiếm phổ biến
                  </span>
                  <div className="flex flex-wrap gap-2 px-1">
                    {["React", "Next.js", "Java", "Spring Boot", "Tailwind CSS", "TypeScript", "Python", "Docker"].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onMouseDown={() => handleHistoryItemClick(term)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-border/80 bg-background text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-250 cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </form>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://github.com/vanhdz74/CourseDemy_v2"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-background/40 text-muted-foreground shadow-sm transition-all duration-300 hover:scale-105 hover:bg-accent/80 hover:text-foreground hover:border-primary/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
              aria-label={t("header.openGithub")}
            >
              <Github className="h-[1.1rem] w-[1.1rem] transition-transform duration-300 hover:rotate-6" />
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
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-background/40 text-muted-foreground shadow-sm transition-all duration-300 hover:scale-105 hover:bg-accent/80 hover:text-foreground hover:border-primary/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
              aria-label={t("header.cart")}
            >
              <ShoppingCart className="h-[1.1rem] w-[1.1rem] transition-transform duration-300 hover:rotate-6" />

              {/* Badge */}
              <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background animate-pulse">
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
