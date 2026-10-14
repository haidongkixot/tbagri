import "server-only";
import { migrate } from "drizzle-orm/pglite/migrator";
import { createDb, type Database } from "./client";

/**
 * Kết nối dùng trong app (Server Component, Server Action, Route Handler).
 * Giữ một kết nối duy nhất cho cả tiến trình (globalThis để sống sót qua hot reload).
 * Với PGlite: tự chạy migration lần đầu kết nối, người học không phải nhớ lệnh migrate.
 */
type Holder = { db: Database; ready: Promise<void> };
const g = globalThis as unknown as { __tbagriDb?: Holder };

function init(): Holder {
  const { db, kind } = createDb();
  const ready =
    kind === "pglite"
      ? migrate(db, { migrationsFolder: "drizzle" }).catch((err) => {
          console.error("[db] migrate PGlite lỗi:", err);
          throw err;
        })
      : Promise.resolve();
  return { db, ready };
}

export async function getDb(): Promise<Database> {
  g.__tbagriDb ??= init();
  await g.__tbagriDb.ready;
  return g.__tbagriDb.db;
}

export * from "./schema";
