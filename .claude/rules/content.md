---
paths:
  - "src/content/**"
  - "src/i18n/**"
  - "src/cms/**"
---
# Quy tắc nội dung và đa ngôn ngữ

- Chữ hiển thị cho khách là `L10n` `{ es, en }`. Tiếng Tây Ban Nha là bản gốc, không được để trống.
- Văn phong: trang trọng, ngắn gọn, đúng chính tả Tây Ban Nha (dấu ¿ ¡ á é í ó ú ñ).
- Thêm trường nội dung mới phải cập nhật đủ 4 nơi: `types.ts`, `defaults.ts`, `src/cms/config.ts`
  và component hiển thị (skill `cms-field` hướng dẫn chi tiết).
- Nội dung giả định đánh dấu `// MẪU` để TBAgri duyệt.
