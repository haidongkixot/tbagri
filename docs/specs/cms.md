# CMS — sửa nội dung và tải ảnh (lab 14)

## Mục tiêu
Đội Marcomdi sửa mọi chữ/ảnh của landing và trang tiendas không cần lập trình viên; trang công
khai cập nhật ngay sau khi lưu; dữ liệu sai không thể lọt vào CSDL.

## Kiến trúc "cấu hình sinh giao diện"
| Tệp | Vai trò |
|---|---|
| `src/cms/config.ts` | **Nguồn sự thật**: 27 khối (`DocConfig`), mỗi khối liệt kê trường và kiểu ô nhập |
| `src/cms/schema.ts` | Sinh lược đồ Zod từ cấu hình (`docSchema`), mục rỗng (`emptyItem`), lỗi → danh sách |
| `components/admin/ContentEditor.tsx` | Trình sửa client: tự vẽ form từ cấu hình; state = cả khối; "Lưu và đăng" gửi JSON |
| `server/actions/content.ts` | `saveContent(key, json)`: requireAdmin → Zod → upsert `content_entries` → audit → `updateTag` · `resetContent(key)` |
| `server/actions/upload.ts` | `uploadImage(formData)`: requireAdmin → ≤ 4 MB → nhận diện JPG/PNG/WebP/AVIF bằng chữ ký tệp → Vercel Blob (có `BLOB_READ_WRITE_TOKEN`) hoặc `public/uploads/` |
| `app/admin/(panel)/content/page.tsx` | Danh sách khối theo section, ghi "Đã sửa … bởi …" |
| `app/admin/(panel)/content/[key]/page.tsx` | Trang sửa một khối, nút "Xem trên trang" tới neo tương ứng |

## Quy tắc dữ liệu
- Mọi chữ hiển thị là `{ es, en }`; **es bắt buộc**, en trống → hiển thị bản es.
- Ảnh chỉ nhận đường dẫn `/images/…`, `/uploads/…` hoặc URL `*.public.blob.vercel-storage.com`
  (`IMAGE_SRC_RE`) — chặn chèn URL lạ. Ảnh Blob phải có trong `images.remotePatterns`.
- Danh sách có `min`/`max` (ví dụ dây chuyền sau thu hoạch đúng 8 bước); mục mới tạo từ `emptyItem`.
- Lưu một khối là thay cả khối (không ghi từng ô) → đơn giản, lịch sử sửa nằm ở `audit_log`.
- `resetContent` xóa dòng trong CSDL → trang dùng lại `defaults.ts`.

## Trải nghiệm
- Thanh trạng thái dính trên: "Có thay đổi chưa lưu" / "Đã lưu lúc …"; rời trang khi chưa lưu
  → trình duyệt hỏi lại (`beforeunload`).
- Lỗi server hiện theo đường dẫn ô (`6.title.es`) và ngay dưới ô sai.
- Danh sách: mỗi mục là `<details>` (mở sẵn khi ≤ 4 mục), nút ↑ ↓ ✕, "+ Thêm mục (n/max)".
- Tải ảnh: xem trước trên nền ca-rô, thông báo lỗi định dạng/kích thước; alt es/en kèm theo.

## Tiêu chí đạt
- [ ] `/admin/content` liệt kê 27 khối theo section; mỗi khối mở được và hiện đúng dữ liệu
- [ ] Xóa trống "Dòng phụ" tiếng Tây Ban Nha → báo lỗi đúng ô; điền lại → "Đã lưu lúc …"
- [ ] Trang công khai `/es` hiện tiêu đề mới **không cần khởi động lại** (updateTag)
- [ ] Tải tệp giả `.jpg` chứa chữ → bị từ chối; tải ảnh thật → đường dẫn mới, trang hiện ảnh mới
- [ ] Thêm mục thứ 7 vào productSlides rồi lưu khi trống → lỗi `6.title.es…`
- [ ] "Khôi phục mặc định" → trang về nội dung gốc
- [ ] Không có cảnh báo "outside of <Suspense>" trong console khi chuyển trang quản trị
