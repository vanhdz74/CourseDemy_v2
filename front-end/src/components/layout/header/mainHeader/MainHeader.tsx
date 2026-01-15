"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutThunk } from "@/features/auth/authThunks";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";

const MainHeader = () => {
  const { user } = useAppSelector((state) => state.auth);
  const cartItem = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/courses/search?keyword=${keyword}`);
  };

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.push("/login");
  };

  // Ẩn Header trên trang login / register
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <header
      className="flex z-10 bg-white justify-between items-center px-6 border-b border-gray-200 fixed top-0 right-0 left-0 shadow-sm"
      style={{ height: "var(--navHeight)" }}
    >
      {/* Logo */}
      <div>
        <Link href="/">
          <Image
            src={"/logo/logo.png"}
            width={150}
            height={100}
            alt="Logo"
            className="object-contain cursor-pointer"
          />
        </Link>
      </div>

      {/* Input Search */}
      <form
        action=""
        onSubmit={handleSubmit}
        className="flex w-[40%] items-center relative sm:w-[80%] md:w-[60%] lg:w-[40%] mx-8"
      >
        <Input
          type="text"
          placeholder="Nhập từ khoá..."
          className="pl-10 pr-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md w-full"
          value={keyword}
          onChange={handleChange}
        />
        <Search className="absolute left-3 text-gray-400 pointer-events-none" />
      </form>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* <ModeToggle /> */}

        {/* Nếu là học viên */}
        {user?.role === "STUDENT" ? (
          <>
            <Link href="/cart" className="relative">
              <ShoppingCart className="cursor-pointer" />

              {/* Badge */}
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItem.length}
              </span>
            </Link>

            {/* Dropdown: Khóa học của tôi */}
            <div className="hidden md:block">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger>Khoá học của tôi</DropdownMenuTrigger>
                <DropdownMenuContent
                  className="mt-[var(--distanceDropdown)] p-[var(--distanceAll)]"
                  align="end"
                >
                  <DropdownMenuLabel>Khoá học của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/student/my-course">Xem tất cả</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : user?.role === "TEACHER" || user?.role === "ADMIN" ? (
          <Button>
            <Link href={`/user-class`}>Về trang điều khiển</Link>
          </Button>
        ) : null}

        {/* Auth */}
        {!user ? (
          <>
            <Button asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Đăng ký</Link>
            </Button>
          </>
        ) : (
          <div className="hidden md:block">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.avatar_url || ""} />
                  <AvatarFallback>
                    {user?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="mt-[var(--distanceDropdown)] p-[var(--distanceAll)]"
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
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {user?.role === "STUDENT" && (
                  <DropdownMenuItem asChild>
                    <Link href="/student/my-course">Khoá học của tôi</Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                  <Link href={`/setting`}>Sửa thông tin cá nhân</Link>
                </DropdownMenuItem>

                {/* <DropdownMenuItem asChild>
                  <Link href="/student/transaction-history">
                    Lịch sử giao dịch
                  </Link>
                </DropdownMenuItem> */}

                <DropdownMenuItem asChild>
                  <Link href="/setting">Cài đặt</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout}>
                  Đăng xuất
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
