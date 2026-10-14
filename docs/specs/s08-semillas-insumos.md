# s08 — Semillas e insumos (stepper 5 giải pháp vật tư)

## Mục tiêu
Nối tiếp s07 trên cùng nền xanh nhạt, đảo bố cục (chữ trái, ảnh phải) để trang không đơn điệu.
Trình bày 5 giải pháp vật tư nông nghiệp theo stepper hạt lúa.

## Tham chiếu
- Ảnh: `docs/design/ref/s08-semillas-insumos.jpg` (1250 × 425)
- Dữ liệu: `SiteContent["seedsInputs"]` (title) và `SiteContent["inputSlides"]` (5 slide như s07)
- Thành phần dùng chung: `ui/Stepper.tsx`, `ui/SlideImage.tsx` (tái sử dụng từ lab 06 — s07)

## Bố cục desktop (px thiết kế)
| Thành phần | Giá trị |
|---|---|
| Section | nền `green-pale`, cao 425, đệm trên 48 |
| Lưới | `container-site`, cột chữ co giãn + cột ảnh 450 (sát mép phải khung) |
| Ảnh | 450 × 348, bo 45 góc trên phải và dưới trái |
| Tiêu đề h2 | `title-side` 33/40, 1 dòng, đỉnh chữ cách đỉnh section 57 |
| Tên giải pháp (h3) | `title-caps` 16.5/20, rộng tối đa 232 → 2 dòng, cách tiêu đề 36 |
| Mô tả | `text-body` 13.4/15.25, rộng tối đa 288, cách h3 24 |
| Stepper | 5 hạt lúa, đáy cách đáy ảnh 66 |

## Nội dung
Bản thiết kế viết thường "antes/después…" ở đầu câu; nội dung mặc định sửa thành
"Antes/después…" cho đúng chính tả. Các slide 2–5 là `// MẪU` chờ TBAgri duyệt.

## Mobile (<1024px)
Tiêu đề → ảnh → tên giải pháp + mô tả → stepper.

## Trợ năng
Giống s07 (Tabs WAI-ARIA, phím mũi tên, Home/End).

## Tiêu chí đạt
- [ ] `npm run compare -- s08`: cao lệch ≤ 2px, mô tả ngắt 4 dòng như thiết kế
- [ ] Hai stepper s07 và s08 hoạt động độc lập (đổi s07 không ảnh hưởng s08)
- [ ] 390px: không tràn ngang, nút số dễ bấm
