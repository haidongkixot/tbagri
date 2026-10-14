# s06 — Modelo de servicio (6 nhóm dịch vụ + băng rôn sản phẩm)

## Mục tiêu
Liệt kê 6 nhóm dịch vụ TBAgri cung cấp, mỗi nhóm một icon tròn xanh, kết thúc bằng băng rôn
sản phẩm thật trên nền cánh đồng lúa.

## Tham chiếu
- Ảnh: `docs/design/ref/s06-modelo-servicio.jpg` (1250 × 552)
- Dữ liệu: `SiteContent["serviceModel"]` (title, banner { src, alt }) và
  `SiteContent["services"]` (6 mục: label, icon)
- Tài nguyên: `icon-service-1..6.png`, `products-banner.webp`, nền `sky-soft.webp`
  (utility `bg-sky-soft`)

## Bố cục desktop (px thiết kế)
| Thành phần | Giá trị |
|---|---|
| Section | nền trời nhạt `bg-sky-soft`, cao 552 |
| Tiêu đề | `title-caps` (Montserrat 600 in hoa 17/20, navy), cách đỉnh 34 |
| Hàng icon | rộng 1004, lệch trái 56 so với khung 925, 6 cột đều nhau, cách tiêu đề 22 |
| Icon | tròn 54, nền `green-icon`, hình trắng |
| Nhãn | cách icon 14, Montserrat 400 14/17 navy, tối đa 136 rộng, căn giữa |
| Băng rôn | tràn hết bề ngang, tỉ lệ 2500/745, sát đáy section; mép trên mờ dần (mask 0 → 14%) |

## Mobile (<1024px)
Lưới 3 cột × 2 hàng (≥640px: 6 cột), icon 56; băng rôn nằm dưới, giữ tỉ lệ ảnh.

## Trợ năng
- Danh sách `<ul>`; icon trang trí `alt=""` vì nhãn chữ đã nói đủ nghĩa.
- Băng rôn có `alt` mô tả từ nội dung.

## Tiêu chí đạt
- [ ] `npm run compare -- s06`: cao lệch ≤ 2px, 6 icon thẳng hàng với thiết kế
- [ ] Nhãn 2 dòng ("Asistencia técnica", "Paquete integral por campaña") ngắt giống thiết kế
- [ ] 390px: lưới 3 cột, chữ không bị cắt
