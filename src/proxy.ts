import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/content/types";

/**
 * Proxy (Next.js 16, trước đây gọi là middleware):
 * 1. /admin/* (trừ /admin/login): chưa có cookie phiên → chuyển tới trang đăng nhập.
 *    Đây chỉ là chặn sớm cho nhanh; quyền thật luôn được kiểm tra lại bằng requireAdmin().
 * 2. Đường dẫn chưa có ngôn ngữ (/, /tiendas…) → chuyển sang /es/… hoặc /en/…
 *    theo ngôn ngữ trình duyệt.
 */
const SESSION_COOKIE = "tbagri_session";

function preferredLocale(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";
  const first = header.split(",")[0]?.trim().slice(0, 2).toLowerCase() ?? "";
  return isLocale(first) ? first : defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const isLogin = pathname === "/admin/login";
    if (!isLogin && !request.cookies.has(SESSION_COOKIE)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const segment = pathname.split("/")[1] ?? "";
  if (isLocale(segment)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Bỏ qua tài nguyên tĩnh, API và các tệp có phần mở rộng.
  matcher: [
    "/((?!_next|api|images|uploads|favicon.ico|icon|apple-icon|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
