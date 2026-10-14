---
paths:
  - "src/components/**"
  - "src/app/\\[locale\\]/**"
  - "src/app/globals.css"
---
# Quy tắc giao diện TBAgri

- Trước khi sửa một section: mở `docs/specs/<mã>.md` và `docs/design/ref/<mã>.jpg`.
- Kích thước lấy từ spec (px thiết kế) và đổi sang rem (÷16). Ví dụ `w-[28.25rem]` cho 452px.
- Chỉ dùng màu/font token. Nếu thấy mã màu lạ trong code → thay bằng token gần nhất.
- Section là Server Component nhận props đã chọn ngôn ngữ. Phần tương tác (carousel, tabs,
  accordion, menu mobile) tách thành component `"use client"` nhỏ trong `src/components/ui/`.
- Mỗi section là một `<section id="...">` có tiêu đề `h2` (hero dùng `h1`). Id trùng với
  anchor trong menu: `inicio`, `introduccion`, `productos`, `contacto`.
- Ảnh: `next/image`, đặt `sizes` đúng bề rộng hiển thị; ảnh nền lớn dùng `fill` + `object-cover`
  + `priority` chỉ cho hero.
- Kiểm tra lại ở 1250px (so với ảnh thiết kế) và 390px (mobile) trước khi báo xong.
