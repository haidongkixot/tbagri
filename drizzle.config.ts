import { defineConfig } from "drizzle-kit";

/**
 * - `npm run db:generate`: sinh migration SQL từ src/db/schema.ts vào drizzle/.
 * - `npm run db:studio`: mở Drizzle Studio xem dữ liệu (PGlite hoặc Neon tùy DATABASE_URL).
 * Chạy migration do scripts/db-migrate.ts đảm nhiệm (hỗ trợ cả PGlite và Neon).
 */
const url = process.env.DATABASE_URL;

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  ...(url?.startsWith("postgres")
    ? { dbCredentials: { url } }
    : { driver: "pglite", dbCredentials: { url: process.env.PGLITE_DIR ?? ".data/pglite" } }),
});
