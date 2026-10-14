---
name: tbagri-design
description: Hệ thống thiết kế TBAgri — màu, font, cỡ chữ, khung 925px, bo góc, cách đổi số đo thiết kế sang rem và cách dựng section giống file thiết kế. Dùng khi tạo hoặc sửa bất kỳ giao diện nào của website TBAgri.
---

# Hệ thống thiết kế TBAgri

## Nguồn sự thật
1. Ảnh thiết kế: `docs/design/ref/<mã>.jpg` (rộng 1250px = @1x). Ảnh toàn trang: `full-page.jpg`.
2. Token: `docs/design/tokens.md` và khối `@theme` trong `src/app/globals.css`.
3. Spec section: `docs/specs/<mã>.md` — có số đo đã đo sẵn.

## Đổi số đo
- Lấy số đo px trên ảnh @1x → chia 16 ra rem. Ví dụ: 452px → `28.25rem`.
- Tailwind v4: `w-[28.25rem]`, `mt-[2.5rem]`; khoảng cách tròn bội số 4px dùng thang sẵn
  (`mt-6` = 24px = 1.5rem).
- Không dùng px cho bố cục: cỡ chữ gốc co giãn trên desktop để giữ đúng tỉ lệ.

## Thành phần lặp lại trong thiết kế
| Thành phần | Cách dựng |
|---|---|
| Tiêu đề Lora in hoa giữa trang | `<h2 className="title-display text-center">` |
| Tiêu đề Lora cạnh ảnh | `title-side` |
| Tiêu đề nhỏ Montserrat in hoa | `title-caps` |
| Đoạn văn | `text-body` (màu `text-ink` hoặc `text-navy` theo ảnh) |
| Nút xanh | `btn-green` |
| Ảnh bo góc lệch (1 góc vuông) | `rounded-[var(--radius-photo)]` + `rounded-bl-none`… theo ảnh |
| Chấm số hình hạt gạo (stepper) | `src/components/ui/RiceStepper.tsx` |
| Mũi tên carousel | `src/components/ui/Carousel.tsx` |

## Mobile (<1024px)
- Một cột, ảnh trên chữ dưới, khoảng đệm hai bên 16px.
- Chữ đoạn văn ≥15px, tiêu đề display 28px.
- Carousel thành thanh cuộn ngang có snap; wheel 12 bước thành lưới 2 cột.

## Tự kiểm tra
- Chạy `npm run compare -- <mã>`: so ảnh thiết kế (trái) và bản dựng (phải) ở 1250px.
- Lệch > 8px về vị trí, sai màu, sai font, thiếu chữ → sửa trước khi báo xong.
