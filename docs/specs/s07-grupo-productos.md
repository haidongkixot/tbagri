# s07 — Grupo de productos y servicios (ảnh + stepper 6 nhóm sản phẩm)

## Mục tiêu
Giới thiệu 6 nhóm sản phẩm/dịch vụ trong một khung gọn: người xem bấm số hạt lúa để đổi
ảnh và mô tả. Nút xanh dẫn tới form liên hệ. Đây là đích của menu "Productos" (`#productos`).

## Tham chiếu
- Ảnh: `docs/design/ref/s07-grupo-productos.jpg` (1250 × 530)
- Dữ liệu: `SiteContent["productGroups"]` (title, ctaLabel) và `SiteContent["productSlides"]`
  (mỗi slide: title, description, image, `fit?` = "cover" | "contain")
- Thành phần dùng chung: `ui/Stepper.tsx` (Stepper, StepperPanel, StepperTabs),
  `ui/SlideImage.tsx` (khung ảnh bo hai góc chéo)

## Bố cục desktop (px thiết kế)
| Thành phần | Giá trị |
|---|---|
| Section | nền `green-pale`, cao 530, đệm trên 77 |
| Lưới | `container-site`, cột ảnh 450 + khoảng 64.5 + cột chữ |
| Ảnh | 450 × 418, bo 45 ở góc trên phải và dưới trái, hai góc kia vuông |
| Tiêu đề h2 | `title-side`: Lora 700 in hoa 33/40, navy, 2 dòng, đỉnh chữ cách đỉnh section 86 |
| Nút | `btn-green` 406 × 45, chữ 14.5px, cách tiêu đề 21 |
| Tên nhóm (h3) | `title-caps` 16.5/20, cách nút 32 |
| Mô tả | `text-body` 13.4/15.25, rộng tối đa 264, cách tên nhóm 15 |
| Stepper | 6 hạt lúa 25.5 × 33, bước 40.5; đáy cách đáy ảnh 36 (luôn bám đáy dù mô tả dài/ngắn) |

## Stepper hạt lúa
- Hạt nghiêng ~25°, viền xanh 1px; số Montserrat 700 14px màu xanh.
- Đang chọn: tô đầy xanh, số trắng. Hover: tô xanh nhạt 15%.
- Đổi bước: ảnh và chữ hiện lại với hiệu ứng `animate-fade-in` (0.35s, tắt khi giảm chuyển động).

## Ảnh `fit`
- `cover` (mặc định): ảnh chụp lấp đầy khung.
- `contain`: ảnh bao bì (bao phân, chai thuốc) đặt trên nền trắng, chừa lề 8% để không bị cắt.

## Mobile (<1024px)
Tiêu đề → nút (rộng hết) → ảnh (giữ tỉ lệ 450/418) → tên nhóm + mô tả → stepper. Mỗi nút
số có vùng bấm 44 × 44.

## Trợ năng
- Mẫu Tabs WAI-ARIA: `role="tablist"` (nhãn = tiêu đề section), nút `role="tab"` có tên
  "3. Protección de cultivos", phần chữ là `role="tabpanel"`.
- Phím ← → (vòng tròn), Home, End; chỉ tab đang chọn có `tabIndex=0`.
- Ảnh của bước không hiển thị dùng `hidden` nên trình đọc màn hình bỏ qua.

## Tiêu chí đạt
- [ ] `npm run compare -- s07`: cao lệch ≤ 2px, ảnh/tiêu đề/nút/stepper đúng vị trí
- [ ] Bấm số 3 → đổi ảnh và chữ; phím → chuyển sang 4 và focus theo
- [ ] Ảnh bao bì (bước 2, 3, 6) hiện trọn, không bị cắt
