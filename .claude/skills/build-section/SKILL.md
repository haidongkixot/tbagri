---
name: build-section
description: Quy trình dựng một section của website TBAgri từ spec và ảnh thiết kế, có kiểm chứng bằng ảnh chụp. Gọi bằng /build-section <mã>, ví dụ /build-section s04.
argument-hint: "<mã section, ví dụ s04>"
disable-model-invocation: true
---

# Dựng section $ARGUMENTS

Làm lần lượt, không bỏ bước:

1. **Đọc**
   - `docs/specs/$ARGUMENTS*.md` (spec), ảnh `docs/design/ref/$ARGUMENTS*.jpg`.
   - Phần nội dung tương ứng trong `src/content/types.ts` và `src/content/defaults.ts`.
   - Skill `tbagri-design` cho quy ước token và đơn vị.
2. **Lập kế hoạch** (trả lời ngắn, chờ người dùng đồng ý nếu đang ở Plan mode):
   - Tên component, tệp sẽ tạo/sửa, phần nào là Server/Client Component.
   - Bảng số đo chính (px thiết kế → rem).
   - Tài nguyên ảnh dùng từ `public/images/`.
3. **Dựng**
   - Tạo `src/components/sections/<Ten>.tsx`, nhận props kiểu `PageContent["<khóa>"]`.
   - Tương tác (nếu có) tách sang `src/components/ui/`.
   - Gắn vào `src/app/[locale]/page.tsx` đúng thứ tự section.
4. **Kiểm tra kỹ thuật**: `npm run typecheck` và `npm run lint` phải sạch.
5. **Kiểm chứng giao diện**
   - `npm run compare -- $ARGUMENTS` rồi mở ảnh trong `.compare/` để so.
   - Ghi bảng chênh lệch (vị trí, cỡ chữ, màu, khoảng cách) và sửa đến khi khớp.
   - Kiểm tra bề rộng 390px và dùng phím Tab qua các phần tương tác.
6. **Báo cáo** theo mẫu:
   ```
   ## $ARGUMENTS — xong
   - Tệp: …
   - Kiểm chứng: typecheck ✓, lint ✓, compare (lệch tối đa …px), mobile ✓, bàn phím ✓
   - Còn lại / cần người dùng quyết: …
   ```
Không commit; đề xuất thông điệp commit `lab-XX: dựng section $ARGUMENTS`.
