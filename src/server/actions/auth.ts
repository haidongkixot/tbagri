"use server";

import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { adminUsers, getDb } from "@/db";
import { audit } from "@/server/audit";
import { verifyPassword } from "@/server/auth/password";
import { createSession, destroySession, readSession } from "@/server/auth/session";
import { rateLimit } from "@/server/rate-limit";
import { clientIp, hashIp } from "@/server/request-info";

export type LoginState = { error?: "invalid" | "rateLimited" | "generic"; email?: string };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(160),
  password: z.string().min(1).max(200),
});

/** Đăng nhập quản trị: giới hạn 10 lần/15 phút cho mỗi IP, thông báo lỗi chung chung. */
export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const email = String(formData.get("email") ?? "");
  if (!parsed.success) return { error: "invalid", email };

  try {
    const limit = await rateLimit(`login:${hashIp(await clientIp())}`, 10, 15 * 60 * 1000);
    if (!limit.ok) return { error: "rateLimited", email };

    const db = await getDb();
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, parsed.data.email));
    // Luôn chạy verify (kể cả khi không có user) để thời gian phản hồi như nhau
    const ok = await verifyPassword(parsed.data.password, user?.passwordHash ?? "scrypt$00$00");
    if (!user || !user.active || !ok) {
      await audit(parsed.data.email, "login_failed");
      return { error: "invalid", email };
    }

    await db
      .update(adminUsers)
      .set({ lastLoginAt: sql`now()` })
      .where(eq(adminUsers.id, user.id));
    await createSession({ userId: user.id, email: user.email, name: user.name, role: user.role });
    await audit(user.email, "login");
  } catch (err) {
    console.error("[auth] Đăng nhập lỗi:", err);
    return { error: "generic", email };
  }
  // redirect() ném lỗi đặc biệt → đặt ngoài try/catch
  redirect("/admin");
}

export async function logout() {
  const s = await readSession();
  await destroySession();
  if (s) await audit(s.email, "logout");
  redirect("/admin/login");
}
