# Trạng thái dự án TBAgri Web

> Cập nhật: 2026-11-25 · Chạy thật: **https://tbagri.vercel.app**
> Tài liệu này để mở một phiên Claude Code mới ở máy khác mà không cần đọc lại lịch sử chat.
> Đọc cùng với `CLAUDE.md` (quy ước bắt buộc), `docs/PRD.md` (yêu cầu), `docs/progress.md` (nhật ký lab).
> Phần hạ tầng và quyền truy cập từ phiên Claude Code: **mục 8**.

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
| Bản deploy hiện tại | `dpl_5gaiJZ2dy8xn8RcuQ4LroRzeQ1R7` — commit `c4a29cf`, READY, 2026-11-16. Mỗi push `main` tự deploy production (GitHub đã nối, không cần deploy bằng API nữa) |
| Framework Preset | **Next.js** (đã đặt đúng, xem mục 6) |
| Build Command | `npm run vercel-build` → `scripts/bootstrap.ts` (migrate → seed → 3 admin có sẵn → tạo admin nếu có biến) rồi `next build` |
| CSDL | Neon Postgres qua biến `DATABASE_URL` — **chưa rõ là project Neon nào, xem mục 8** |
| Ảnh tải lên | Vercel Blob, kho `tbagri-store` gắn kiểu mới: Vercel chỉ đặt `TBAGRI_STORE_ID` (xác thực OIDC), **không** có `BLOB_READ_WRITE_TOKEN`. `src/server/actions/upload.ts` nhận cả hai kiểu |

**Cạm bẫy tên "tbagri-web".** Có ba thứ cùng tên này và **không thứ nào còn dùng**:
kho GitHub `haidongkixot/tbagri-web` (3 commit, thử nghiệm "VerdaAgro UX"), project Vercel
`prj_WERE9JFrKoUBDLER9nJ4rVmkmGIi`, và project Neon `blue-cherry-96351244` (lược đồ Prisma kiểu
`AdminUser`/`BlogPost`, không phải lược đồ Drizzle của trang này). Trang thật luôn là kho
`haidongkixot/tbagri` → project Vercel `tbagri`.

## 3. Trạng thái từng phần

| Phần | Trạng thái | Ghi chú |
|---|---|---|
| 14 section giao diện (s01–s14) | ✅ xong | Mỗi section có spec trong `docs/specs/` và ảnh gốc trong `docs/design/ref/` |
| Song ngữ es/en | ✅ xong | Nội dung mặc định dịch đủ 100%; nút đổi ngôn ngữ đã sửa (mục 6) |
| Trang Nuestras tiendas, 404 song ngữ, sitemap, robots, JSON-LD | ✅ xong | |
| Form liên hệ → bảng `leads` | ✅ xong | Zod, bẫy bot, giới hạn 5 lần/giờ/IP (IP băm) |
| Email thông báo lead (Resend) | ⚠️ tùy chọn | Chỉ chạy khi có `RESEND_API_KEY`; chưa đặt trên production |
| Đăng nhập quản trị | ❓ chờ xác nhận | Lab 17 đã phát 3 tài khoản kèm mật khẩu tạm, nên `SESSION_SECRET` **có lẽ** đã đặt xong. Không đọc được biến môi trường từ phiên Claude Code (mục 8) → thử đăng nhập `/admin` để biết chắc |
| Bảng leads, xuất CSV, nhật ký | ✅ xong | Nằm sau đăng nhập |
| Quản lý tài khoản quản trị, đổi mật khẩu | ✅ xong (lab 17) | `/admin/users` (chỉ admin), `/admin/account`; spec `docs/specs/admin-users.md` |
| CMS sửa nội dung (27 khối) | ✅ xong | Nằm sau đăng nhập |
| Test | ✅ 38 unit (Vitest) + 22 e2e (Playwright) | CI GitHub Actions chạy đủ trên mỗi push `main` và PR |

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

1. **Xác nhận `SESSION_SECRET` và `IP_HASH_SALT` trên Vercel.** Thiếu `SESSION_SECRET`
   (≥ 32 ký tự) thì `src/server/auth/session.ts` ném lỗi và đăng nhập `/admin` báo "Không đăng
   nhập được do lỗi hệ thống". Lab 17 phát được mật khẩu tạm nên hai biến này có lẽ đã có; cần
   một lần đăng nhập để chốt. Nếu thiếu: Vercel → project `tbagri` → Settings → Environment
   Variables → thêm cho Production (`openssl rand -hex 32` cho mỗi biến) → deploy lại.
   Phiên Claude Code **không đọc được** biến môi trường (mục 8), nên việc này phải làm tay.
