# Nút "Contáctanos" nổi

## Mục tiêu
Luôn có lối tắt tới form liên hệ khi khách đang đọc giữa trang.

## Tham chiếu
- Ảnh: thấy ở góc phải section s04 (`docs/design/ref/s04-solucion-integral.jpg`, x 927–1085, cao 49)

## Hành vi
- Ẩn khi đang ở đầu trang; hiện (trượt lên + rõ dần) khi đã cuộn quá 480px.
- Vị trí cố định: đáy 20px; mép phải trùng mép phải khung 925px (màn nhỏ: cách mép 16px).
- Nền navy, chữ trắng Montserrat 600 15px, biểu tượng điện thoại; bo trái 10px.
- Bấm → cuộn tới `#contacto`.

## Trợ năng
Khi ẩn: `aria-hidden` và `tabIndex=-1` để không bị Tab tới.
