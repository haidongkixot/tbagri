---
name: release-check
description: Danh sách kiểm tra trước khi đưa website TBAgri lên production — kỹ thuật, nội dung, bảo mật, hiệu năng, SEO và biến môi trường. Gọi bằng /release-check.
disable-model-invocation: true
---

# Kiểm tra trước khi phát hành

Chạy và ghi kết quả từng mục (✓ / ✗ kèm lý do). Không tự sửa lỗi lớn — liệt kê rồi hỏi.

## Kỹ thuật
- [ ] `npm run typecheck` · `npm run lint` · `npm run format:check` sạch
- [ ] `npm test` (Vitest) qua hết
- [ ] `npm run test:e2e` qua hết (tự build + start với CSDL PGlite riêng `.data/e2e`)
- [ ] `npm run build` thành công, `/es` `/en` `/es/tiendas` `/en/tiendas` là trang tĩnh (○)

## Nội dung
- [ ] `grep -rn "// MẪU" src/content/defaults.ts` — liệt kê mục chưa được TBAgri duyệt; hỏi người dùng
- [ ] Nội dung trong CSDL production (nếu có) không còn chữ "MẪU", "Lorem", "TODO"
- [ ] es và en đầy đủ (test `cms-schema` đảm bảo es không trống ở mặc định)
- [ ] Ảnh tạm cắt từ PDF đã được thay ảnh gốc (nếu đã có)

## Bảo mật
- [ ] `SESSION_SECRET` ≥ 32 ký tự ngẫu nhiên, khác dev; `IP_HASH_SALT` đã đặt
- [ ] Tài khoản quản trị tạo bằng `npm run admin:create`, mật khẩu mạnh; `ADMIN_PASSWORD` đã xóa khỏi .env
- [ ] `git log -p --all -S "SESSION_SECRET=" -- ':!.env.example'` không ra bí mật; `.env.local` không bị commit
- [ ] Form liên hệ: bẫy bot + giới hạn 5/giờ/IP; đăng nhập giới hạn 10/15 phút (đã có test)
- [ ] `/admin` trả 307 → `/admin/login` khi không có cookie (`curl -I`)

## Hiệu năng & SEO
- [ ] Lighthouse mobile trên bản deploy preview: Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95
- [ ] `/sitemap.xml`, `/robots.txt` dùng đúng `NEXT_PUBLIC_SITE_URL` production
- [ ] Thẻ hreflang es/en, ảnh OG hiển thị đúng (dán link vào trình xem trước)

## Biến môi trường trên Vercel (Production)
- [ ] Bắt buộc: `DATABASE_URL` (Neon), `SESSION_SECRET`, `IP_HASH_SALT`, `NEXT_PUBLIC_SITE_URL`,
      `BLOB_READ_WRITE_TOKEN`
- [ ] Tùy chọn: `RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_FROM`
- [ ] Build Command = `npm run vercel-build` (migrate Neon rồi build)

Kết thúc bằng bảng tóm tắt và danh sách việc phải làm trước khi bấm Promote.
