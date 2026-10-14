# s03 — Giới thiệu "TBAgri es un socio estratégico…"

## Mục tiêu
Giải thích TBAgri là ai, phục vụ ba nhóm đối tượng nào, và lời hứa "một đối tác – giải pháp trọn gói".

## Tham chiếu
- Ảnh: `docs/design/ref/s03-intro.jpg` (1250 × 513)
- Dữ liệu: `SiteContent["intro"]` (heading, paragraphs[2], partnerTitle, partnerText) và
  `SiteContent["audiences"]` (3 mục: label, image, icon)
- Tài nguyên: `intro-audience-1..3.webp`, `icon-audience-1..3.png`, `icon-wreath.png`

## Bố cục desktop (y tính từ đỉnh thẻ, = 557px trên canvas)
| Khối | x | y | rộng × cao | Ghi chú |
|---|---|---|---|---|
| Thẻ trắng | 216.5 | 0 | 816 × 486 | Bo 2 góc trên 18px; đè lên hero 401.5px (`margin-top: -25.09rem`) |
| Dải xanh `green` | 0 | 381.5 | 1250 × 131.5 | Full màn hình, nằm sau thẻ |
| Tiêu đề trái | tâm x 396 | dòng 1 tại 51.5 | ~235 rộng | 3 dòng, căn giữa, hoa văn tám cánh mờ phía sau |
| Đoạn văn phải | 570 | 29 | 395 rộng | 2 đoạn, cách nhau 1 dòng (15px) |
| Khung xanh `green-card` | 241 | 163 | 765 × 323 | Chạm đáy thẻ |
| 3 ảnh đối tượng | 241 / 503.5 / 764.5 | 163 | 242 × 196 | Cách nhau 20px; bo 24px góc trên-phải và dưới-trái |
| Chip navy | trùng mép trái ảnh | 161 | cao 43, rộng theo chữ | Bo góc dưới-phải 12px; chữ trắng 13px/12.8px, 2 dòng |
| Icon tròn | tâm cách mép trái ảnh 8px | — | Ø 43–44 | Lồi ra ngoài khung 13px |
| "Un solo socio" | tâm x 625 | tiêu đề ≈ 404 | — | Bông lúa nằm trái, chờm vào chữ 30px |

## Chữ
| Phần tử | Font | Cỡ / dòng | Màu |
|---|---|---|---|
| Tiêu đề trái (h2) | Montserrat 600 | 17px / 19px | navy |
| Đoạn văn | Montserrat 400 | 12.6px / 15px | navy |
| Chip | Montserrat 600 | 13px / 12.8px | trắng |
| UN SOLO SOCIO… | Montserrat 600, in hoa | 16.8px | navy |
| Dòng mô tả dưới | Montserrat 400 | 13px / 14.4px | navy |

## Nội dung
- Nhãn chip có thể chứa xuống dòng `\n` để chip rộng vừa chữ (ví dụ `"Dirigido a\nagricultores"`).
- Thiết kế viết "contecnología" → sửa "con tecnología". Chip thứ ba "…socios que buscan" chưa
  trọn câu → giữ nguyên, ghi vào danh sách cần TBAgri xác nhận.

## Mobile (<1024px)
Thẻ full rộng, không đè hero; tiêu đề → đoạn văn → khung xanh bo 16px; 3 ảnh xếp dọc (≥640px: 3 cột);
"Un solo socio": bông lúa nằm trên chữ.

## Tiêu chí đạt
- [ ] `npm run compare -- s03` lệch ≤ 8px; đáy thẻ ở 486px, dải xanh bắt đầu 381.5px
- [ ] Chip không che mặt người trong ảnh; icon tròn không bị cắt
- [ ] Ảnh có alt mô tả; icon tròn và bông lúa `alt=""`
