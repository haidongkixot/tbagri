# s04 — Solución integral (vòng 12 bước canh tác lúa)

## Mục tiêu
Cho thấy TBAgri có giải pháp ở **mọi** bước của vụ lúa, từ chẩn đoán đất đến đưa gạo ra thị trường.

## Tham chiếu
- Ảnh: `docs/design/ref/s04-solucion-integral.jpg` (1250 × 820)
- Dữ liệu: `SiteContent["cycle"]` (title, startLabel, centerTitle, centerText) và
  `SiteContent["cycleSteps"]` (12 mục: label, icon)
- Tài nguyên: `icon-cycle-01..12.png` (nền trong suốt), `sky-soft.webp` (nền mây), `icon-wreath.png`

## Vì sao dựng bằng SVG thay vì dán ảnh
- Chữ trong ảnh không dịch, không sửa được qua CMS, mờ trên màn hình nét cao.
- SVG vẽ theo dữ liệu: thêm/bớt bước thì vòng tự chia lại; mỗi ô = 360° / số bước.

## Hình học (px thiết kế, gốc ở tâm vòng; tâm cách đỉnh section 455px, căn giữa ngang)
| Thành phần | Giá trị |
|---|---|
| Đĩa xanh ngoài | bán kính 333, màu #bee8fb (độ mờ 0.85) |
| Vòng xanh đậm hơn quanh tâm | bán kính 178, màu #b4e6fd |
| Vòng tròn giữa | bán kính 148, nền #f2faff, viền trắng 2px |
| Ô bước (vòng 12 cạnh) | cạnh trong cách tâm 180, cạnh ngoài 286; khe 2 × 1.6° |
| Mũi tên nối ô | nhô 3.2° ở giữa cạnh trước, ô sau có rãnh tương ứng |
| Khung viền trắng | cùng hình ô, phóng 1.045 và dịch ra ngoài 4px, nét 2px |
| Nhãn + icon | đặt tại bán kính 233, xếp dọc (chữ trên, icon cao 46px dưới) |
| Ô 1 | nằm ngay bên trái điểm 12 giờ; các ô đi theo chiều kim đồng hồ |
| Màu ô 1→12 | #c2e0b8 ×4 → #d9edd4 ×3 → #e6f3e2 → #eef6eb → #f3f8f1 → #fafcf9 → #fff |
| "INICIO DE CICLO →" | chạy trên cung bán kính 300 từ −125° đến −80°, Lora 700 15.5px navy |

## Chữ
| Phần tử | Font | Cỡ / dòng | Màu |
|---|---|---|---|
| Tiêu đề h2 | Lora 700, in hoa | 36.8px | navy |
| Nhãn bước | Montserrat 400 | 13px / 15.2px, tối đa ~102px rộng | navy |
| Tiêu đề giữa | Montserrat 600, in hoa | 21px / 25px | navy |
| Câu giữa | Montserrat 400 | 14px / 17.6px | navy |

## Mobile (<1024px)
Không vẽ vòng (quá nhỏ để đọc). Thay bằng: thẻ trắng chứa tiêu đề giữa + lưới 2 cột (≥640px: 3 cột)
các bước, mỗi ô dùng đúng màu nền theo thứ tự như trên vòng.

## Trợ năng
- Các bước là `<ol>` có số thứ tự → trình đọc màn hình đọc đúng trình tự.
- SVG trang trí `aria-hidden`; chữ thật nằm trong HTML.

## Tiêu chí đạt
- [ ] `npm run compare -- s04`: đĩa ngoài và vòng giữa lệch ≤ 4px, nhãn đúng ô
- [ ] Đổi số bước trong `defaults.ts` (ví dụ 10) → vòng vẫn cân đối
- [ ] Mobile: lưới bước đọc rõ, không tràn ngang
