# PRD — Website TBAgri (landing page + CMS)

Phiên bản 1.0 · Khung 4Ds: Define – Design – Develop – Deploy
Chủ sản phẩm: Marcomdi, Thai Binh Corporation · Người dựng: học viên khóa Claude Code Nâng cao

---

## 1. DEFINE — Vì sao làm, làm cho ai

### 1.1 Vấn đề
TBAgri là đơn vị nông nghiệp của Thai Binh Corporation tại Cuba, cung cấp giải pháp trọn chuỗi lúa
gạo. Hiện chưa có website chính thức bằng tiếng Tây Ban Nha để:
- giới thiệu năng lực trọn chuỗi (hạt giống → cơ giới → sau thu hoạch → thị trường) với đối tác Cuba;
- nhận yêu cầu tư vấn/báo giá có cấu trúc thay vì qua điện thoại, tin nhắn rời rạc;
- cho đội Marcomdi tự cập nhật nội dung mà không cần lập trình viên.

### 1.2 Mục tiêu (đo được)
| Mục tiêu | Chỉ số | Ngưỡng đạt khi bàn giao |
|---|---|---|
| Truyền tải đúng thiết kế đã duyệt | Sai lệch so với file thiết kế ở 1250px | ≤ 8px mỗi khối, đúng font/màu |
| Thu khách hàng tiềm năng | Form liên hệ lưu vào CSDL, quản trị xem được | 100% yêu cầu hợp lệ được lưu |
| Đội nội dung tự cập nhật | Thời gian sửa một đoạn chữ/ảnh | < 2 phút, không cần deploy |
| Chất lượng kỹ thuật | Lighthouse mobile | Performance ≥ 85, A11y ≥ 95, SEO ≥ 95 |
| Hai ngôn ngữ | Trang /es và /en | Đủ 100% chữ hiển thị |

### 1.3 Người dùng
| Nhóm | Họ cần gì | Hành động mong muốn |
|---|---|---|
| Nông dân, hợp tác xã Cuba | Biết TBAgri cung cấp gì cho vụ lúa | Gửi yêu cầu tư vấn |
| Cơ quan nhà nước | Hiểu mô hình hợp tác, lợi ích quốc gia | Liên hệ làm việc |
| Doanh nghiệp, đối tác | Đánh giá năng lực trọn chuỗi | Đề nghị hợp tác |
| Đội Marcomdi (quản trị) | Sửa nội dung, xem và xử lý yêu cầu | Đăng nhập, cập nhật, đổi trạng thái |

### 1.4 Phạm vi
**Trong phạm vi:** landing 14 section đúng thiết kế; es/en; form liên hệ có chống spam;
trang quản trị (đăng nhập, bảng điều khiển, khách hàng tiềm năng, sửa nội dung, tải ảnh);
trang "Nuestras tiendas" đơn giản; SEO cơ bản; deploy Vercel + Neon.

**Ngoài phạm vi (giai đoạn sau):** blog/tin tức, cửa hàng trực tuyến, nhiều vai trò quản trị
phức tạp, bản đồ tương tác, tích hợp CRM.

### 1.5 Ràng buộc
- Thiết kế: file `TBAgri_website_landingpage_view.pdf` (một ảnh phẳng, rộng 1250px @1x).
  Ảnh tạm cắt từ PDF; sẽ thay ảnh gốc khi có.
- Ngôn ngữ chính tiếng Tây Ban Nha (Cuba); kết nối internet tại Cuba có thể chậm → trang nhẹ.
- Dữ liệu cá nhân trong form: chỉ thu thập tối thiểu, có ô đồng ý.

---

## 2. DESIGN — Trang trông và hoạt động thế nào

### 2.1 Sơ đồ trang
- `/es`, `/en` — landing (mặc định chuyển theo ngôn ngữ trình duyệt, ưu tiên es)
- `/es/tiendas`, `/en/tiendas` — danh sách cửa hàng/văn phòng
- `/admin/login` → `/admin` (tổng quan) · `/admin/leads` · `/admin/content` · `/admin/content/[khóa]`
- `/sitemap.xml`, `/robots.txt`

