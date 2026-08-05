import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Giả sử token + role được lưu trong cookie "auth"
export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const role = req.cookies.get("role")?.value;

  const { pathname } = req.nextUrl;

  // Nếu chưa login → redirect về /login
  if (!token && pathname.startsWith("/")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Nếu vào admin dashboard nhưng role != ADMIN
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Nếu vào teacher dashboard nhưng role != TEACHER
  if (pathname.startsWith("/teacher") && role !== "TEACHER") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Nếu vào student dashboard nhưng role != STUDENT
  if (pathname.startsWith("/student") && role !== "STUDENT") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Định nghĩa paths middleware chạy
export const config = {
  matcher: ["/:path*"],
};
