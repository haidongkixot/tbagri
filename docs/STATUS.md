# Trạng thái dự án TBAgri Web

> Cập nhật: 2026-11-01 · Commit: `1566506` (`main`) · Chạy thật: **https://tbagri.vercel.app**
> Tài liệu này để mở một phiên Claude Code mới ở máy khác mà không cần đọc lại lịch sử chat.
> Đọc cùng với `CLAUDE.md` (quy ước bắt buộc), `docs/PRD.md` (yêu cầu), `docs/progress.md` (nhật ký lab).

## 1. Dự án là gì

Trang giới thiệu TBAgri (Thai Binh Corporation tại Cuba): một landing 14 section theo đúng file
thiết kế, hai ngôn ngữ (es mặc định, en), form liên hệ lưu khách hàng tiềm năng, và khu quản trị
để sửa nội dung. Là dự án thực hành của khóa "Claude Code Nâng cao" — 15 lab đã xong, lab 16 là
các sửa đổi sau khi lên production.

Kho mã: `github.com/haidongkixot/tbagri` · nhánh chính `main`.

## 2. Đang chạy ở đâu

| | |
|---|---|
| Tên miền | `tbagri.vercel.app` (chưa gắn tên miền riêng) |
| Vercel project | `tbagri` · `prj_qIYeTMwa7adkhyIh5soFyl0ePZQR` |
| Vercel team | `haidongkixots-projects` · `team_wbKguqX6Wj8eVKG1K332eQFD` |
| Bản deploy hiện tại | `dpl_BQ6UeUzJKLt2SZiFgRWamAY1H54U` — commit `1566506`, READY |
| Framework Preset | **Next.js** (đã đặt đúng, xem mục 6) |
| Build Command | `npm run vercel-build` → `scripts/bootstrap.ts` (migrate → seed → tạo admin nếu có biến) rồi `next build` |
| CSDL | Neon Postgres qua biến `DATABASE_URL` |
| Ảnh tải lên | Vercel Blob qua `BLOB_READ_WRITE_TOKEN` |

Có một kho/project cũ tên `tbagri-web` (`prj_WERE9JFrKoUBDLER9nJ4rVmkmGIi`) **không còn dùng** —
deploy nhầm vào đó thì trang thật không đổi.

## 3. Trạng thái từng phần

| Phần | Trạng thái | Ghi chú |
|---|---|---|
| 14 section giao diện (s01–s14) | ✅ xong | Mỗi section có spec trong `docs/specs/` và ảnh gốc trong `docs/design/ref/` |
| Song ngữ es/en | ✅ xong | Nội dung mặc định dịch đủ 100%; nút đổi ngôn ngữ đã sửa (mục 6) |
| Trang Nuestras tiendas, 404 song ngữ, sitemap, robots, JSON-LD | ✅ xong | |
| Form liên hệ → bảng `leads` | ✅ xong | Zod, bẫy bot, giới hạn 5 lần/giờ/IP (IP băm) |
| Email thông báo lead (Resend) | ⚠️ tùy chọn | Chỉ chạy khi có `RESEND_API_KEY`; chưa đặt trên production |
| Đăng nhập quản trị | ⚠️ **chặn** | Thiếu `SESSION_SECRET` trên production — xem mục 5 |
| Bảng leads, xuất CSV, nhật ký | ✅ xong | Nằm sau đăng nhập |
| CMS sửa nội dung (27 khối) | ✅ xong | Nằm sau đăng nhập |
| Test | ✅ 31 unit (Vitest) + 20 e2e (Playwright) | CI GitHub Actions chạy đủ trên mỗi push `main` và PR |

## 4. Bắt đầu một phiên ở máy khác

```bash
git clone https://github.com/haidongkixot/tbagri.git
cd tbagri
npm install
cp .env.example .env.local      # rồi điền SESSION_SECRET, IP_HASH_SALT
npm run db:migrate && npm run db:seed
ADMIN_EMAIL=ban@congty.vn ADMIN_PASSWORD='MatKhauManh2026' npm run admin:create
npm run dev                     # http://localhost:3000 — quản trị: /admin
```

Không cần cài PostgreSQL: `DATABASE_URL` trống thì dữ liệu lưu bằng PGlite ở `.data/pglite`.

Lệnh hay dùng: `npm run typecheck` · `lint` · `format` · `test` · `test:e2e` ·
`npm run compare -- s04` (chụp section đặt cạnh ảnh thiết kế trong `.compare/`).

**Bẫy hay gặp**

- **PGlite chỉ cho một tiến trình mở.** Tắt `npm run dev` trước khi chạy `db:*`, `admin:create`,
  `build`, `test:e2e` — nếu không sẽ treo hoặc báo lỗi khóa tệp.
- **Sửa `@theme`/`@utility` trong `globals.css` mà giao diện không đổi** → tắt dev, xóa `.next`,
  chạy lại (bộ đệm CSS của Turbopack).
- **Tailwind v4 với biến CSS làm cỡ chữ** phải viết `text-[length:var(--x)]`; viết
  `text-[var(--x)]` thì Tailwind hiểu là **màu** và chữ sẽ đen.
