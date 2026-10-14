# Design tokens TBAgri (đo từ thiết kế, canvas 1250px @1x)

Quy đổi: rem = px thiết kế ÷ 16. Trên màn ≥1024px cỡ chữ gốc = clamp(14px, 1.28vw, 20px),
nên bố cục co giãn đúng tỉ lệ thiết kế. Dưới 1024px cỡ chữ gốc cố định 16px.

## Màu
| Token Tailwind | Mã | Dùng cho |
|---|---|---|
| `navy` | #00377b | Tiêu đề, chữ chính, nhãn chip, nút "Contáctanos" nổi |
| `green` | #62bb46 | Nút, dải xanh, footer, chấm stepper đang chọn |
| `green-600` | #35913a | Dòng phụ đề xanh ở hero, hover nút |
| `green-icon` | #5aab3f | Nền tròn icon dịch vụ |
| `green-pale` | #cdebc5 | Nền section sản phẩm, hạt giống, cơ giới hóa, khung secado |
| `green-card` | #daebc1 | Khung xanh nhạt trong thẻ giới thiệu |
| `mint` | #d6fdd0 | Thẻ tính năng số hóa |
| `sky-50` / `sky-100` | #eff9fe / #dff1fd | Nền trời nhạt |
| `line` | #acb6bc | Đường kẻ accordion |
| `ink` | #0b0b0b | Đoạn văn trên nền sáng |

## Chữ
| Utility | Font | Cỡ desktop (px thiết kế) | Ví dụ |
|---|---|---|---|
| `title-display` | Lora 700, in hoa | 35 / 38 | DEL CAMPO AL MERCADO, SOLUCIÓN INTEGRAL |
| `title-side` | Lora 700, in hoa | 33 / 40 | GRUPO DE PRODUCTOS Y SERVICIOS, SEMILLAS E INSUMOS |
| `title-caps` | Montserrat 600, in hoa | 17 / 20 | SEMILLAS DE ARROZ, MODELO DE SERVICIO |
| `text-body` | Montserrat 400 | 13.4 / 15.25 | Đoạn mô tả |
| `btn-green` | Montserrat 500 | 15 | Contáctenos para una consulta… |

## Khung và khoảng cách
- Khung nội dung `container-site`: 925px (x = 160 → 1085 trên canvas 1250).
- Thẻ giới thiệu: 816px (x = 217 → 1033).
- Bo góc: ảnh 28px · thẻ 24px · chip 12px · nút 8px · khung ảnh slider 45px (hai góc chéo).
- Hiệu ứng: `animate-fade-in` (0.35s) khi đổi slide/tab; tự tắt khi người dùng giảm chuyển động.
- Khoảng cách dọc giữa các section: 64–96px; giữa tiêu đề và nội dung: 24–40px.

## Ảnh
- Toàn bộ ảnh trong `public/images/`, cắt từ file thiết kế (tạm thời, sẽ thay ảnh gốc).
- Ảnh nền đã xóa chữ: `hero-bg`, `drying-field`, `digital-bg`, `benefit-invite-bg`.
- Minh họa dây chuyền sau thu hoạch có nền trắng: dùng utility `img-multiply`; icon chuẩn hóa khung 336 × 328 (2x), vật thể sát đáy.
- Mũi tên nét đứt: utility `dash-x` / `dash-y` (nét 8.5px, hở 5.5px, dày 2px, màu `green`).
