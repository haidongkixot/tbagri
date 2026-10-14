# Trang "Nuestras tiendas", trang 404 và SEO

## Nuestras tiendas — `/[locale]/tiendas`
- Thiết kế không vẽ trang này → dựng theo hệ thống thiết kế: nền `bg-sky-soft`, `title-display`,
  thẻ trắng bo 45 hai góc chéo (giống khung ảnh slider), nút `btn-green` "Ver en el mapa".
- Dữ liệu: `SiteContent["stores"]` (name, address, phone, hours, mapUrl) — sửa ở CMS từ lab 14.
- Header đổi ngôn ngữ giữ nguyên trang (`/en/tiendas`); nút liên hệ nổi dẫn về `/<locale>#contacto`.

## 404
- `src/app/global-not-found.tsx` (bật `experimental.globalNotFound`): mọi đường dẫn không khớp,
  ví dụ `/es/khong-co` → 404 song ngữ, trạng thái HTTP 404, `noindex`.
- `src/app/[locale]/not-found.tsx`: khi trang gọi `notFound()`.
- Cả hai dùng chung `components/layout/NotFoundView.tsx`.

## SEO
- `generateMetadata` ở layout: title/description theo ngôn ngữ (sửa trong CMS → settings),
  `canonical`, `hreflang` es/en/x-default, Open Graph.
- `/sitemap.xml` (`src/app/sitemap.ts`): `/es`, `/en`, `/es/tiendas`, `/en/tiendas` kèm hreflang.
- `/robots.txt` (`src/app/robots.ts`): cho phép tất cả, chặn `/admin`, `/api`.
- JSON-LD `Organization` ở trang chủ (tên, logo, email, điện thoại, địa chỉ, mạng xã hội).
- Biến môi trường `NEXT_PUBLIC_SITE_URL` = địa chỉ thật khi deploy (xem `.env.example`).

## Tiêu chí đạt
- [ ] `npm run build` thành công; `/es`, `/en`, `/es/tiendas`, `/en/tiendas` là trang tĩnh (○)
- [ ] `/es/khong-co` trả 404 với trang song ngữ
- [ ] `/sitemap.xml`, `/robots.txt` đúng nội dung
- [ ] Không có trang nào tràn ngang ở 360, 390, 768, 1024, 1280, 1440, 1920px
