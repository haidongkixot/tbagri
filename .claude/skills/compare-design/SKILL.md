---
name: compare-design
description: So bản dựng của một section với ảnh thiết kế gốc bằng ảnh chụp cạnh nhau và tỉ lệ khác biệt điểm ảnh. Dùng khi cần kiểm chứng giao diện có giống thiết kế không.
argument-hint: "<mã section, ví dụ s07>"
allowed-tools: Bash(npm run compare *) Read
---

# So sánh với thiết kế

1. Đảm bảo `npm run dev` đang chạy (cổng 3000). Nếu chưa có Chromium cho Playwright, chạy
   `npx playwright install chromium` một lần.
2. Chạy `npm run compare -- $ARGUMENTS`. Script `scripts/compare-design.mjs` sẽ:
   - mở `/es` ở bề rộng 1250px, chụp phần tử `[data-section="$ARGUMENTS"]`,
   - ghép với `docs/design/ref/$ARGUMENTS*.jpg` thành `.compare/$ARGUMENTS.png` (trái: thiết kế,
     phải: bản dựng) và in tỉ lệ điểm ảnh khác biệt.
3. Đọc ảnh `.compare/$ARGUMENTS.png`. Liệt kê khác biệt theo bảng:

   | Vị trí | Thiết kế | Bản dựng | Cách sửa |
   |---|---|---|---|

4. Ưu tiên sửa: bố cục và kích thước khối → cỡ chữ/xuống dòng → màu → chi tiết trang trí.
5. Tỉ lệ khác biệt chỉ là gợi ý (ảnh thiết kế là JPEG nén). Mắt người quyết định cuối cùng.
