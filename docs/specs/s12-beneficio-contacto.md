# s12 — Beneficio y contacto (accordion lợi ích + form liên hệ)

## Mục tiêu
Nêu lợi ích cho từng nhóm đối tượng và thu thông tin khách hàng tiềm năng (lead).
Đây là đích của menu "Contacto" và mọi nút "Contáctenos…" (`#contacto`).

## Tham chiếu
- Ảnh: `docs/design/ref/s12-beneficio-contacto.jpg` (1250 × 491)
- Dữ liệu: `SiteContent["benefits"]` (title), `SiteContent["benefitItems"]` (title, description),
  `SiteContent["contact"]` (title, intro); nhãn form trong `src/i18n/dictionaries.ts → form`
- Nền: `benefit-invite-bg.webp` dùng chung với s13 qua `layout/SkyBackdrop.tsx`
  (tấm kính mờ bên trái **đã vẽ sẵn trong ảnh**, bo góc 48 trên phải)
- Thành phần: `ui/Accordion.tsx`, `forms/ContactForm.tsx`, `lib/lead.ts`, `server/actions/submit-lead.ts`

## Bố cục desktop (px thiết kế)
| Thành phần | Giá trị |
|---|---|
| Section | cao 491 (tối thiểu; cao thêm khi form hiện lỗi) |
| Tiêu đề h2 | `title-side`, x = 160, đỉnh chữ y = 72 |
| Accordion | rộng 388, mục đầu mở sẵn; mỗi mục đóng cao 65; kẻ dưới 1.5px màu `line` |
| Tiêu đề mục | `title-caps` 16.5/20 navy; mũi tên xanh 12.5 × 7 bên phải, lật lên khi mở |
| Nội dung mục | `text-body`, rộng tối đa 368, cách tiêu đề 10, cách kẻ dưới 27 |
| Form (bổ sung) | thẻ trắng 90% + blur, rộng 385, sát mép phải khung, y = 20 → 474, bo 24 |

## Form — vì sao thêm và quy ước
Thiết kế chỉ vẽ phần lợi ích; vùng trời bên phải để trống. Form được đặt vào đó, cùng phong cách
kính mờ, không làm thay đổi chiều cao section ở trạng thái thường.
- Trường: nombre*, organización, correo*, teléfono, usted es* (segment), interés principal,
  mensaje* (≥10 ký tự), consentimiento*, ẩn: `locale`, bẫy bot `website`.
- Kiểm tra ở server (Server Action); lỗi trả về **mã** (`required`, `email`…) → giao diện đổi
  thành câu theo ngôn ngữ. Ô sai có `aria-invalid` + `aria-describedby`, focus vào ô sai đầu tiên.
- Thành công: thay form bằng thông báo `role="status"`.
- Nút có `data-interest="maquinaria"` (s09), `"paquete"` (s07) → bấm là điền sẵn "Interés principal".

## Back-end (lab 12)
`src/server/actions/submit-lead.ts` — Server Action công khai:
1. **Bẫy bot**: ô ẩn `website` có giá trị → trả "thành công" nhưng không lưu.
2. **Kiểm tra** bằng `leadSchema` (Zod, `src/lib/lead-schema.ts`); lỗi → mã theo từng trường.
3. **Giới hạn tần suất**: 5 lần/giờ/IP (`src/server/rate-limit.ts`, bảng `rate_limits`).
   IP được băm SHA-256 kèm muối `IP_HASH_SALT` — không lưu IP thật.
4. **Lưu** bảng `leads` (status mặc định `nuevo`, email chữ thường).
5. **Email báo** qua Resend nếu có `RESEND_API_KEY` + `LEAD_NOTIFY_TO`, chạy bằng `after()`
   sau khi đã phản hồi người dùng; lỗi gửi mail chỉ ghi log.
Lỗi bất ngờ (CSDL…) → `formError: "generic"`, chi tiết chỉ ghi `console.error` ở server.

## Mobile (<1024px)
Accordion và form là hai thẻ trắng mờ xếp dọc; ô nhập cao 44, chữ 15.

## Tiêu chí đạt
- [ ] `npm run compare -- s12`: cao 491 (±1); tiêu đề, các mục và đường kẻ lệch ≤ 2px
- [ ] Mở mục 3 → mục 1 đóng; Tab tới tiêu đề mục, Enter/Space mở/đóng
- [ ] Gửi form trống → thông báo lỗi + focus "Nombre"; điền đủ → thông báo cảm ơn
- [ ] Bấm nút ở s09 → cuộn tới form, "Interés principal" = Maquinaria
- [ ] Gửi hợp lệ → có dòng mới trong `leads`; gửi lần thứ 6 trong 1 giờ → thông báo "varias solicitudes"
- [ ] Điền ô ẩn `website` (giả lập bot) → báo thành công nhưng không có dòng mới
