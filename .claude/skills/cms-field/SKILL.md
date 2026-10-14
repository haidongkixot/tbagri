---
name: cms-field
description: Thêm hoặc sửa một trường nội dung có thể chỉnh trong trang quản trị TBAgri (section đơn hoặc danh sách), giữ đồng bộ kiểu dữ liệu, nội dung mặc định, cấu hình CMS và giao diện.
argument-hint: "<khóa nội dung và mô tả, ví dụ hero.badge — nhãn nhỏ trên tiêu đề>"
---

# Thêm/sửa trường CMS: $ARGUMENTS

Cập nhật đủ bốn nơi, theo thứ tự:

1. `src/content/types.ts` — thêm trường vào kiểu (chữ hiển thị dùng `L10n`, ảnh dùng `ImageRef`).
2. `src/content/defaults.ts` — giá trị mặc định có đủ `es` và `en`.
3. `src/cms/config.ts` — thêm vào `fields` của khối tương ứng. Các `kind` có sẵn:
   `text` (1 dòng es/en, có `max`) · `textarea` (nhiều dòng es/en) · `textList` (mảng đoạn es/en)
   · `plain` (chuỗi không dịch: `format` email/phone/url/digits, `optional`) · `image` (src + alt es/en)
   · `icon` (chỉ src) · `select` (`options`). Lược đồ Zod tự sinh từ đây (`src/cms/schema.ts`).
   Khối mới: thêm một `DocConfig` với `key` đúng tên khóa trong `SiteContent`, `section` (s02…),
   `type: "object" | "list"` (list cần `itemTitle`, `min`, `max`).
4. Component hiển thị trong `src/components/sections/`.

Kiểm chứng:
- Chạy `npm run typecheck` và script kiểm tra nội dung mặc định khớp lược đồ:
  `node --import tsx -e "..."` hoặc `npm test` (lab 15 có test `cms.schema.test.ts`).
- Nội dung đã lưu trong CSDL thiếu trường mới sẽ tự lấy giá trị mặc định
  (`mergeWithDefaults` trong `src/content/merge.ts`) — chỉ đúng với trường trong khối `object`;
  với `list`, mục đã lưu không có trường mới thì component phải xử lý `undefined`.
- Mở `/admin/content/<khóa>` sửa thử, bấm "Lưu và đăng", xem trang công khai cập nhật.
