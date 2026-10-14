# s09 — Mecanización agrícola (carousel thẻ máy)

## Mục tiêu
Giới thiệu các nhóm máy nông nghiệp theo từng giai đoạn vụ lúa; người xem lướt thẻ và bấm
nút để xin tư vấn, báo giá.

## Tham chiếu
- Ảnh: `docs/design/ref/s09-mecanizacion.jpg` (1250 × 590)
- Dữ liệu: `SiteContent["machinery"]` (title, ctaLabel) và `SiteContent["machines"]`
  (Slide[]: title, description, image, fit?)
- Tài nguyên: `machinery-1..3.webp`, `deco-rice-stalk-light.png` (bông lúa trang trí)
- Thành phần dùng chung: `ui/Carousel.tsx` với `variant="chevron"` (thêm ở lab 07)

## Bố cục desktop (px thiết kế)
| Thành phần | Giá trị |
|---|---|
| Section | nền `green-pale`, cao 590 |
| Tiêu đề h2 | `title-side` căn giữa, đỉnh khung chữ cách đỉnh section 31.5 |
| Vùng thẻ | rộng 816 (`--container-card`), căn giữa, cách tiêu đề 30.5 |
| Thẻ | 261.5 × 354.5, nền trắng, bo 45 góc trên phải + dưới trái, đệm 6.5; khoảng cách 15.25 |
| Ảnh trong thẻ | cao 176, bo 38 hai góc chéo như thẻ |
| Tên máy (h3) | `title-caps` 16.5/20, cách ảnh 17, lề trái 16 (tính từ mép trong) |
| Mô tả | `text-body`, cách h3 4 |
| Mũi tên | navy, 14.5 × 27.5, nét 2.6; nằm ở mép trái/phải `container-site`, tâm ngang giữa thẻ |
| Nút | `btn-green` 406 × 45 căn giữa, cách thẻ 29.5 |
| Bông lúa | 176 × 260 tại x = 40, y = 330 của canvas, chạm đáy section; nằm dưới thẻ (thẻ che phần bên phải); phần thân tiếp tục ở s10 |

## Hành vi
- 3 thẻ hiển thị, mỗi lần bấm mũi tên cuộn đúng 1 thẻ; mũi tên đầu/cuối bị vô hiệu.
- Số thẻ lấy từ dữ liệu (hiện 4 — thẻ 4 "Equipos de cosecha" là `// MẪU`).

## Nội dung
Thiết kế có lỗi chính tả "EQUITTTPOS" và "mecá nico"; nội dung mặc định đã sửa thành
"Equipos de cuidado del cultivo" và "mecánico".

## Mobile (<1024px)
Thẻ rộng 82% (thấy mép thẻ sau), vuốt ngang có snap; ẩn mũi tên và bông lúa; nút rộng hết.

## Trợ năng
Như s05: region carousel có nhãn, mỗi thẻ là slide "1 / 4: …", track nhận focus để cuộn bằng phím.

## Tiêu chí đạt
- [ ] `npm run compare -- s09`: cao lệch ≤ 2px, 3 thẻ và mũi tên đúng vị trí
- [ ] Bấm "Siguiente" → thẻ 2–4 hiển thị, "Siguiente" bị vô hiệu, "Anterior" bật
- [ ] 390px: vuốt được, không tràn ngang trang
