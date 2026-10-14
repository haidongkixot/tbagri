import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

/** IP người gửi (Vercel/proxy đặt trong x-forwarded-for; dòng đầu là IP thật). */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/** Băm IP kèm muối — đủ để giới hạn tần suất mà không lưu IP thật (bảo vệ dữ liệu cá nhân). */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "tbagri-dev-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
