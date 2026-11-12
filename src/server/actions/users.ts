"use server";

import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { z } from "zod";
import { ADMIN_ROLES, adminUsers, getDb, type AdminRole } from "@/db";
import { createUserSchema, firstErrors, userIdSchema } from "@/lib/admin-user-schema";
import { audit } from "@/server/audit";
import { generatePassword, hashPassword } from "@/server/auth/password";
import { requireAdmin, type Session } from "@/server/auth/session";
import { countOtherActiveAdmins } from "@/server/users";

/**
 * Quản lý tài khoản quản trị — chỉ vai trò admin.
 * Không có xóa tài khoản: dùng "Tắt" (giữ lịch sử, nhật ký vẫn đúng người).
 * Mật khẩu tạm chỉ trả về một lần trong kết quả action, không lưu dạng chữ ở đâu cả.
 */

export type CreateUserState =
  | { status: "idle" }
  | { status: "error"; errors: Record<string, string>; values: Record<string, string> }
  | { status: "created"; email: string; tempPassword: string };

export async function createUser(_prev: CreateUserState, fd: FormData): Promise<CreateUserState> {
  const session = await requireAdmin({ role: "admin" });
  const raw = {
    email: String(fd.get("email") ?? ""),
    name: String(fd.get("name") ?? ""),
    role: String(fd.get("role") ?? ""),
  };
  const parsed = createUserSchema.safeParse(raw);
  if (!parsed.success) return { status: "error", errors: firstErrors(parsed.error), values: raw };

  try {
    const db = await getDb();
    const tempPassword = generatePassword();
    const inserted = await db
      .insert(adminUsers)
      .values({
        ...parsed.data,
        passwordHash: await hashPassword(tempPassword),
        mustChangePassword: true,
      })
      .onConflictDoNothing({ target: adminUsers.email })
      .returning({ id: adminUsers.id });
    if (inserted.length === 0) {
      return { status: "error", errors: { email: "Email này đã có tài khoản." }, values: raw };
    }
    await audit(session.email, "user_create", parsed.data.email);
    refresh();
    return { status: "created", email: parsed.data.email, tempPassword };
  } catch (err) {
    console.error("[users] Tạo tài khoản lỗi:", err);
    return {
      status: "error",
      errors: { form: "Không tạo được do lỗi hệ thống. Vui lòng thử lại." },
      values: raw,
    };
  }
}

export type RowActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "done"; message: string; tempPassword?: string };

/** Đọc tài khoản đích; trả lỗi chữ nếu không tìm thấy. */
async function findTarget(fd: FormData) {
  const id = userIdSchema.safeParse(fd.get("id"));
  if (!id.success) return null;
  const db = await getDb();
  const [user] = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      role: adminUsers.role,
      active: adminUsers.active,
    })
    .from(adminUsers)
    .where(eq(adminUsers.id, id.data));
  return user ?? null;
}

/**
 * Chặn thay đổi làm mất quyền quản trị: tự hạ quyền/tự tắt chính mình, hoặc làm hệ thống
 * không còn admin nào đang hoạt động.
 */
async function guardAdminLoss(
  session: Session,
  target: { id: number; role: AdminRole; active: boolean },
  next: { role: AdminRole; active: boolean },
): Promise<string | null> {
  const losesAdmin =
    target.role === "admin" && target.active && (next.role !== "admin" || !next.active);
  if (!losesAdmin) return null;
  if (target.id === session.userId) {
    return "Không thể tự hạ quyền hoặc tự tắt tài khoản của chính mình.";
  }
  if ((await countOtherActiveAdmins(target.id)) === 0) {
    return "Phải còn ít nhất một admin đang hoạt động.";
  }
  return null;
}

const SYSTEM_ERROR: RowActionState = {
  status: "error",
  message: "Không lưu được do lỗi hệ thống. Vui lòng thử lại.",
};

/** Đổi vai trò admin ↔ biên tập. */
export async function setUserRole(_prev: RowActionState, fd: FormData): Promise<RowActionState> {
  const session = await requireAdmin({ role: "admin" });
  const role = z.enum(ADMIN_ROLES).safeParse(fd.get("role"));
  try {
    const target = await findTarget(fd);
    if (!target || !role.success) return { status: "error", message: "Dữ liệu không hợp lệ." };
    if (target.role === role.data) return { status: "idle" };
    const blocked = await guardAdminLoss(session, target, {
      role: role.data,
      active: target.active,
    });
    if (blocked) return { status: "error", message: blocked };
    const db = await getDb();
    await db.update(adminUsers).set({ role: role.data }).where(eq(adminUsers.id, target.id));
    await audit(session.email, `user_role:${role.data}`, target.email);
    refresh();
    return { status: "done", message: "Đã đổi vai trò." };
  } catch (err) {
    console.error("[users] Đổi vai trò lỗi:", err);
    return SYSTEM_ERROR;
  }
}

/** Bật/tắt tài khoản. Tài khoản bị tắt mất quyền ngay ở yêu cầu kế tiếp (requireAdmin đọc CSDL). */
export async function setUserActive(_prev: RowActionState, fd: FormData): Promise<RowActionState> {
  const session = await requireAdmin({ role: "admin" });
  const active = fd.get("active") === "true";
  try {
    const target = await findTarget(fd);
    if (!target) return { status: "error", message: "Dữ liệu không hợp lệ." };
    const blocked = await guardAdminLoss(session, target, { role: target.role, active });
    if (blocked) return { status: "error", message: blocked };
    const db = await getDb();
    await db.update(adminUsers).set({ active }).where(eq(adminUsers.id, target.id));
    await audit(session.email, active ? "user_enable" : "user_disable", target.email);
    refresh();
    return { status: "done", message: active ? "Đã bật tài khoản." : "Đã tắt tài khoản." };
  } catch (err) {
    console.error("[users] Bật/tắt tài khoản lỗi:", err);
    return SYSTEM_ERROR;
  }
}

/** Đặt lại mật khẩu: sinh mật khẩu tạm, bắt buộc đổi ở lần đăng nhập kế tiếp. */
export async function resetUserPassword(
  _prev: RowActionState,
  fd: FormData,
): Promise<RowActionState> {
  const session = await requireAdmin({ role: "admin" });
  try {
    const target = await findTarget(fd);
    if (!target) return { status: "error", message: "Dữ liệu không hợp lệ." };
    if (target.id === session.userId) {
      return { status: "error", message: "Đổi mật khẩu của chính mình ở trang “Đổi mật khẩu”." };
    }
    const tempPassword = generatePassword();
    const db = await getDb();
    await db
      .update(adminUsers)
      .set({ passwordHash: await hashPassword(tempPassword), mustChangePassword: true })
      .where(eq(adminUsers.id, target.id));
    await audit(session.email, "user_password_reset", target.email);
    refresh();
    return { status: "done", message: "Đã đặt lại mật khẩu.", tempPassword };
  } catch (err) {
    console.error("[users] Đặt lại mật khẩu lỗi:", err);
    return SYSTEM_ERROR;
  }
}
