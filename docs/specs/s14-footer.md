# s14 — Footer

## Mục tiêu
Thông tin liên hệ chính thức, liên kết phụ, mạng xã hội; kết thúc trang bằng màu xanh thương hiệu.

## Tham chiếu
- Ảnh: `docs/design/ref/s14-footer.jpg` (1250 × 301)
- Dữ liệu: `SiteContent["settings"]` (companyName, address — có `\n` để ngắt dòng, email, phone,
  whatsapp, facebook), `SiteContent["footerLinks"]` (label, href); năm lấy tự động
- Chuỗi giao diện: `dictionaries.ts → footer`
- Tài nguyên: `logo-tbagri-white.png`, `deco-rice-stalk-dark.png`

## Bố cục desktop (px thiết kế)
| Thành phần | Giá trị |
|---|---|
| Footer | nền `green`, cao 301 |
| Lưới | 3 cột từ x = 160: 290 · 265 · phần còn lại |
| Logo trắng | 140 × 57 tại y = 41 |
| Tên công ty | Montserrat 600 in hoa 12.6/15, y = 112 |
| Mạng xã hội | 2 icon 18.5, y = 163; vùng bấm 44 × 44 |
| Bản quyền | 8/10, y = 246 |
| Tiêu đề cột | Montserrat 600 in hoa 12.5/16 |
| Dòng liên hệ / liên kết | 9/12.5 (đúng thiết kế) với icon tròn trắng 12 |
| Bông lúa đậm | 197.5 × 261.5 tại x = 877.5, sát đáy |

## Lưu ý trợ năng (cần TBAgri quyết định)
- Chữ trắng trên nền `green` (#62bb46) chỉ đạt tương phản ≈ 2.4 : 1 (AA yêu cầu 4.5 : 1 với chữ
  thường). Chữ 9px càng khó đọc. Đề xuất: tăng cỡ chữ footer lên 12–13px và/hoặc dùng nền
  `green-600`. Bản dựng hiện giữ đúng thiết kế trên desktop; mobile đã dùng chữ 15px.
- Liên kết chưa có `href` hiển thị dạng chữ thường (không phải link giả).

## Icon mạng xã hội
Dùng icon chung (bong bóng chat cho WhatsApp, biểu tượng trang cho Facebook) kèm `aria-label`.
Thay bằng icon chính thức khi TBAgri cung cấp theo hướng dẫn thương hiệu của từng nền tảng.

## Mobile (<1024px)
Cột xếp dọc (≥640px: 2 cột), chữ 15px, bông lúa thu nhỏ góc phải dưới.

## Tiêu chí đạt
- [ ] `npm run compare -- s14`: cao lệch ≤ 2px; logo, 3 cột và bông lúa đúng vị trí
- [ ] Bấm email/điện thoại mở `mailto:` / `tel:`; WhatsApp mở `wa.me/<số>` ở tab mới
