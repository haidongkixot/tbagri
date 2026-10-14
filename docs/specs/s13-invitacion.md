# s13 — Invitación a colaborar

## Mục tiêu
Lời mời hợp tác ngắn gọn trước footer, nút dẫn về form liên hệ.

## Tham chiếu
- Ảnh: `docs/design/ref/s13-invitacion.jpg` (1250 × 320)
- Dữ liệu: `SiteContent["invitation"]` (title, text, ctaLabel)
- Nền: dùng chung `SkyBackdrop` với s12 (phần ruộng lúa; tấm kính mờ bo góc dưới phải đã vẽ sẵn)

## Bố cục desktop (px thiết kế)
| Thành phần | Giá trị |
|---|---|
| Section | cao 320 |
| Tiêu đề h2 | `title-side`, đỉnh chữ y = 37 |
| Đoạn văn | `text-body`, rộng tối đa 424 → 3 dòng, cách tiêu đề 16.5 |
| Nút | `btn-green` 182 × 45, chữ 600, bo 10, cách đoạn văn 24 |

## Mobile (<1024px)
Nội dung nằm trong thẻ trắng mờ để đọc rõ trên nền ruộng.

## Tiêu chí đạt
- [ ] `npm run compare -- s13`: cao 320 (±1), chữ và nút lệch ≤ 3px
- [ ] Nút cuộn tới `#contacto`
