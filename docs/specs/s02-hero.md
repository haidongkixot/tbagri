# s02 — Hero "Del campo al mercado"

## Mục tiêu
Thông điệp định vị: TBAgri đi cùng nhà sản xuất từ đồng ruộng tới thị trường.

## Tham chiếu
- Ảnh: `docs/design/ref/s02-hero.jpg` (1250 × 492 — phần nhìn thấy trên thẻ giới thiệu)
- Dữ liệu: `SiteContent["hero"]` → `title`, `subtitle`, `background`
- Tài nguyên: `/images/hero-bg.webp` (1850 × 1787) — đã xóa chữ, giữ bố cục vòng tròn ảnh

## Bố cục desktop
| Khối | x | y (từ đỉnh section) | rộng × cao | Ghi chú |
|---|---|---|---|---|
| Khung ảnh | 160 | 0 | 925 × 893.5 | Không full màn hình; phần dưới 492px nằm sau thẻ s03 |
| Tiêu đề dòng 1 | căn giữa | đỉnh chữ hoa ≈ 39 | rộng ≈ 440 | "DEL CAMPO AL MERCADO" |
| Tiêu đề dòng 2–3 | căn giữa | 75 và 102 | rộng ≈ 470 | Màu green-600 |

## Chữ
| Phần tử | Font | Cỡ / dòng | Màu |
|---|---|---|---|
| Dòng 1 | Lora 700, in hoa | 34.4px / 38px | navy |
| Dòng 2–3 | Lora 700, in hoa | 25px / 26.5px | green-600 #35913a |

Một `h1` chứa cả hai dòng (hai `span`), để trình đọc màn hình đọc liền một câu.

## Mobile (<1024px)
- Tiêu đề nằm trên dải nền trời (gradient #b9e0f8 → sky-100), cỡ 28px / 18px.
- Ảnh tỉ lệ 1850:900, `object-position: 50% 15%` để thấy cụm vòng tròn.

## Ghi chú nội dung
- Thiết kế viết "PRODUCTORESPOR" (thiếu dấu cách) → đã sửa thành "PRODUCTORES POR".

## Tiêu chí đạt
- [ ] `npm run compare -- s02`: tiêu đề lệch ≤ 8px, đúng 2 dòng xanh ở 1250px
- [ ] Ảnh dùng `next/image` có `priority` (ảnh LCP)
- [ ] Mobile 390px: chữ không đè lên ảnh, không tràn ngang
