import "server-only";
import { and, asc, count, eq, ne } from "drizzle-orm";
import { adminUsers, getDb } from "@/db";

/** Danh sách tài khoản quản trị (không bao giờ trả kèm bản băm mật khẩu). */
export async function listAdminUsers() {
  const db = await getDb();
  return db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      role: adminUsers.role,
      active: adminUsers.active,
      mustChangePassword: adminUsers.mustChangePassword,
      lastLoginAt: adminUsers.lastLoginAt,
      createdAt: adminUsers.createdAt,
    })
    .from(adminUsers)
    .orderBy(asc(adminUsers.createdAt), asc(adminUsers.id));
}

export type AdminUserRow = Awaited<ReturnType<typeof listAdminUsers>>[number];

/** Số admin đang hoạt động, không tính tài khoản `exceptId` (để chặn mất admin cuối cùng). */
export async function countOtherActiveAdmins(exceptId: number) {
  const db = await getDb();
  const [row] = await db
    .select({ n: count() })
    .from(adminUsers)
    .where(
      and(eq(adminUsers.role, "admin"), eq(adminUsers.active, true), ne(adminUsers.id, exceptId)),
    );
  return row?.n ?? 0;
}
