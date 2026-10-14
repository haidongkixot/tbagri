# TBAgri — website giới thiệu

Landing 14 section (es/en) + form liên hệ + khu quản trị (leads, CMS). Dự án thực hành của
khóa **Claude Code Nâng cao** (Thai Binh Corp · Marcomdi).

## Chạy trên máy
```bash
npm install
cp .env.example .env.local        # điền SESSION_SECRET, IP_HASH_SALT (openssl rand -hex 32)
npm run db:migrate && npm run db:seed
ADMIN_EMAIL=ban@congty.vn ADMIN_PASSWORD='MatKhauManh2026' npm run admin:create
npm run dev                       # http://localhost:3000 — quản trị: /admin
```
Không cần cài PostgreSQL: khi `DATABASE_URL` trống, dữ liệu lưu bằng PGlite ở `.data/pglite`.
PGlite chỉ cho một tiến trình mở: tắt `npm run dev` trước khi chạy `db:*`, `admin:create`, `build`.

## Lệnh
| Lệnh | Việc |
|---|---|
| `npm run typecheck` · `lint` · `format` | Kiểm tra kiểu, lint, định dạng |
| `npm test` | Test đơn vị (Vitest): nội dung, lược đồ form/CMS, mật khẩu |
| `npm run test:e2e` | Playwright: build + chạy production với CSDL riêng `.data/e2e` |
| `npm run compare -- s07` | Chụp section so với ảnh thiết kế → `.compare/s07.png` |
| `npm run db:generate -- --name x` · `db:migrate` · `db:seed` · `db:studio` | Cơ sở dữ liệu |
| `npm run admin:create` | Tạo/đặt lại tài khoản quản trị |

## Deploy lên Vercel
1. Tạo project Vercel từ repo; **Build Command**: `npm run vercel-build`
   (chạy `scripts/bootstrap.ts`: migrate → seed → tạo admin nếu có biến, rồi build).
2. Storage → tạo **Neon Postgres** (biến `DATABASE_URL`) và **Blob** (biến `BLOB_READ_WRITE_TOKEN`).
3. Environment Variables (Production): `SESSION_SECRET`, `IP_HASH_SALT`, `NEXT_PUBLIC_SITE_URL`
   (https://tên-miền), tùy chọn `RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_FROM`.
4. Tài khoản quản trị đầu tiên: thêm `ADMIN_EMAIL`, `ADMIN_PASSWORD` (≥ 12 ký tự, có chữ và số)
   và `ADMIN_NAME`, deploy một lần — bước build sẽ tạo tài khoản. Sau đó **xóa `ADMIN_PASSWORD`**
   khỏi Environment Variables và đổi mật khẩu khi đăng nhập lần đầu.
   Cách khác, chạy từ máy mình: `DATABASE_URL='postgres://…' ADMIN_EMAIL=… ADMIN_PASSWORD='…' npm run admin:create`.
5. Chạy `/release-check` trong Claude Code, sửa các mục ✗, rồi Promote to Production.

## Tài liệu
- `CLAUDE.md` — quy ước làm việc với Claude Code (đọc trước khi sửa code).
- `docs/PRD.md` — yêu cầu sản phẩm (4Ds). `docs/specs/*.md` — spec từng section/tính năng.
- `docs/design/ref/*.jpg` — ảnh thiết kế gốc. `docs/progress.md` — nhật ký 15 lab.
- `.claude/skills/` — skills: `tbagri-design`, `build-section`, `compare-design`, `write-spec`,
  `mbrt-prompt`, `db-change`, `cms-field`, `release-check`.
