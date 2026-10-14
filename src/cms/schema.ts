import { z } from "zod";
import type { DocConfig, Field } from "./config";

/**
 * Sinh lược đồ Zod từ cấu hình CMS — server dùng để kiểm tra dữ liệu trước khi lưu.
 * Thông báo lỗi bằng tiếng Việt vì chỉ hiện trong trang quản trị.
 */

/** Ảnh chỉ được lấy từ thư mục của site hoặc kho Vercel Blob (không nhận URL lạ). */
export const IMAGE_SRC_RE =
  /^(\/(images|uploads)\/[\w./-]+\.(png|jpe?g|webp|avif|svg)|https:\/\/[\w-]+\.public\.blob\.vercel-storage\.com\/[\w./%-]+)$/i;

const imageSrc = z
  .string()
  .trim()
  .regex(IMAGE_SRC_RE, { error: "Ảnh phải tải lên qua nút “Tải ảnh” hoặc nằm trong /images" });

function l10n(max: number, required = true) {
  const es = z
    .string()
    .trim()
    .max(max, { error: `Tối đa ${max} ký tự` });
  return z.object({
    es: required ? es.min(1, { error: "Bản tiếng Tây Ban Nha không được trống" }) : es,
    en: z
      .string()
      .trim()
      .max(max, { error: `Tối đa ${max} ký tự` }),
  });
}

const FORMATS = {
  email: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Email không hợp lệ"],
  phone: [/^[+()\d\s-]{6,20}$/, "Số điện thoại không hợp lệ"],
  url: [/^(https?:\/\/[^\s]+|\/[^\s]*)$/, "Đường dẫn phải bắt đầu bằng https:// hoặc /"],
  digits: [/^\d{6,15}$/, "Chỉ gồm 6–15 chữ số"],
  text: [/^[\s\S]*$/, ""],
} as const;

function fieldSchema(f: Field): z.ZodType {
  switch (f.kind) {
    case "text":
      return l10n(f.max ?? 120);
    case "textarea":
      return l10n(f.max ?? 600);
    case "textList":
      return z
        .array(l10n(600))
        .min(f.min ?? 0, { error: `Cần ít nhất ${f.min} đoạn` })
        .max(f.max ?? 10, { error: `Tối đa ${f.max} đoạn` });
    case "plain": {
      const [re, msg] = FORMATS[f.format ?? "text"];
      const base = z.string().trim().max(300, { error: "Tối đa 300 ký tự" });
      return f.optional
        ? base.refine((v) => v === "" || re.test(v), { error: msg })
        : base.min(1, { error: "Không được trống" }).regex(re, { error: msg });
    }
    case "image":
      return z.object({ src: imageSrc, alt: l10n(160) });
    case "icon":
      return imageSrc;
    case "select":
      return z.enum(f.options.map((o) => o.value) as [string, ...string[]]).optional();
  }
}

function objectSchema(fields: Field[]) {
  return z.object(Object.fromEntries(fields.map((f) => [f.name, fieldSchema(f)])));
}

export function docSchema(doc: DocConfig): z.ZodType {
  if (doc.type === "object") return objectSchema(doc.fields);
  return z
    .array(objectSchema(doc.fields))
    .min(doc.min ?? 0, { error: `Cần ít nhất ${doc.min ?? 0} mục` })
    .max(doc.max ?? 50, { error: `Tối đa ${doc.max ?? 50} mục` });
}

/** Giá trị rỗng cho một mục mới trong danh sách. */
export function emptyItem(fields: Field[]): Record<string, unknown> {
  const blank = { es: "", en: "" };
  return Object.fromEntries(
    fields.map((f) => {
      switch (f.kind) {
        case "text":
        case "textarea":
          return [f.name, { ...blank }];
        case "textList":
          return [f.name, [{ ...blank }]];
        case "image":
          return [f.name, { src: "", alt: { ...blank } }];
        case "select":
          return [f.name, f.options[0]?.value];
        default:
          return [f.name, ""];
      }
    }),
  );
}

/** Lỗi Zod → danh sách { đường dẫn, thông báo } để hiện cạnh ô nhập. */
export function issuesToList(error: z.ZodError) {
  return error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
}
