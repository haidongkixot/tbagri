/**
 * Băm mật khẩu bằng scrypt (có sẵn trong Node, không cần thư viện ngoài).
 * Định dạng lưu: "scrypt$<salt hex>$<hash hex>". Không import "server-only" vì script tạo tài khoản
 * (scripts/create-admin.ts) cũng dùng tệp này.
 */
import { randomBytes, randomInt, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
const KEY_LEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEY_LEN);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, saltHex, hashHex] = stored.split("$");
  if (algo !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  // So sánh thời gian hằng — không lộ thông tin qua thời gian phản hồi
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Mật khẩu đủ mạnh: ≥ 12 ký tự, có chữ và số. */
export function isStrongPassword(pw: string): boolean {
  return pw.length >= 12 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
}

/**
 * Mật khẩu tạm ngẫu nhiên (tài khoản mới / đặt lại): 20 ký tự, bỏ ký tự dễ nhầm (0 O 1 l I)
 * để đọc qua điện thoại không sai; luôn đạt `isStrongPassword`.
 */
export function generatePassword(length = 20): string {
  const letters = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
  const all = letters + "23456789";
  for (;;) {
    const pw = Array.from({ length }, () => all[randomInt(all.length)]).join("");
    if (isStrongPassword(pw)) return pw;
  }
}
