# Kiểm thử và phát hành (lab 15)

## Test đơn vị — Vitest (`npm test`)
`tests/unit/*.test.ts`, chỉ test **hàm thuần** (không CSDL, không React):
| Tệp | Kiểm tra |
|---|---|
| `content.test.ts` | `localize` (fallback es), `isL10n`, `mergeWithDefaults` (object trộn nông, list thay cả, khóa lạ/kiểu sai) |
| `lead-schema.test.ts` | Mỗi quy tắc form liên hệ → đúng mã lỗi; `leadFromFormData` |
| `cms-schema.test.ts` | Mọi khóa SiteContent có cấu hình; nội dung mặc định hợp lệ; es bắt buộc; min/max; `IMAGE_SRC_RE` chặn URL lạ |
| `password.test.ts` | scrypt băm/xác minh, muối ngẫu nhiên, chuỗi hỏng, độ mạnh |

## Test đầu-cuối — Playwright (`npm run test:e2e`)
- `playwright.config.ts`: tự `npm run e2e:prepare` (xóa `.data/e2e`, migrate, seed, tạo admin
  `e2e@tbagri.test`) rồi `next start -p 3200`. Hai project: `desktop` (1250px) và `mobile`
  (Pixel 7, chỉ trang công khai). Locale mặc định `es-CU`.
- `tests/e2e/public.spec.ts`: chuyển hướng ngôn ngữ (es mặc định, en theo Accept-Language),
  4 neo + footer, không tràn ngang, stepper chuột/phím, form lỗi → thành công, 404, sitemap/robots.
- `tests/e2e/admin.spec.ts`: chặn khi chưa đăng nhập, sai mật khẩu, luồng lead (gửi → đổi trạng
  thái → lọc → CSV → đăng xuất), CMS sửa hero → trang công khai đổi ngay → khôi phục, es trống bị từ chối.
- Mẹo: Next giữ trang trước trong DOM (`display:none`) sau điều hướng → dùng `getByRole`
  (bỏ phần tử ẩn) thay vì `locator("h1")`.

## CI — GitHub Actions (`.github/workflows/ci.yml`)
Push/PR → typecheck, lint, format:check, Vitest, Playwright (Chromium); lưu trace khi thất bại.

## Phát hành
Theo `README.md` mục "Deploy lên Vercel" và skill `/release-check`. Build Command
`npm run vercel-build` chạy migration Neon trước `next build`.

## Tiêu chí đạt
- [ ] `npm test`: 31 test qua · `npm run test:e2e`: 18 test qua (desktop + mobile)
- [ ] CI xanh trên nhánh chính
- [ ] `/release-check` không còn mục ✗ bắt buộc
