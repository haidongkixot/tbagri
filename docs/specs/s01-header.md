# s01 — Header

## Mục tiêu
Cho khách nhận diện thương hiệu TBAgri và đi nhanh tới các phần chính; đổi ngôn ngữ es/en.

## Tham chiếu
- Ảnh: `docs/design/ref/s01-header.jpg` (1250 × 65)
- Dữ liệu: chuỗi menu trong `src/i18n/dictionaries.ts` (`nav`, `a11y`)
- Tài nguyên: `/images/logo-tbagri.png` (240×100, có nền trong suốt)

## Bố cục desktop (canvas 1250px)
| Khối | x | y | rộng × cao | Ghi chú |
|---|---|---|---|---|
| Thanh header | 0 | 0 | 1250 × 65 | Nền trắng, dính đỉnh trang khi cuộn (sticky) |
| Logo | 160 | 8 | 120 × 50 | Ảnh crop có lề, logo thật rộng ~113px |
| Menu | phải, kết thúc 1034 | căn giữa dọc | — | 5 mục, cách nhau 27px |
| Cờ đổi ngôn ngữ | 1063 | 29 | 22 × 15 | Trang es hiện cờ Mỹ → /en; trang en hiện cờ Cuba → /es |

## Chữ
| Phần tử | Font | Cỡ | Màu |
|---|---|---|---|
| Mục menu | Montserrat 400 | 13.5px | navy, hover green-600 |

## Liên kết
Inicio → `#inicio` · Introducción → `#introduccion` · Productos → `#productos` ·
Nuestras tiendas → `/{locale}/tiendas` · Contacto → `#contacto`

## Mobile (<1024px)
- Cao 64px; logo 44px; nút ☰ 44×44 bên phải mở bảng menu toàn màn hình (đóng bằng Esc, nút ✕, hoặc chọn mục).
- Trong bảng có nút đổi ngôn ngữ kèm chữ "Ver en inglés / View in Spanish".

## Trợ năng
- Liên kết "Saltar al contenido" hiện khi nhấn Tab lần đầu, nhảy tới `<main id="contenido">`.
- `<nav aria-label="Navegación principal">`; nút ☰ có `aria-expanded` và `aria-controls`.

## Tiêu chí đạt
- [ ] Khớp ảnh thiết kế ở 1250px (`npm run compare -- s01`)
- [ ] Cờ đổi ngôn ngữ giữ đúng trang hiện tại
- [ ] Menu mobile dùng được bằng bàn phím, khóa cuộn trang khi mở
