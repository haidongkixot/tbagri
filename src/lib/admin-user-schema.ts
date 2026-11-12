import { z } from "zod";
import { ADMIN_ROLES } from "@/db/schema";

/**
 * Lược đồ Zod cho quản lý tài khoản quản trị. Giao diện quản trị chỉ có tiếng Việt nên thông báo
 * lỗi viết thẳng bằng câu chữ (khác form công khai dùng mã lỗi để dịch).
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const userIdSchema = z.coerce.number().int().positive();

export const createUserSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { error: "Nhập email." })
    .max(160, { error: "Email quá dài." })
    .regex(EMAIL_RE, { error: "Email không hợp lệ." }),
  name: z
    .string()
    .trim()
    .min(1, { error: "Nhập tên hiển thị." })
    .max(80, { error: "Tên quá dài (tối đa 80 ký tự)." }),
  role: z.enum(ADMIN_ROLES, { error: "Chọn vai trò." }),
});

export const changePasswordSchema = z
  .object({
    current: z.string().min(1, { error: "Nhập mật khẩu hiện tại." }).max(200),
    next: z
      .string()
      .max(200, { error: "Mật khẩu quá dài." })
      .refine((v) => v.length >= 12 && /[A-Za-z]/.test(v) && /\d/.test(v), {
        error: "Mật khẩu mới phải từ 12 ký tự, có cả chữ và số.",
      }),
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, { path: ["confirm"], error: "Nhập lại chưa khớp." })
  .refine((v) => v.next !== v.current, {
    path: ["next"],
    error: "Mật khẩu mới phải khác mật khẩu hiện tại.",
  });

/** Lỗi đầu tiên của mỗi ô (để hiện dưới ô đó). */
export function firstErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
