---
name: write-spec
description: Viết spec markdown cho một section hoặc tính năng mới của TBAgri theo mẫu chuẩn (mục tiêu, số đo, nội dung, tương tác, tiêu chí đạt). Dùng khi bắt đầu một phần việc chưa có spec trong docs/specs.
argument-hint: "<mã và tên, ví dụ s15-noticias>"
---

# Viết spec: $ARGUMENTS

Tạo tệp `docs/specs/$ARGUMENTS.md` theo đúng khung dưới. Đo số liệu trên ảnh thiết kế @1x
(nếu có), ghi bằng px thiết kế kèm rem. Hỏi lại người dùng những gì ảnh không thể hiện.

```markdown
# <mã> — <Tên section>

## Mục tiêu
Một đến hai câu: section giúp người xem làm/hiểu điều gì.

## Tham chiếu
- Ảnh: docs/design/ref/<mã>.jpg
- Nội dung: SiteContent["<khóa>"] (src/content/types.ts)

## Bố cục desktop (canvas 1250px)
| Khối | x | y (tính từ đỉnh section) | rộng × cao | Ghi chú |
|---|---|---|---|---|

## Chữ
| Phần tử | Utility / font | Cỡ | Màu |
|---|---|---|---|

## Mobile (<1024px)
- …

## Tương tác và trợ năng
- …

## Tiêu chí đạt
- [ ] Khớp thiết kế ở 1250px (compare lệch ≤ 8px)
- [ ] Mobile 390px không tràn ngang
- [ ] Đủ es/en, không còn chữ trong ảnh
- [ ] Bàn phím và trình đọc màn hình dùng được
```
