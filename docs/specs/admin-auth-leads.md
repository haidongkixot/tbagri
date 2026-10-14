# Quản trị: đăng nhập, tổng quan, khách hàng tiềm năng (lab 13)

## Mục tiêu
Đội Marcomdi đăng nhập an toàn, thấy số yêu cầu mới, xử lý từng yêu cầu và xuất CSV.
Giao diện quản trị dùng **tiếng Việt**; dữ liệu khách gửi giữ nguyên (thường là tiếng Tây Ban Nha).

## Đường dẫn
| URL | Nội dung |
|---|---|
| `/admin/login` | Form đăng nhập (trang tĩnh) |
| `/admin` | Tổng quan: 3 thẻ số liệu, 5 yêu cầu mới nhất, nội dung sửa gần nhất, nhật ký |
| `/admin/leads?status=&q=&page=` | Bảng yêu cầu: lọc trạng thái, tìm tên/email/tổ chức, 20 dòng/trang, đổi trạng thái |
| `/admin/leads/export?status=&q=` | Tải CSV (UTF-8 BOM, chống CSV injection) |
| `/admin/content` | Sửa nội dung (lab 14) |

## Bảo mật (4 lớp)
1. **Proxy** (`src/proxy.ts`): /admin/* thiếu cookie `tbagri_session` → chuyển `/admin/login`. Chỉ là chặn sớm.
2. **`requireAdmin()`** (`src/server/auth/session.ts`): kiểm tra chữ ký JWT (jose, HS256,
   `SESSION_SECRET`) **và** tài khoản còn `active` trong CSDL — gọi ở mọi trang, action, route.
3. **Mật khẩu** scrypt (`src/server/auth/password.ts`), so sánh thời gian hằng; tạo bằng
   `npm run admin:create` (≥ 12 ký tự, có chữ và số). Không có trang tự đăng ký.
4. **Giới hạn đăng nhập** 10 lần/15 phút/IP; thông báo lỗi chung "Email hoặc mật khẩu không đúng".
Cookie: httpOnly, `secure` trên production, `sameSite=lax`, `path=/admin`, hết hạn 8 giờ.
Mọi thao tác (đăng nhập, sai mật khẩu, đổi trạng thái, xuất CSV) ghi `audit_log`.

## Cache Components và dữ liệu theo yêu cầu
Đọc cookie/CSDL là dữ liệu theo yêu cầu → mỗi trang quản trị bọc phần dữ liệu trong
`<Suspense fallback={<AdminSkeleton />}>` **bên trong trang** (không chỉ ở layout), nếu không
Next.js báo "uncached data … outside of <Suspense>" khi điều hướng. Thông tin người dùng ở menu
(`UserBox`) cũng nằm trong Suspense riêng.

## Tiêu chí đạt
- [ ] Vào `/admin/leads` khi chưa đăng nhập → về `/admin/login`
- [ ] Sai mật khẩu → thông báo chung; đúng → `/admin`
- [ ] Đổi trạng thái 1 yêu cầu → thẻ lọc "Đã liên hệ (1)"; nhật ký ghi `lead_status:contactado`
- [ ] Xuất CSV mở được bằng Excel, đúng dấu tiếng Tây Ban Nha
- [ ] Đăng xuất → vào `/admin` lại bị chuyển về đăng nhập
- [ ] `npm run build` thành công; không có cảnh báo "uncached data" trong trình duyệt
