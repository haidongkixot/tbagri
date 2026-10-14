---
name: mbrt-prompt
description: Viết lại một yêu cầu thô thành prompt MBRT 2.0 bảy phần (Mục tiêu, Bối cảnh, Tham chiếu, Ràng buộc, Tiêu chí, Quy trình, Kiểm chứng) trước khi giao việc lớn cho Claude. Gọi bằng /mbrt-prompt <yêu cầu>.
argument-hint: "<yêu cầu viết bằng lời thường>"
disable-model-invocation: true
---

# Chuyển yêu cầu thành prompt MBRT 2.0

Yêu cầu gốc: $ARGUMENTS

Đọc nhanh CLAUDE.md, PRD và spec liên quan để điền đúng bối cảnh, rồi trả về **một** prompt
trong khối code, theo mẫu:

```
## Mục tiêu
<kết quả cuối cùng, đo được>

## Bối cảnh
<đang ở lab nào, phần nào đã có, ai dùng tính năng này>

## Tham chiếu
@docs/specs/... @docs/design/ref/... @src/...

## Ràng buộc
- <công nghệ, phạm vi tệp được sửa, điều cấm>

## Tiêu chí đạt
- [ ] <tiêu chí kiểm tra được>

## Quy trình
1. Đọc tham chiếu, nêu kế hoạch, chờ tôi duyệt.
2. Làm từng bước, chạy npm run typecheck sau mỗi bước.

## Kiểm chứng
<lệnh/ảnh chụp/thao tác chứng minh đã xong>
```

Sau prompt, liệt kê tối đa 3 câu hỏi nếu yêu cầu gốc còn mơ hồ. Không tự thực hiện yêu cầu.
