# s05 — Filosofía de implementación (chữ + carousel ảnh)

## Mục tiêu
Nói ngắn gọn cách TBAgri triển khai: không chỉ bán hàng mà đi kèm đào tạo, theo dõi và cải tiến
sau mỗi vụ. Carousel ảnh thật làm bằng chứng.

## Tham chiếu
- Ảnh: `docs/design/ref/s05-filosofia.jpg` (1250 × 248)
- Dữ liệu: `SiteContent["philosophy"]` (title, text) và `SiteContent["philosophySlides"]`
  (mỗi slide: label, image { src, alt })
- Tài nguyên: `philosophy-1..3.webp`
- Thành phần dùng chung: `src/components/ui/Carousel.tsx` (Carousel, CarouselTrack, CarouselButton)

## Bố cục desktop (px thiết kế)
| Thành phần | Giá trị |
|---|---|
| Section | nền trắng, cao 248 |
| Lưới | `container-site`, 2 cột: 321 (chữ) + phần còn lại (carousel) |
| Tiêu đề | cách đỉnh 31, Montserrat 700 in hoa 16/20, navy, rộng tối đa 224 (2 dòng) |
| Đoạn văn | cách tiêu đề 15, Montserrat 450 13.4/15.5, rộng tối đa 256, `text-wrap: balance` → 5 dòng |
| Nút trước/sau | vòng tròn 27, viền xanh 1.5px, cách đoạn văn 21, cách nhau 10 |
| Track | bắt đầu ở x = 481, cách đỉnh 23, **tràn ra mép phải màn hình** |
| Slide | 248 × 199, bo 28 trừ góc dưới phải, khoảng cách 20 |
| Nhãn slide | góc dưới phải, nền xanh, bo trên trái 14, Montserrat 600 15/20 trắng |

## Hành vi
- Cuộn ngang có snap; nút trước/sau cuộn đúng một slide (bề rộng slide + gap).
- Nút ở đầu/cuối bị vô hiệu (`disabled`, mờ 50%). Thiết kế tĩnh vẽ cả hai nút đậm — đây là
  khác biệt có chủ đích để người dùng biết đã hết ảnh.
- Tôn trọng `prefers-reduced-motion`: cuộn tức thì, không trượt mượt.
- Thêm/bớt slide trong CMS không cần sửa code.

## Mobile (<1024px)
Một cột: tiêu đề → đoạn văn → track (mỗi slide rộng 78%, thấy mép slide sau để gợi ý vuốt)
→ nút trước/sau 44px.

## Trợ năng
- Vùng `role="region"` + `aria-roledescription="carousel"` + `aria-label` = tiêu đề.
- Mỗi slide `aria-roledescription="slide"` và nhãn "1 / 3: Capacitación".
- Track có `tabIndex=0` để cuộn bằng phím mũi tên; nút có `aria-label` "Anterior/Siguiente".

## Tiêu chí đạt
- [ ] `npm run compare -- s05`: cao lệch ≤ 2px, đoạn văn ngắt đúng 5 dòng như thiết kế
- [ ] Bấm "Siguiente" 2 lần → tới slide cuối, nút "Siguiente" bị vô hiệu
- [ ] Tab tới track, nhấn → cuộn được; 390px không tràn ngang trang
