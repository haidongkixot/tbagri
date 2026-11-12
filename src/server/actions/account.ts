"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { adminUsers, getDb } from "@/db";
import { changePasswordSchema, firstErrors } from "@/lib/admin-user-schema";
import { audit } from "@/server/audit";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { requireAdmin } from "@/server/auth/session";
import { rateLimit } from "@/server/rate-limit";

export type ChangePasswordState =
  { status: "idle" } | { status: "error"; errors: Record<string, string> } | { status: "done" };

/**
 * Người đang đăng nhập tự đổi mật khẩu. Cũng là bước bắt buộc khi đang dùng mật khẩu tạm:
 * đổi xong thì gỡ cờ `mustChangePassword` và đưa về trang tổng quan.
 */
export async function changeOwnPassword(
  _prev: ChangePasswordState,
  fd: FormData,
): Promise<ChangePasswordState> {
  const session = await requireAdmin({ allowPasswordChange: true });
  const parsed = changePasswordSchema.safeParse({
    current: fd.get("current") ?? "",
    next: fd.get("next") ?? "",
    confirm: fd.get("confirm") ?? "",
  });
  if (!parsed.success) return { status: "error", errors: firstErrors(parsed.error) };

  let wasForced = false;
  try {
    // Chặn dò mật khẩu hiện tại qua form này (giống giới hạn đăng nhập)
    const limit = await rateLimit(`pwchange:${session.userId}`, 10, 15 * 60 * 1000);
    if (!limit.ok) {
      return {
        status: "error",
        errors: { form: "Thử sai quá nhiều lần. Vui lòng thử lại sau 15 phút." },
      };
    }
    const db = await getDb();
    const [user] = await db
      .select({ hash: adminUsers.passwordHash, forced: adminUsers.mustChangePassword })
      .from(adminUsers)
      .where(eq(adminUsers.id, session.userId));
    if (!user || !(await verifyPassword(parsed.data.current, user.hash))) {
      return { status: "error", errors: { current: "Mật khẩu hiện tại không đúng." } };
    }
    wasForced = user.forced;
    await db
      .update(adminUsers)
      .set({ passwordHash: await hashPassword(parsed.data.next), mustChangePassword: false })
      .where(eq(adminUsers.id, session.userId));
    await audit(session.email, "password_change");
  } catch (err) {
    console.error("[account] Đổi mật khẩu lỗi:", err);
    return {
      status: "error",
      errors: { form: "Không đổi được do lỗi hệ thống. Vui lòng thử lại." },
    };
  }
  // redirect() ném lỗi đặc biệt → đặt ngoài try/catch
  if (wasForced) redirect("/admin");
  return { status: "done" };
}
