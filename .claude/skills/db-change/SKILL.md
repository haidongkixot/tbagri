---
name: db-change
description: Quy trình an toàn khi thay đổi cơ sở dữ liệu TBAgri — sửa schema Drizzle, sinh migration, xem SQL, chạy migrate, cập nhật seed và kiểm thử. Dùng mỗi khi thêm/sửa bảng hoặc cột.
---

# Thay đổi cơ sở dữ liệu

1. Mô tả thay đổi bằng một câu và lý do. Nếu xóa/đổi tên cột có dữ liệu → dừng, hỏi người dùng.
2. Sửa `src/db/schema.ts`. Giữ quy ước của tệp: đặt tên cột snake_case tường minh
   (`text("created_at")`), thời gian `timestamp(..., { withTimezone: true }).defaultNow()`,
   giá trị liệt kê là mảng `as const` + `.$type<...>()` (ví dụ `LEAD_STATUSES`).
3. `npm run db:generate -- --name <ten_ngan>` → mở tệp SQL mới trong `drizzle/` và đọc kỹ:
   không có `DROP` ngoài ý muốn; cột NOT NULL thêm vào bảng có dữ liệu phải có `DEFAULT`.
4. Tắt `npm run dev` (PGlite chỉ cho một tiến trình mở `.data/pglite`), rồi `npm run db:migrate`.
   Có `DATABASE_URL` (Neon) thì lệnh chạy trên Neon — hỏi người dùng trước khi chạy với production.
   (Khi chạy `npm run dev`, PGlite cũng tự migrate lần đầu kết nối.)
5. Nếu bảng liên quan nội dung: cập nhật `scripts/db-seed.ts`, `src/content/types.ts`, `defaults.ts`.
6. Chạy `npm run typecheck`, `npm run lint` và `npm test` (từ lab 15).
7. Báo lại: bảng/cột đã đổi, tên tệp migration, lệnh đã chạy, kết quả kiểm thử.

Không bao giờ sửa tay tệp migration đã chạy trên production; tạo migration mới để sửa.
Không chạy `db:seed -- --force` trên production (ghi đè nội dung quản trị đã sửa).
