---
paths:
  - "src/server/**"
  - "src/db/**"
  - "src/app/admin/**"
  - "src/app/api/**"
  - "src/proxy.ts"
---
# Quy tắc back-end TBAgri

- Tệp trong `src/server` và `src/db/index.ts` bắt đầu bằng `import "server-only";`.
  Ngoại lệ: `src/db/schema.ts`, `src/db/client.ts` dùng chung với script CLI (`scripts/*.ts`)
  nên không import `server-only` (gói này báo lỗi khi chạy ngoài Next.js).
- Mọi Server Action: (1) kiểm tra quyền bằng `requireAdmin()` nếu là thao tác quản trị,
  (2) kiểm tra dữ liệu bằng Zod, (3) ghi dữ liệu, (4) gọi `updateTag(CONTENT_TAG)` nếu đổi nội dung,
  (5) trả về kết quả có kiểu rõ ràng `{ ok: true } | { ok: false; errors }`.
- Không trả lỗi kỹ thuật (stack trace, câu SQL) ra trình duyệt; ghi `console.error` ở server.
- Proxy chỉ kiểm tra nhanh cookie; quyền thật luôn kiểm tra lại trong action và trang quản trị.
- Thay đổi schema: dùng skill `db-change` (sửa schema → generate → xem SQL → migrate → seed).
- Không xóa dữ liệu thật; dùng cờ `published` hoặc trạng thái thay vì DELETE khi có thể.
