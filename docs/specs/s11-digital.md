# s11 — Tecnologías digitales (4 thẻ tính năng + ảnh nông dân)

## Mục tiêu
Cho thấy TBAgri đưa công nghệ số vào canh tác: nhóm giải pháp số, 4 thẻ tính năng và hình ảnh
người nông dân dùng điện thoại ngoài đồng.

## Tham chiếu
- Ảnh: `docs/design/ref/s11-digital.jpg` (1250 × 905)
- Dữ liệu: `SiteContent["digital"]` (title, subtitle, text, image) và
  `SiteContent["digitalFeatures"]` (4 mục: title, description, icon)
- Tài nguyên: `digital-bg.webp` (nền ruộng xanh), `digital-farmer.webp`, `icon-digital-1..2.png`
  (huy hiệu tròn trắng đã có icon)

## Bố cục desktop (px thiết kế)
| Thành phần | Giá trị |
|---|---|
| Section | cao 905, nền `digital-bg.webp` phủ kín (`object-cover object-top`) |
| Tiêu đề h2 | `title-side` căn giữa, rộng tối đa 816 → 2 dòng, đỉnh chữ y = 92 |
| Lưới | cột trái 555 (chữ + thẻ), khoảng 41, cột phải ảnh |
| h3 nhóm | `title-caps` 16.5/20, y = 227 |
| Đoạn giới thiệu | 13.4/16, **Montserrat 500, tracking −0.05em** (đo từ thiết kế), rộng tối đa 464 |
| Thẻ | 2 × 2, mỗi thẻ 261.5 × 204, khoảng ngang 31.5, dọc 61; nền `mint`, bo 17 |
| Huy hiệu icon | tròn 54.5, lệch trái 19, nhô lên 29 so với mép trên thẻ |
| Tiêu đề thẻ (h4) | `title-caps` 16.5/20, cách mép trên thẻ 34 |
| Mô tả thẻ | 13.4/15, Montserrat 500, tracking −0.05em, rộng tối đa 214 |
| Ảnh nông dân | x = 756 → **tràn tới mép phải màn hình**, cao 594, bo 28 hai góc trái |

## Nội dung
Thiết kế: tiêu đề thẻ 3 "TRANSFERENCIA TÉCNICA MEDIANTE" thiếu vế sau, mô tả thẻ 4 bị cắt
("…reportar con transparencia a"). Nội dung mặc định đã hoàn thiện câu và đánh dấu chờ TBAgri duyệt.

## Mobile (<1024px)
Một cột: tiêu đề → nhóm → thẻ (≥640px: 2 cột) → ảnh bo 28 bốn góc.

## Tiêu chí đạt
- [ ] `npm run compare -- s11`: cao lệch ≤ 2px; tiêu đề, thẻ, ảnh đúng vị trí (±3px)
- [ ] Ảnh nông dân chạm mép phải ở 1250px và 1440px
- [ ] 390px: thẻ không bị chữ tràn, huy hiệu không bị cắt
