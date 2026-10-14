import type { SiteContent } from "./types";

type Row = { key: string; data: unknown };

/**
 * Ghép nội dung trong CSDL lên nội dung mặc định.
 * - Khóa lạ (không có trong SiteContent) → bỏ qua.
 * - Danh sách (mảng) → thay nguyên danh sách.
 * - Section (đối tượng) → trộn nông `{ ...mặc định, ...CSDL }`: trường mới thêm vào code mà
 *   CSDL chưa có vẫn hiển thị giá trị mặc định thay vì bị trống.
 * - Kiểu không khớp (mảng ↔ đối tượng) → giữ mặc định và cảnh báo.
 * Hàm thuần, không đụng CSDL → dễ viết test (lab 15).
 */
export function mergeWithDefaults(rows: Row[], defaults: SiteContent): SiteContent {
  const out: Record<string, unknown> = { ...defaults };
  for (const { key, data } of rows) {
    if (!(key in defaults)) continue;
    const base = (defaults as Record<string, unknown>)[key];
    if (Array.isArray(base)) {
      if (Array.isArray(data)) out[key] = data;
      else console.warn(`[content] "${key}" phải là danh sách — dùng mặc định`);
    } else if (isObject(base)) {
      if (isObject(data)) out[key] = { ...base, ...data };
      else console.warn(`[content] "${key}" phải là đối tượng — dùng mặc định`);
    }
  }
  return out as SiteContent;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