### 2.2 Các section của landing (thứ tự trong thiết kế)
| Mã | Section | Thành phần chính | Lab |
|---|---|---|---|
| s01 | Header | Logo, menu 5 mục, đổi ngôn ngữ, menu mobile | 02 |
| s02 | Hero | Ảnh nền vòng tròn, tiêu đề Lora 2 màu | 02 |
| s03 | Giới thiệu | Thẻ trắng, 2 cột chữ, 3 thẻ đối tượng, "Un solo socio" | 03 |
| s04 | Solución integral | Vòng 12 bước canh tác (SVG theo dữ liệu), nút liên hệ nổi | 04 |
| s05 | Filosofía | Dải trắng, chữ + carousel ảnh có nhãn | 05 |
| s06 | Modelo de servicio | 6 icon dịch vụ + băng rôn sản phẩm | 05 |
| s07 | Grupo de productos | Ảnh + tiêu đề + nút + slider 6 mục (chấm hạt gạo) | 06 |
| s08 | Semillas e insumos | Slider 5 mục + minh họa | 06 |
| s09 | Mecanización | Carousel thẻ máy móc + nút | 07 |
| s10 | Poscosecha + secado | Dây chuyền 8 bước + khung tab giải pháp | 08 |
| s11 | Digital | Nền ruộng, 4 thẻ tính năng, ảnh nông dân | 09 |
| s12 | Beneficio y contacto | Accordion lợi ích + form liên hệ | 09, 12 |
| s13 | Invitación | Kêu gọi hợp tác + nút (chung nền với s12) | 09 |
| s14 | Footer | Logo, liên hệ, liên kết, mạng xã hội | 10 |

Spec chi tiết từng section: `docs/specs/sXX-*.md`.

### 2.3 Hành trình chính
1. Khách vào `/` → chuyển `/es` → cuộn xem → bấm "Contáctenos…" ở bất kỳ đâu → cuộn tới form
   (mục quan tâm được điền sẵn theo nút đã bấm) → gửi → thấy thông báo cảm ơn.
2. Quản trị vào `/admin` → đăng nhập → thấy số yêu cầu mới → mở danh sách → đổi trạng thái
   "contactado" → xuất CSV.
3. Quản trị vào "Nội dung trang" → chọn "Hero" → sửa tiêu đề es/en → Lưu → trang công khai đổi ngay.
   (Giao diện quản trị bằng tiếng Việt cho đội Marcomdi.)

### 2.4 Mô hình nội dung
Định nghĩa trong `src/content/types.ts` (`SiteContent`): mỗi section là một đối tượng, các danh sách
(bước canh tác, dịch vụ, slide…) là mảng. Chữ hiển thị luôn là `{ es, en }`.

### 2.5 Mô hình dữ liệu (lab 11–14)
| Bảng | Cột chính | Ghi chú |
|---|---|---|
| `content_entries` | `key` (pk), `data` jsonb, `updated_at`, `updated_by` | Mỗi khóa của `SiteContent` là một dòng |
| `leads` | id, name, email, phone, organization, segment, interest, message, locale, status, ip_hash, created_at | status: nuevo / contactado / cerrado |
| `admin_users` | id, email (unique), name, password_hash, role, last_login_at | role: admin / editor |
| `rate_limits` | key (pk), count, reset_at | Giới hạn gửi form và đăng nhập |
| `audit_log` | id, actor, action, target, created_at | Ai sửa gì, khi nào |

### 2.6 Hợp đồng chức năng back-end
- `submitLead(formData)` (Server Action, công khai): Zod → bẫy bot → giới hạn 5 lần/giờ/IP → lưu →
  email báo (nếu cấu hình) → trả `{ ok }` hoặc lỗi từng trường.
- `login(formData)` / `logout()`: kiểm tra mật khẩu scrypt, giới hạn 10 lần/15 phút, đặt cookie phiên.
- `updateLeadStatus(id, status)`, `saveContent(key, data)`, `uploadImage(file)`: chỉ quản trị.
- `GET /admin/leads/export` → CSV (chỉ quản trị).

### 2.7 Yêu cầu phi chức năng
- Trợ năng WCAG 2.1 AA: tương phản, bàn phím, nhãn form, ARIA cho carousel/tabs/accordion.
- Hiệu năng: ảnh WebP, `next/image`, font tự host, trang chủ prerender tĩnh, JS phía client tối thiểu.
- Bảo mật: OWASP cơ bản — kiểm tra quyền ở server, không lộ bí mật, cookie an toàn, chống spam.

---

## 3. DEVELOP — Làm thế nào, theo thứ tự nào

### 3.1 Kiến trúc
- Next.js 16 App Router, Cache Components bật: nội dung đọc qua hàm `"use cache"` gắn thẻ
  `site-content`; quản trị lưu xong gọi `updateTag("site-content")` → trang cập nhật ngay.
