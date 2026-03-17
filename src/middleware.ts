import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  // ถ้ายังไม่ login แล้วพยายามเข้า dashboard
  if (!isLoggedIn && pathname.startsWith("/student")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!isLoggedIn && pathname.startsWith("/teacher")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ถ้า login แล้วแต่เข้าผิด role
  if (isLoggedIn && pathname.startsWith("/teacher") && role !== "TEACHER") {
    return NextResponse.redirect(new URL("/student", req.url));
  }

  if (isLoggedIn && pathname.startsWith("/student") && role !== "STUDENT") {
    return NextResponse.redirect(new URL("/teacher", req.url));
  }

  // ถ้า login แล้วพยายามเข้าหน้า login/register อีก
  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    if (role === "TEACHER") {
      return NextResponse.redirect(new URL("/teacher", req.url));
    }
    return NextResponse.redirect(new URL("/student", req.url));
  }

  return NextResponse.next();
});

// บอกว่า middleware นี้ทำงานกับ path ไหนบ้าง
export const config = {
  matcher: ["/student/:path*", "/teacher/:path*", "/login", "/register"],
};
