import { NotFoundView } from "@/components/layout/NotFoundView";

/** 404 khi một trang trong [locale] gọi notFound() (ví dụ ngôn ngữ không hợp lệ). */
export default function NotFound() {
  return <NotFoundView />;
}
