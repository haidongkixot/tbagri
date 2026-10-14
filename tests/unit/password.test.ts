import { describe, expect, it } from "vitest";
import { hashPassword, isStrongPassword, verifyPassword } from "@/server/auth/password";

describe("mật khẩu scrypt", () => {
  it("băm rồi xác minh đúng; sai mật khẩu → false", async () => {
    const h = await hashPassword("Thaibinh2026demo");
    expect(h.startsWith("scrypt$")).toBe(true);
    expect(await verifyPassword("Thaibinh2026demo", h)).toBe(true);
    expect(await verifyPassword("Thaibinh2026dem0", h)).toBe(false);
  });
  it("hai lần băm cùng mật khẩu cho chuỗi khác nhau (muối ngẫu nhiên)", async () => {
    expect(await hashPassword("abc123abc123")).not.toBe(await hashPassword("abc123abc123"));
  });
  it("chuỗi lưu hỏng → false, không ném lỗi", async () => {
    expect(await verifyPassword("x", "garbage")).toBe(false);
  });
  it("isStrongPassword", () => {
    expect(isStrongPassword("short1")).toBe(false);
    expect(isStrongPassword("onlylettersxx")).toBe(false);
    expect(isStrongPassword("Thaibinh2026demo")).toBe(true);
  });
});
