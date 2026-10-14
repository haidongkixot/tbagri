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
| Khung ảnh | 0 | 0 | 100vw × 96.6vw | **Bản chạy thật: full màn hình** (TBAgri duyệt 14/10/2026). Thiết kế gốc để 925 × 893.5 có lề trắng hai bên; nay ảnh chạy hết bề ngang, cao theo tỉ lệ 893.5/925 để cụm vòng tròn không bị cắt. Thẻ s03 đè lên 43.4vw (= 401.5/925) nên vẫn nằm sát dưới vòng tròn. |
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
- [ ] 1920px và 1280px: ảnh chạm hai mép màn hình, không có lề trắng; tiêu đề không đè lên vòng tròn
- [ ] Thẻ giới thiệu (s03) nằm ngay dưới cụm vòng tròn ở mọi bề rộng ≥ 1024px
- [ ] Ảnh dùng `next/image` có `priority` (ảnh LCP)
- [ ] Mobile 390px: chữ không đè lên ảnh, không tràn ngang
