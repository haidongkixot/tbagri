import Image from "next/image";
import type { ImageFit } from "@/content/types";

/**
 * Khung ảnh bo hai góc chéo (trên phải + dưới trái, 45px thiết kế) dùng cho s07, s08.
 * `fit="contain"` dành cho ảnh bao bì: đặt trên nền trắng, giữ trọn sản phẩm.
 */
export function SlideImage({
  src,
  alt,
  fit = "cover",
  sizes,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  fit?: ImageFit;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-tr-[2.8125rem] rounded-bl-[2.8125rem] ${
        fit === "contain" ? "bg-white" : "bg-sky-50"
      } ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={fit === "contain" ? "object-contain p-[8%]" : "object-cover"}
      />
    </div>
  );
}
