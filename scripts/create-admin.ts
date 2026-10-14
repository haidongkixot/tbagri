/**
 * Tạo (hoặc đặt lại mật khẩu) tài khoản quản trị.
 *   ADMIN_EMAIL=marcom@tbagri.cu ADMIN_PASSWORD='...' ADMIN_NAME='Marcom' npm run admin:create
 * hoặc khai báo 3 biến trong .env.local. Mật khẩu ≥ 12 ký tự, có chữ và số.
 * PGlite: tắt `npm run dev` trước khi chạy.
 */
import { sql } from "drizzle-orm";
import { createDb } from "../src/db/client";
import { adminUsers } from "../src/db/schema";
import { hashPassword, isStrongPassword } from "../src/server/auth/password";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const name = process.env.ADMIN_NAME?.trim() || "Administrador";
  const role = process.env.ADMIN_ROLE === "editor" ? "editor" : "admin";
  if (!email) throw new Error("Thiếu ADMIN_EMAIL");
  if (!isStrongPassword(password)) throw new Error("ADMIN_PASSWORD phải ≥ 12 ký tự, có chữ và số");

  const { db, kind, close } = createDb();
  const passwordHash = await hashPassword(password);
  await db
    .insert(adminUsers)
    .values({ email, name, passwordHash, role })
    .onConflictDoUpdate({
      target: adminUsers.email,
      set: { passwordHash, name, role, active: true },
    });
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(adminUsers);
  console.log(`✓ Tài khoản ${email} (${role}) đã sẵn sàng — tổng ${n} tài khoản (${kind})`);
  await close();
}

main().catch((err) => {
  console.error("✗", err instanceof Error ? err.message : err);
  process.exit(1);
});
