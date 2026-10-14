# TBAgri Website — hướng dẫn cho Claude

Website giới thiệu TBAgri (Thai Binh Corporation tại Cuba): một trang landing 14 section
theo đúng file thiết kế, hai ngôn ngữ (es mặc định, en), form liên hệ lưu khách hàng tiềm năng
và trang quản trị để sửa nội dung. Đây là dự án thực hành của khóa "Claude Code Nâng cao".

@AGENTS.md
@docs/design/tokens.md

## Tài liệu phải đọc trước khi làm
- `docs/PRD.md` — yêu cầu sản phẩm theo 4Ds (Define, Design, Develop, Deploy).
- `docs/specs/<mã>.md` — spec từng section/tính năng. Làm section nào thì đọc spec đó.
- `docs/design/ref/<mã>.jpg` — ảnh thiết kế gốc của từng section (rộng 1250px = @1x).
  Luôn mở ảnh này khi dựng hoặc sửa giao diện.

## Công nghệ
- Next.js 16 (App Router, Cache Components đang bật), React 19, TypeScript strict.
- Tailwind CSS v4: token khai báo trong `src/app/globals.css` (`@theme`).
- Font tự host: Lora (tiêu đề) và Montserrat (chữ thường), trong `src/app/fonts`.
- Dữ liệu: Drizzle ORM + PostgreSQL. Máy cá nhân dùng PGlite (tệp `.data/`), production dùng Neon
  qua biến `DATABASE_URL`. (Từ lab 11.)
- Xác thực quản trị: cookie phiên ký bằng `jose`, mật khẩu băm bằng scrypt. (Từ lab 13.)

## Lệnh thường dùng
- `npm run dev` — chạy thử ở http://localhost:3000 (Claude Desktop: mở Browser pane).
- `npm run typecheck` — sinh kiểu route rồi kiểm tra TypeScript. Chạy sau mỗi thay đổi code.
- `npm run lint` · `npm run format` · `npm run build`
- `npm run compare -- s04` — chụp section và đặt cạnh ảnh thiết kế trong `.compare/`.
  Đo từng hàng chữ: `python3 scripts/rows.py s04 <x0> <x1> navy`.
- Sửa `@theme`/`@utility` trong `globals.css` mà giao diện không đổi → dừng `npm run dev`,
  xóa thư mục `.next` rồi chạy lại (bộ đệm CSS của Turbopack chưa nhận thay đổi).
- Từ lab 11: `npm run db:generate` · `npm run db:migrate` · `npm run db:seed` · `npm run db:studio`
- Từ lab 15: `npm test` (Vitest) · `npm run test:e2e` (Playwright)

## Cấu trúc thư mục
- `src/app/[locale]/` — trang công khai (es/en). `src/app/admin/` — trang quản trị.
- `src/components/sections/` — mỗi section một tệp, tên PascalCase trùng tên trong spec.
- `src/components/ui/` — thành phần dùng chung (Carousel, Stepper, Accordion, Tabs…).
- `src/content/` — kiểu dữ liệu nội dung (`types.ts`) và nội dung mặc định (`defaults.ts`).
- `src/i18n/dictionaries.ts` — chuỗi giao diện cố định (menu, nút, nhãn form).
- `src/server/` — mã chỉ chạy ở server (`import "server-only"`): đọc nội dung, actions, auth.
- `src/db/` — schema, kết nối, migrate, seed. `drizzle/` — tệp migration sinh tự động.
- `src/cms/config.ts` — định nghĩa các trường mà trang quản trị cho phép sửa.

## Quy ước giao diện (bắt buộc)
- Đơn vị: số đo lấy từ thiết kế ở @1x, đổi sang rem bằng cách chia 16 (925px → 57.8125rem).
  Không dùng px cố định cho kích thước bố cục; px chỉ dùng cho đường viền 1–2px.
- Màu và font chỉ lấy từ token (`text-navy`, `bg-green`, `font-display`…), không viết mã màu mới.
- Dùng utility có sẵn: `container-site`, `title-display`, `title-side`, `title-caps`,
  `text-body`, `btn-green`. Cần kiểu mới thì thêm vào `globals.css`, đừng lặp lại chuỗi class dài.
- Ảnh dùng `next/image` với `alt` lấy từ nội dung; ảnh trang trí để `alt=""`.
- Desktop (≥1024px) bám thiết kế; dưới 1024px xếp một cột, chữ tối thiểu 15px, vùng bấm ≥44px.
- Thành phần tương tác (carousel, tabs, accordion) phải dùng được bằng bàn phím và có nhãn ARIA.
- Không để chữ nằm trong ảnh: mọi chữ hiển thị phải là văn bản thật để dịch và sửa được.

## Quy ước code
- Server Component là mặc định; chỉ thêm `"use client"` cho phần cần trạng thái/sự kiện,
  và tách phần đó nhỏ nhất có thể.
- Section nhận dữ liệu đã chọn ngôn ngữ qua props (kiểu `PageContent[...]`), không tự đọc dữ liệu.
- Mọi dữ liệu người dùng gửi lên phải kiểm tra bằng Zod ở server. Không tin dữ liệu từ client.
- Không ghi bí mật vào code. Biến môi trường mới phải thêm vào `.env.example` kèm chú thích.
- Đặt tên tiếng Anh cho biến/hàm; chú thích và tài liệu viết tiếng Việt.

## Quy trình làm việc với Claude
1. Đọc spec + ảnh tham chiếu, nêu kế hoạch ngắn (Plan mode với việc lớn hơn 1 tệp).
2. Làm từng bước nhỏ, mỗi bước chạy `npm run typecheck`.
3. Tự kiểm chứng: mở trang, so với ảnh thiết kế (`npm run compare -- <mã>`), thử bàn phím
   và bề rộng 390px.
4. Báo lại theo mẫu: đã làm gì · cách kiểm chứng · việc còn lại.
5. Chỉ commit khi người dùng đồng ý. Thông điệp commit: `lab-XX: <việc đã làm>`.

## Không được làm
- Không sửa `docs/design/ref/*` và `public/images/*` gốc (tạo bản mới nếu cần).
- Không đọc hay in nội dung `.env`, `.env.local`.
- Không chạy lệnh xóa dữ liệu (`db:reset`, `DROP`, `rm -rf`) khi chưa được hỏi.
- Không thêm thư viện mới khi chưa nêu lý do và được đồng ý.
