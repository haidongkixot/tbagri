import { describe, expect, it } from "vitest";
import { changePasswordSchema, createUserSchema, firstErrors } from "@/lib/admin-user-schema";

describe("tạo tài khoản quản trị", () => {
  it("chuẩn hóa email về chữ thường, bỏ khoảng trắng", () => {
    const r = createUserSchema.parse({ email: "  An@TBagri.CU ", name: " An ", role: "editor" });
    expect(r).toEqual({ email: "an@tbagri.cu", name: "An", role: "editor" });
  });
  it("email sai, tên trống, vai trò lạ → lỗi đúng ô", () => {
    const r = createUserSchema.safeParse({ email: "abc", name: " ", role: "root" });
    expect(r.success).toBe(false);
    const errors = firstErrors(r.error!);
    expect(Object.keys(errors).sort()).toEqual(["email", "name", "role"]);
  });
});

describe("đổi mật khẩu", () => {
  const ok = { current: "MatKhauCu2026", next: "MatKhauMoi2026", confirm: "MatKhauMoi2026" };
  it("hợp lệ", () => {
    expect(changePasswordSchema.safeParse(ok).success).toBe(true);
  });
  it("mật khẩu mới yếu → lỗi ở ô next", () => {
    const r = changePasswordSchema.safeParse({ ...ok, next: "ngan1", confirm: "ngan1" });
    expect(firstErrors(r.error!).next).toMatch(/12 ký tự/);
  });
  it("nhập lại không khớp → lỗi ở ô confirm", () => {
    const r = changePasswordSchema.safeParse({ ...ok, confirm: "KhacHan2026xx" });
    expect(firstErrors(r.error!).confirm).toMatch(/chưa khớp/);
  });
  it("mật khẩu mới trùng mật khẩu cũ → lỗi", () => {
    const r = changePasswordSchema.safeParse({ ...ok, next: ok.current, confirm: ok.current });
    expect(firstErrors(r.error!).next).toMatch(/khác mật khẩu hiện tại/);
  });
});
