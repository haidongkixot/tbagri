# Quản trị: tài khoản quản trị và đổi mật khẩu (lab 17)

## Mục tiêu
Admin tự thêm người dùng, đổi vai trò, tắt tài khoản và đặt lại mật khẩu ngay trong trang quản trị;
mỗi người tự đổi mật khẩu của mình. Không còn phải chạy `npm run admin:create` với chuỗi kết nối
production cho việc hằng ngày.

## Đường dẫn
| URL | Ai vào được | Nội dung |
|---|---|---|
| `/admin/users` | Chỉ vai trò **admin** | Form "Thêm tài khoản" + bảng tài khoản (vai trò, trạng thái, lần đăng nhập cuối, thao tác) |
| `/admin/account` | Mọi tài khoản đang hoạt động | Đổi mật khẩu của chính mình |

Vai trò: **admin** — toàn quyền; **biên tập** (`editor`) — khách hàng tiềm năng + nội dung trang,
không thấy menu và bị chuyển về `/admin?error=forbidden` khi mở `/admin/users`.

## Quy tắc
- **Mật khẩu tạm:** tạo tài khoản và "Đặt lại mật khẩu" đều sinh mật khẩu ngẫu nhiên 20 ký tự
  (`generatePassword()` trong `src/server/auth/password.ts`, bỏ ký tự dễ nhầm `0 O 1 l I`), hiện
  **một lần** kèm nút "Chép". CSDL chỉ lưu bản băm scrypt.
- **Bắt buộc đổi:** cột `admin_users.must_change_password` (migration `0001`). Khi `true`,
  `requireAdmin()` đưa mọi trang/action về `/admin/account`, trừ chỗ gọi với
  `allowPasswordChange: true` (trang đổi mật khẩu, khung menu). Đổi xong → về `/admin`.
- **Không mất quyền quản trị:** không tự hạ quyền, tự tắt hay tự đặt lại mật khẩu của chính mình
  (nút bị vô hiệu và server cũng chặn); không được tắt/hạ quyền admin cuối cùng còn hoạt động.
- **Không xóa tài khoản** — dùng "Tắt" (rule back-end). Tài khoản bị tắt mất quyền ngay ở yêu cầu kế
  tiếp vì `requireAdmin()` đọc CSDL mỗi lần.
- **Đổi mật khẩu:** phải đúng mật khẩu hiện tại; mới ≥ 12 ký tự, có chữ và số, khác mật khẩu cũ,
  nhập lại khớp; giới hạn 10 lần/15 phút cho mỗi tài khoản.
- Mọi thao tác ghi `audit_log`: `user_create`, `user_role:<vai trò>`, `user_enable`, `user_disable`,
  `user_password_reset`, `password_change`.

## Tài khoản có sẵn trên production
`scripts/seed-admins.ts` (gọi trong `scripts/bootstrap.ts` khi build trên Vercel) tạo
`admin1@tbagri.cu`, `admin2@tbagri.cu`, `admin3@tbagri.cu` — vai trò admin, bắt buộc đổi mật khẩu ở
lần đăng nhập đầu. Chỉ tạo khi email chưa có (`ON CONFLICT DO NOTHING`), deploy lại không ghi đè.
Tệp chỉ chứa bản băm của mật khẩu tạm; mật khẩu tạm đã gửi riêng cho chủ dự án (2026-11-12).

## Tệp chính
| Tệp | Vai trò |
|---|---|
| `src/server/actions/users.ts` | `createUser`, `setUserRole`, `setUserActive`, `resetUserPassword` |
| `src/server/actions/account.ts` | `changeOwnPassword` |
| `src/server/users.ts` | `listAdminUsers`, `countOtherActiveAdmins` |
| `src/lib/admin-user-schema.ts` | Zod: tạo tài khoản, đổi mật khẩu (có test) |
| `src/components/admin/UserCreateForm.tsx`, `UserRowActions.tsx`, `ChangePasswordForm.tsx`, `TempPasswordBox.tsx` | Phần client |

## Tương tác và trợ năng
- Mọi ô có `<label>`; lỗi hiện dưới đúng ô (`aria-invalid`, `aria-describedby`); thông báo dùng
  `role="alert"` / `role="status"`.
- Nút trên mỗi dòng có `aria-label` kèm email; ô chọn vai trò có nhãn ẩn.
- Vùng bấm ≥ 44px; bảng cuộn ngang trong khung riêng ở 390px, trang không tràn ngang.
- Form đổi mật khẩu có ô `username` ẩn để trình quản lý mật khẩu lưu đúng tài khoản.

## Tiêu chí đạt
- [x] Admin tạo tài khoản → thấy mật khẩu tạm; email trùng/sai → lỗi đúng ô
- [x] Đăng nhập bằng mật khẩu tạm → bị giữ ở `/admin/account` → đổi xong vào được `/admin`
- [x] Biên tập không thấy menu và không mở được `/admin/users`
- [x] Tắt tài khoản → người đó không đăng nhập được
- [x] Không tự tắt/tự hạ quyền chính mình
- [x] 1250px và 390px không tràn ngang
