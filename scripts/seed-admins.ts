/**
 * Tạo sẵn 3 tài khoản admin trên CSDL đang cấu hình (production: chạy trong bootstrap khi build).
 * - Chỉ lưu BẢN BĂM scrypt của mật khẩu tạm; mật khẩu đã gửi riêng cho chủ dự án (2026-11-12).
 * - `mustChangePassword = true`: lần đăng nhập đầu bắt buộc đặt mật khẩu riêng, nên bản băm ở đây
 *   hết giá trị ngay sau đó.
 * - ON CONFLICT DO NOTHING: tài khoản đã có (kể cả đã đổi mật khẩu, đã bị tắt) giữ nguyên —
 *   deploy lại không bao giờ ghi đè.
 * Muốn thêm/đặt lại tài khoản: dùng trang /admin/users (không sửa tệp này).
 */
import { createDb } from "../src/db/client";
import { adminUsers } from "../src/db/schema";

const SEED_ADMINS = [
  {
    email: "admin1@tbagri.cu",
    name: "Quản trị 1",
    passwordHash:
      "scrypt$b10d7ff5bd0733b8d0d4ba88501e4c56$71f77535e20be3d50c2678c80976c355214ef35754f4ad1704dd4829f18912c8ab3acbff4befb12b06a292ff5ad8e9745e95be0211316d38cf0be67554cdca2b",
  },
  {
    email: "admin2@tbagri.cu",
    name: "Quản trị 2",
    passwordHash:
      "scrypt$fa95be5e88f08e4e71f8d0f5dd0a96ba$100919976345779abd3c229e6219622458d033e622c86dfe9ac3d8b2dc63ef356c4ce16a9e08461a49e0081df694987a1c9a4f5d475ea9a2f7505784ad13b43f",
  },
  {
    email: "admin3@tbagri.cu",
    name: "Quản trị 3",
    passwordHash:
      "scrypt$f0a876cfb756c04a65994eaf1f5b4517$52dd43759475accc67f50778fad7e460aef55152c2e40ca1c53601029e4ae90b27f374898515eef2afeeb19e06f42f1ff37a1cca676d36f275c24ff16cb77250",
  },
];

async function main() {
  const { db, kind, close } = createDb();
  const created = await db
    .insert(adminUsers)
    .values(SEED_ADMINS.map((a) => ({ ...a, role: "admin" as const, mustChangePassword: true })))
    .onConflictDoNothing({ target: adminUsers.email })
    .returning({ email: adminUsers.email });
  console.log(
    `✓ Tài khoản admin có sẵn: tạo mới ${created.length}/${SEED_ADMINS.length} (${kind})` +
      (created.length ? ` — ${created.map((c) => c.email).join(", ")}` : ""),
  );
  await close();
}

main().catch((err) => {
  console.error("✗ Tạo tài khoản admin có sẵn lỗi:", err);
  process.exit(1);
});
