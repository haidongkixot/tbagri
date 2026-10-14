# Nhật ký tiến độ

Mỗi lab xong thêm một dòng: lab · ngày · việc đã làm · cách kiểm chứng.

| Lab | Việc đã làm | Kiểm chứng |
|---|---|---|
| 01 | Khung Next.js 16, token Tailwind, font tự host, định tuyến es/en, CLAUDE.md, rules, skills, subagents, hooks, PRD | typecheck ✓ · lint ✓ · `/` chuyển sang `/es` |
| 02 | Header (logo, menu, cờ đổi ngôn ngữ, menu mobile), Hero, nút liên hệ nổi | compare s01, s02 ✓ · typecheck ✓ · lint ✓ |
| 03 | Section giới thiệu: thẻ đè hero, 3 thẻ đối tượng, khối "Un solo socio" | compare s03 ✓ |
| 04 | Vòng 12 bước canh tác dựng bằng SVG theo dữ liệu + lưới bước cho mobile | compare s04 ✓ |
| 05 | Filosofía (carousel dùng chung, đoạn văn `text-wrap: balance`), Modelo de servicio (6 icon + băng rôn) | compare s05 (lệch 1px), s06 ✓ · 390px không tràn ngang |
| 06 | Grupo de productos (s07) + Semillas e insumos (s08): Stepper hạt lúa (Tabs WAI-ARIA), SlideImage, ảnh `fit` cover/contain | compare s07, s08 (lệch 1px) · thử click + phím ← → Home End · 390px ✓ |
| 07 | Mecanización (s09): carousel thẻ máy, biến thể mũi tên `chevron`, bông lúa trang trí, sửa lỗi chính tả trong thiết kế | compare s09 (lệch 1px) · thử mũi tên đầu/cuối · 390px ✓ |
| 08 | Poscosecha (s10): dây chuyền 8 bước chữ U ngược với mũi tên nét đứt, tab dọc `StepperList`, ảnh cánh đồng vá lại, chuẩn hóa icon; compare ẩn header dính | compare s10 (lệch 1px; hàng chữ ≤ 3px) · thử tab + phím ↑↓ · 390px ✓ |
| 09 | Digital (s11), Beneficio y contacto (s12: Accordion + ContactForm + action tạm), Invitación (s13), SkyBackdrop dùng chung; token `danger` | compare s11 (lệch 1px), s12, s13 (lệch 1px) · thử form lỗi/thành công, điền sẵn interés · 390px ✓ |
| 10 | Footer (s14), trang Nuestras tiendas, 404 song ngữ (global-not-found), sitemap, robots, JSON-LD; compare chờ ảnh lazy | compare s14 (lệch 1px) · `npm run build` ✓ (es/en tĩnh) · không tràn ngang 360→1920px — **Mốc 1: demo giao diện đủ trang** |
| 11 | CSDL Drizzle (PGlite máy cá nhân / Neon production), 5 bảng, migrate + seed, nội dung đọc từ CSDL có dự phòng mặc định | migrate/seed sạch · sửa hero trong CSDL → trang đổi · build ✓ |
| 12 | Form liên hệ hoàn chỉnh: Zod dùng chung, bẫy bot, giới hạn 5 lần/giờ/IP (IP băm), lưu `leads`, email Resend qua `after()` | thử: email sai → lỗi đúng ô · 5 lần thành công · lần 6 bị chặn |
| 13 | Đăng nhập quản trị (scrypt + JWT cookie + giới hạn), tổng quan, bảng leads (lọc, tìm, phân trang, đổi trạng thái), xuất CSV, nhật ký; Suspense trong trang | thử chưa đăng nhập → bị chặn · sai/đúng mật khẩu · đổi trạng thái · CSV · đăng xuất · build ✓ |
| 14 | CMS: cấu hình 27 khối sinh form + Zod, trình sửa (es/en, danh sách ↑↓✕, tải ảnh Blob/local, khôi phục), updateTag cập nhật ngay | thử sửa hero → trang đổi ngay · lỗi ô · tải tệp giả bị chặn · khôi phục ✓ |
| 15 | Vitest (31 test hàm thuần), Playwright (18 test E2E trên build production, CSDL riêng), CI GitHub Actions, README deploy, release-check cập nhật — **Mốc 2: demo cuối** | `npm test` ✓ · `npm run test:e2e` ✓ · build ✓ |