- Tailwind v4 + token; component section là Server Component; tương tác tách client nhỏ.
- Drizzle ORM: PGlite khi chạy máy (không cần cài Postgres), Neon trên production.
- Proxy (`src/proxy.ts`): chuyển hướng ngôn ngữ; chặn sớm `/admin` khi chưa có cookie.

### 3.2 Lộ trình (khớp lab của khóa học)
| Tuần | Lab | Kết quả |
|---|---|---|
| 1 | 01 | Khung dự án, token, font, i18n, CLAUDE.md, skills, hooks, PRD duyệt |
| 1 | 02–05 | s01–s06 |
| 2 | 06–10 | s07–s14, responsive, trợ năng, SEO — **Mốc 1: demo giao diện đủ trang** |
| 3 | 11 | CSDL + nội dung đọc từ CSDL |
| 3 | 12 | Form liên hệ + leads |
| 3 | 13 | Đăng nhập + bảng điều khiển + quản lý leads |
| 3 | 14 | CMS sửa nội dung + tải ảnh + trang tiendas |
| 3 | 15 | Kiểm thử, kiểm tra phát hành, deploy — **Mốc 2: demo cuối** |

### 3.3 Định nghĩa "xong" cho mỗi lab
- `npm run typecheck`, `npm run lint` sạch; `npm run build` thành công (từ lab 10).
- Giao diện so với thiết kế bằng `npm run compare` (với lab giao diện).
- Có commit `lab-XX: …` và cập nhật mục "Đã làm" trong `docs/progress.md`.

### 3.4 Kiểm thử
- Unit (Vitest): kiểm tra dữ liệu form, băm mật khẩu, chọn ngôn ngữ, gộp nội dung với mặc định.
- E2E (Playwright): trang chủ es/en, gửi form, đăng nhập và sửa nội dung.

---

## 4. DEPLOY — Đưa lên và vận hành

### 4.1 Môi trường
| Môi trường | Ở đâu | CSDL |
|---|---|---|
| Máy cá nhân | `npm run dev` | PGlite (`.data/`) |
| Preview | Vercel, mỗi nhánh/PR | Neon branch |
| Production | Vercel (tên miền TBAgri) | Neon main |

### 4.2 Biến môi trường
| Biến | Bắt buộc | Mô tả |
|---|---|---|
| `DATABASE_URL` | Production | Chuỗi kết nối Neon (pooled) |
| `SESSION_SECRET` | Có | Chuỗi ngẫu nhiên ≥ 32 ký tự để ký cookie phiên (jose HS256) |
| `IP_HASH_SALT` | Có | Muối băm IP cho giới hạn tần suất |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | Khi tạo tài khoản | Dùng với `npm run admin:create` |
| `NEXT_PUBLIC_SITE_URL` | Có | URL gốc dùng cho SEO, sitemap |
| `BLOB_READ_WRITE_TOKEN` | Production | Lưu ảnh tải lên (Vercel Blob) |
| `RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_FROM` | Tùy chọn | Gửi email báo có yêu cầu mới |

### 4.3 Quy trình phát hành
1. `/release-check` (skill) → sửa hết mục ✗.
2. Push nhánh → Vercel tạo Preview → kiểm tra trên điện thoại.
3. Build Command trên Vercel là `npm run vercel-build` → tự migrate Neon trước khi build.
   Lần đầu: `DATABASE_URL=… npm run db:seed` và `npm run admin:create` từ máy mình.
4. Promote lên Production; kiểm tra form gửi thật và trang quản trị.

### 4.4 Vận hành
- Xem lỗi: Vercel → Logs; khách báo lỗi form → kiểm tra bảng `leads` và log.
- Sao lưu: Neon giữ lịch sử (point-in-time restore).
- Bàn giao: README, tài khoản quản trị, hướng dẫn sửa nội dung 1 trang cho Marcomdi.

### 4.5 Rủi ro
| Rủi ro | Ảnh hưởng | Giảm thiểu |
|---|---|---|
| Ảnh cắt từ PDF độ nét thấp | Trang kém sắc nét trên màn lớn | Thay ảnh gốc qua CMS |
| Nội dung `// MẪU` chưa được duyệt | Thông tin sai | Danh sách duyệt trước phát hành |
| Spam form | Rác dữ liệu | Bẫy bot + giới hạn tần suất |
| Lộ mật khẩu quản trị | Mất kiểm soát nội dung | Mật khẩu mạnh, đổi định kỳ, audit log |