- `npm run compare` cần dev server đang chạy; đặt `BASE_URL` nếu không dùng cổng 3000.

## 5. Việc còn mở

1. **`SESSION_SECRET` và `IP_HASH_SALT` trên Vercel** — việc duy nhất đang chặn tính năng.
   Thiếu `SESSION_SECRET` (≥ 32 ký tự) thì `src/server/auth/session.ts` ném lỗi và đăng nhập
   `/admin` báo "Không đăng nhập được do lỗi hệ thống".
   Cách làm: Vercel → project `tbagri` → Settings → Environment Variables → thêm cho
   Production (`openssl rand -hex 32` cho mỗi biến) → deploy lại.
   *Kết nối Vercel MCP hiện tại không có quyền đọc/ghi biến môi trường (403), nên trạng thái
   thật của hai biến này chưa kiểm chứng được từ phiên Claude Code — hãy thử đăng nhập
   `/admin` để biết.*
2. **Tài khoản quản trị đầu tiên.** Tạo bằng cách thêm tạm `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   (≥ 12 ký tự, có chữ và số), `ADMIN_NAME` vào Environment Variables rồi deploy một lần —
   `scripts/bootstrap.ts` sẽ tạo tài khoản. Sau đó **xóa `ADMIN_PASSWORD`** và đổi mật khẩu
   khi đăng nhập lần đầu.
3. **Nhánh `fix/ui-alignment-review`** (9 commit, chưa gộp) — việc của một agent khác, chỉ đổi
   CSS hover và căn viền vòng s04. Phần hover đã làm lại trong `main` nên nhánh này **xóa được**.
4. **Tên miền riêng** — chưa gắn, đang dùng `tbagri.vercel.app`.
5. **`RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_FROM`** — chưa đặt, nên lead chỉ lưu vào
   CSDL, không có email báo.
6. **Cỡ chữ nhãn trong vòng s04** đang lớn hơn thiết kế khoảng 20% (13px so với ~11px). Chưa sửa
   vì nằm ngoài phạm vi yêu cầu; sửa thì đổi `text-[0.8125rem]` trong `CycleWheel.tsx`.

## 6. Quyết định kỹ thuật cần nhớ

Ba điều dưới đây đã mất nhiều công mới tìm ra — đừng làm lại từ đầu.

### Vercel Framework Preset

Project tạo bằng API nên preset ban đầu là "Other", khiến Vercel chỉ publish thư mục `public/`
và **cả trang báo 404**. Đã sửa bằng cách truyền `projectSettings.framework: "nextjs"` khi tạo
deployment; Vercel đã lưu lại vào project. Nếu deploy bằng API lần nữa thì vẫn nên truyền
`projectSettings: { framework: "nextjs", buildCommand: "npm run vercel-build" }` cho chắc.

### Nút đổi ngôn ngữ phải là `<a>`, không phải `<Link>`

Layout gốc (thẻ `<html lang>`) nằm trong `src/app/[locale]/layout.tsx`. Next không thay được
layout gốc khi điều hướng phía client, nên dùng `<Link>` sẽ để lại **cả cây DOM của ngôn ngữ cũ**
— trang có 2 `<header>`, 2 `<footer>`, 2 `<h1>`, và thanh trên cùng không khớp nội dung bên dưới.
`Header.tsx` và `MobileMenu.tsx` vì vậy dùng thẻ `<a>` để tải lại cả trang. Có test e2e canh giữ
("bấm nút đổi ngôn ngữ: chỉ còn một bộ giao diện") — đừng đổi ngược lại.

### Hình học vòng 12 bước (s04)

`src/components/sections/CycleWheel.tsx` dựng vòng bằng SVG theo số đo lấy từ
`docs/design/ref/s04-solucion-integral.jpg`, quy về đĩa bán kính 333:

- Cạnh trong/ngoài mỗi ô là **cung tròn** (`A` của SVG), không phải dây cung thẳng.
- Hai cạnh bên là đường thẳng hướng tâm, giữa bán kính nhô ra một **gai nhọn** theo chiều kim
  đồng hồ; gai ô trước khớp vào rãnh ô sau nên 12 ô nối thành chuỗi mũi tên.
- Khe hở giữa hai ô rộng **đều theo px** ở mọi bán kính (`GAP_HALF`), nên nửa góc của ô phải
  tính lại theo từng bán kính — đây là lý do có hàm `h(r)` trong `ringPath`.
- Viền trắng dùng **cùng hàm** `ringPath` với bán kính nới ra và khe thu vào, không dùng
  `translate` + `scale` (cách cũ làm viền lệch khỏi hình).
- Hover đổi nền ô sang `--color-green-hover`; nhãn đặt `pointer-events: none` để trỏ chuột vào
  chữ vẫn tính là trỏ vào ô bên dưới.

Số đo nằm ở đầu tệp dưới dạng hằng số có chú thích — sửa ở đó, đừng sửa rải rác trong hàm.

## 7. Nhánh git

| Nhánh | Trạng thái |
|---|---|
| `main` | `1566506` — đang chạy trên production |
| `fix/ui-alignment-review` | `f3502d8` — chưa gộp, không còn cần (xem mục 5.3) |
