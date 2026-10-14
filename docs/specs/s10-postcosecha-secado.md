# s10 — Procesamiento poscosecha (dây chuyền 8 bước) + Soluciones de secado

## Mục tiêu
Cho thấy TBAgri lo trọn khâu sau thu hoạch: 8 bước từ thu hoạch tới phân phối, rồi đi sâu vào
4 nhóm giải pháp (sấy, đóng gói, xay xát, tổ chức kho) bằng tab dọc.

## Tham chiếu
- Ảnh: `docs/design/ref/s10-postcosecha-secado.jpg` (1250 × 1189)
- Dữ liệu: `SiteContent["postHarvest"]` (title), `SiteContent["postHarvestSteps"]` (8 mục: label,
  image) và `SiteContent["dryingSolutions"]` (label, description, image, fit?)
- Tài nguyên: `postharvest-1..8.webp`, `drying-grain.webp`, `drying-field.webp`, `deco-rice-stems.png`
- Thành phần dùng chung: `ui/Stepper.tsx` (`StepperPanel`, `StepperList` — tab dọc, thêm ở lab 08)

## Nền và khung (px thiết kế)
| Thành phần | Giá trị |
|---|---|
| Section | nền `green-pale`, đệm trên 7 → tấm trắng cao 1182, bo góc trên trái 180 |
| Thân bông lúa | `deco-rice-stems.png` 75 × 25 tại x = 80 canvas, nằm dưới tấm trắng (nối tiếp bông lúa s09) |
| Ảnh cánh đồng | `drying-field.webp` phủ đáy tấm trắng, cao 535, `object-right-bottom` |
| Tiêu đề h2 | `title-side` căn giữa, rộng tối đa 520 → 3 dòng, đỉnh chữ y = 76 |

## Dây chuyền 8 bước
- Lưới 4 cột × 244 (rộng 976, bắt đầu x = 118 — lệch trái 19 so với tâm, đúng như thiết kế).
- Hàng 1: bước 1 → 4 trái sang phải. Hàng 2: bước 5 → 8 **phải sang trái** (đặt bằng
  `col-start`, thứ tự DOM vẫn 1 → 8 để trình đọc màn hình đọc đúng).
- Ô icon 168 × 164, ảnh `object-contain object-bottom` + `img-multiply`.
  **Quy ước ảnh icon**: khung 336 × 328 (2x), nền trắng, vật thể sát đáy và căn giữa —
  nhờ vậy mọi icon dùng chung một khung mà vẫn giữ đúng tỉ lệ.
- Nhãn: "N. " + label, Montserrat 500 15/19 navy, căn giữa; xuống dòng bằng `\n` trong nội dung
  (`whitespace-pre-line`) để khung chữ ôm sát dòng dài nhất.
- Mũi tên nét đứt (`dash-x`, `dash-y`: nét 8.5, hở 5.5, dày 2, màu `green`): chạy giữa hai nhãn,
  cách chữ 34.5 mỗi bên; đầu mũi tên tam giác 10 × 20.
- Khúc rẽ 4 → 5: nét ngang tới x = 1077, nét dọc dài 229 xuống ngang nhãn bước 5, đầu trỏ xuống.

## Khung giải pháp
| Thành phần | Giá trị |
|---|---|
| Khung xanh | x = 329.5, 291 × 406.5, nền `green-pale`, bo 40 góc trên phải + dưới trái, đệm 10 |
| Ảnh | 271 × 194.5, bo 30 hai góc chéo; đổi theo tab |
| Tab dọc | chữ 12.5/16 navy; tab chọn: đậm 600 + gạch chân navy 1.5px; tab khác: kẻ xám `line` 1px |
| Mô tả bên phải | bắt đầu x = 677; h3 `title-caps` 16.5/20; đoạn `text-body` rộng tối đa 248 |

## Mobile (<1024px)
Tấm trắng bo 80; dây chuyền thành lưới 2 cột (≥640px: 4 cột), không vẽ mũi tên; khung giải pháp
rộng hết; ảnh cánh đồng thành dải cuối section.

## Trợ năng
- Dây chuyền là `<ol>`; mũi tên `aria-hidden`.
- Tab dọc: `role="tablist"` + `aria-orientation="vertical"`, phím ↑ ↓ ← → Home End.

## Tiêu chí đạt
- [ ] `npm run compare -- s10`: cao lệch ≤ 2px; tiêu đề, nhãn, tab, mô tả lệch ≤ 3px
  (`python3 scripts/rows.py s10 <x0> <x1> navy` để đo từng hàng chữ)
- [ ] Mũi tên hàng 2 trỏ sang trái, khúc rẽ 4 → 5 liền mạch
- [ ] Chọn "Soluciones de molienda" → đổi ảnh + mô tả; ↓ tiếp tục vòng về tab đầu