2. **Xác định project Neon của production.** `DATABASE_URL` trỏ tới đâu thì chưa biết: tổ chức
   Neon mà phiên Claude Code thấy được (`org-rapid-wave-11370503`) **không có** project nào chứa
   bảng `content_entries`/`leads`/`admin_users`. Khả năng cao CSDL được cấp qua Vercel Marketplace
   nên nằm ở tổ chức Neon khác. Cách chốt: Vercel → `tbagri` → Settings → Environment Variables →
   xem host trong `DATABASE_URL`, rồi đối chiếu `proxy_host` của các project Neon. Biết rồi thì
   ghi thẳng project id vào mục 2 để lần sau truy vấn CSDL thật được bằng Neon MCP.
3. **Tài khoản quản trị.** Bước build tạo sẵn `admin1@tbagri.cu`, `admin2@tbagri.cu`,
   `admin3@tbagri.cu` (`scripts/seed-admins.ts`, mật khẩu tạm đã gửi chủ dự án, bắt buộc đổi ở lần
   đăng nhập đầu). Thêm người, đổi vai trò, tắt, đặt lại mật khẩu: trang `/admin/users`.
   `npm run admin:create` chỉ còn dùng khi mất hết quyền admin. Nếu `ADMIN_PASSWORD` còn trên
   Vercel thì **xóa đi** — mỗi lần build nó đặt lại mật khẩu tài khoản `ADMIN_EMAIL`.
4. **Nhánh `fix/ui-alignment-review`** (9 commit, chưa gộp) — việc của một agent khác, chỉ đổi
   CSS hover và căn viền vòng s04. Phần hover đã làm lại trong `main` nên nhánh này **xóa được** (vẫn còn trên origin tính đến 2026-11-25).
5. **Tên miền riêng** — chưa gắn, đang dùng `tbagri.vercel.app`.
6. **`RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_FROM`** — chưa đặt, nên lead chỉ lưu vào
   CSDL, không có email báo.
7. **Cỡ chữ nhãn trong vòng s04** đang lớn hơn thiết kế khoảng 20% (13px so với ~11px). Chưa sửa
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
| `main` | Nhánh chạy production (push là Vercel tự deploy) |
| `fix/ui-alignment-review` | `f3502d8` — chưa gộp, không còn cần (xem mục 5.3) |

## 8. Hạ tầng và quyền truy cập từ phiên Claude Code

Đã thử thật ngày 2026-11-25. Biết trước những giới hạn này thì đỡ mất thời gian dò lại.

| Việc | Được? | Ghi chú |
|---|---|---|
| Git: clone, commit, push `main` | ✅ | `github.com/haidongkixot/tbagri`; push `main` là Vercel tự deploy production |
| Vercel: xem project, deployment, log build/chạy | ✅ | `list_deployments`, `get_deployment`, `get_runtime_logs` |
| Vercel: tạo deployment bằng API | ✅ | Chỉ cần khi GitHub không tự deploy; nhớ truyền `projectSettings` (mục 6) |
| Vercel: **đọc/ghi Environment Variables** | ❌ 403 | `GET /v10/projects/{id}/env` → `forbidden`. Mọi việc với biến môi trường phải làm tay trong Dashboard |
| Vercel: **xem Integrations / Marketplace** | ❌ 403 | `GET /v1/integrations/configurations` → `forbidden`. Nên không tra được kho Blob hay CSDL gắn vào project |
| Neon: xem project, branch, bảng, chạy SQL | ✅ | Nhưng chỉ trong tổ chức `org-rapid-wave-11370503` — **không thấy** CSDL production của trang này (mục 5.2) |
| Gọi `https://tbagri.vercel.app` bằng `curl` | ❌ | Mạng của container chặn; dùng `mcp__Vercel__web_fetch_vercel_url` thay thế |
| Đọc `.env`, `.env.local` | ❌ | `CLAUDE.md` cấm. Chỉ đọc `.env.example` |

**Mã nhận dạng cần dùng lại**

- Vercel project: `tbagri` · `prj_qIYeTMwa7adkhyIh5soFyl0ePZQR`
- Vercel team: `haidongkixots-projects` · `team_wbKguqX6Wj8eVKG1K332eQFD`
- Kho Blob: `tbagri-store` (biến `TBAGRI_STORE_ID`, xác thực OIDC)
- Neon org thấy được: `org-rapid-wave-11370503`

**Tài liệu bàn giao ngoài git**: thư mục Google Drive "TBAgri Web — Bàn giao" chứa bản tóm tắt
hạ tầng/truy cập cùng các tệp không nên để trong kho mã (file thiết kế gốc, ảnh kiểm chứng).
File thiết kế gốc dạng PDF 30 MB nằm ở đó; trong kho mã đã có `docs/design/ref/full-page.jpg`
và ảnh từng section, đủ để dựng giao diện.
