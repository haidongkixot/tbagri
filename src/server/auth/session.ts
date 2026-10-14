import "server-only";
import { eq } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminUsers, getDb, type AdminRole } from "@/db";

/**
 * Phiên đăng nhập quản trị: JWT ký HS256 bằng SESSION_SECRET, lưu trong cookie httpOnly.
 * - Cookie chỉ gửi kèm đường dẫn /admin, hết hạn sau 8 giờ.
 * - `requireAdmin()` kiểm tra chữ ký VÀ tài khoản còn hoạt động trong CSDL ở mỗi yêu cầu.
 */
export const SESSION_COOKIE = "tbagri_session";
const MAX_AGE = 60 * 60 * 8;

export type Session = { userId: number; email: string; name: string; role: AdminRole };

function secretKey() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Thiếu SESSION_SECRET (≥ 32 ký tự) trên production");
    }
    return new TextEncoder().encode("dev-only-secret-change-me-dev-only-secret");
  }
  return new TextEncoder().encode(s);
}

export async function createSession(s: Session) {
  const token = await new SignJWT({ email: s.email, name: s.name, role: s.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(s.userId))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/admin" });
}

/** Đọc phiên từ cookie (chỉ kiểm tra chữ ký + hạn). Không hợp lệ → null. */
export async function readSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return {
      userId: Number(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role === "admin" ? "admin" : "editor",
    };
  } catch {
    return null;
  }
}

/**
 * Bắt buộc đăng nhập. Dùng ở đầu MỌI trang/Server Action/Route Handler quản trị.
 * `role: "admin"` cho thao tác chỉ admin được làm (ví dụ quản lý tài khoản).
 */
export async function requireAdmin(opts: { role?: AdminRole } = {}): Promise<Session> {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const db = await getDb();
  const [user] = await db
    .select({ active: adminUsers.active, role: adminUsers.role })
    .from(adminUsers)
    .where(eq(adminUsers.id, session.userId));
  if (!user?.active) redirect("/admin/login");
  if (opts.role === "admin" && user.role !== "admin") redirect("/admin?error=forbidden");
  return { ...session, role: user.role };
}
