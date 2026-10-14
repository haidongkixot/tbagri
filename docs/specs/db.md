# Cơ sở dữ liệu và nội dung động (lab 11)

## Mục tiêu
Nội dung trang đọc từ CSDL (để lab 14 cho quản trị sửa), vẫn hiển thị được khi CSDL trống/lỗi.

## Công nghệ
- Drizzle ORM (`drizzle-orm`, `drizzle-kit`), PostgreSQL.
- Máy cá nhân: **PGlite** — Postgres chạy trong Node, dữ liệu ở `.data/pglite` (đã `.gitignore`).
  Next.js cần `serverExternalPackages: ["@electric-sql/pglite"]` để nạp tệp `.wasm`.
- Production: **Neon** qua `@neondatabase/serverless` (HTTP), chọn khi `DATABASE_URL=postgres://…`.

## Tệp
| Tệp | Vai trò |
|---|---|
| `src/db/schema.ts` | 5 bảng: content_entries, leads, admin_users, rate_limits, audit_log |
| `src/db/client.ts` | `createDb()` chọn PGlite/Neon — dùng chung cho app và script |
| `src/db/index.ts` | `getDb()` cho app (`server-only`), giữ 1 kết nối, PGlite tự migrate |
| `drizzle/0000_init.sql` | Migration sinh bởi `npm run db:generate` |
| `scripts/db-migrate.ts` | `npm run db:migrate` |
| `scripts/db-seed.ts` | `npm run db:seed` (chỉ thêm khóa còn thiếu) · `-- --force` ghi đè |
| `src/content/merge.ts` | Ghép CSDL lên nội dung mặc định (hàm thuần, có test ở lab 15) |
| `src/server/content.ts` | `getSiteContent()` — `"use cache"` + `cacheTag("site-content")` |

## Luồng đọc nội dung
1. Trang gọi `getLocalizedContent(locale)` → `getSiteContent()` (được cache, `cacheLife("max")`).
2. Đọc mọi dòng `content_entries` → `mergeWithDefaults(rows, defaultContent)`.
3. CSDL lỗi → log lỗi, trả `defaultContent` (trang không sập).
4. Quản trị lưu (lab 14) → `updateTag("site-content")` → lần tải sau đọc lại CSDL.

## Lưu ý vận hành
- PGlite chỉ cho **một** tiến trình mở thư mục dữ liệu: tắt `npm run dev` trước khi chạy
  `db:migrate`, `db:seed`, `build` hay `db:studio`.
- Vercel: lệnh build là `vercel-build` = `npm run db:migrate && next build` (migrate Neon trước).
- Production bắt buộc có `DATABASE_URL`; thiếu thì trang vẫn chạy bằng nội dung mặc định nhưng
  form liên hệ và quản trị không hoạt động.

## Tiêu chí đạt
- [ ] `rm -rf .data && npm run db:migrate && npm run db:seed` chạy sạch, seed lần 2 không ghi đè
- [ ] Sửa tay `hero.title.es` trong CSDL → khởi động lại dev → trang hiện chữ mới
- [ ] Đổi `DATABASE_URL` sai → trang vẫn hiện nội dung mặc định, log có cảnh báo
- [ ] `npm run build` thành công
