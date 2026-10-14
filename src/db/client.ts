/**
 * Tạo kết nối Drizzle theo môi trường — dùng chung cho app (src/db/index.ts) và script CLI.
 * - Có DATABASE_URL (postgres://…) → Neon serverless qua HTTP (production, Vercel).
 * - Không có → PGlite lưu ở thư mục PGLITE_DIR (mặc định .data/pglite) cho máy cá nhân.
 */
import { mkdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type Database = ReturnType<typeof drizzlePglite<typeof schema>>;
export type DbKind = "neon" | "pglite";

export function databaseKind(): DbKind {
  return process.env.DATABASE_URL?.startsWith("postgres") ? "neon" : "pglite";
}

export function createDb(): { db: Database; kind: DbKind; close: () => Promise<void> } {
  if (databaseKind() === "neon") {
    const sql = neon(process.env.DATABASE_URL!);
    // Hai driver có cùng API truy vấn; ép kiểu về một kiểu chung cho gọn.
    const db = drizzleNeon(sql, { schema }) as unknown as Database;
    return { db, kind: "neon", close: async () => {} };
  }
  const dir = process.env.PGLITE_DIR ?? ".data/pglite";
  mkdirSync(dir, { recursive: true }); // PGlite không tự tạo thư mục cha
  const client = new PGlite(dir);
  const db = drizzlePglite(client, { schema });
  return { db, kind: "pglite", close: () => client.close() };
}
