/**
 * Lược đồ CSDL TBAgri (Drizzle ORM, PostgreSQL).
 * Máy cá nhân: PGlite (Postgres chạy trong Node, lưu ở .data/pglite). Production: Neon.
 * Đổi lược đồ → làm theo skill `db-change`: sửa tệp này → `npm run db:generate` → đọc SQL
 * trong drizzle/ → `npm run db:migrate`.
 */
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/** Mỗi khóa cấp 1 của SiteContent (hero, intro, productSlides…) là một dòng; `data` là JSON. */
export const contentEntries = pgTable("content_entries", {
  key: text("key").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedBy: text("updated_by"),
});

export const LEAD_STATUSES = ["nuevo", "contactado", "cerrado"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Khách hàng tiềm năng gửi từ form liên hệ (s12). */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    organization: text("organization"),
    segment: text("segment").notNull(),
    interest: text("interest"),
    message: text("message").notNull(),
    locale: text("locale").notNull().default("es"),
    status: text("status").$type<LeadStatus>().notNull().default("nuevo"),
    /** IP đã băm (SHA-256 + muối) — đủ để chống spam, không lưu IP thật */
    ipHash: text("ip_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("leads_created_at_idx").on(t.createdAt), index("leads_status_idx").on(t.status)],
);

export const ADMIN_ROLES = ["admin", "editor"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  /** scrypt: "scrypt$<salt hex>$<hash hex>" */
  passwordHash: text("password_hash").notNull(),
  role: text("role").$type<AdminRole>().notNull().default("editor"),
  active: boolean("active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Bộ đếm giới hạn tần suất (form liên hệ, đăng nhập). `key` ví dụ "lead:<ipHash>". */
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
});

/** Nhật ký thao tác quản trị: ai làm gì, lúc nào. */
export const auditLog = pgTable(
  "audit_log",
  {
    id: serial("id").primaryKey(),
    actor: text("actor").notNull(),
    action: text("action").notNull(),
    target: text("target"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("audit_log_created_at_idx").on(t.createdAt)],
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
