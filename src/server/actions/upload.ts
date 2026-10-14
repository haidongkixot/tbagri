"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { audit } from "@/server/audit";
import { requireAdmin } from "@/server/auth/session";

export type UploadResult = { ok: true; url: string } | { ok: false; message: string };

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

/** Nhận diện định dạng bằng "chữ ký" đầu tệp — không tin phần mở rộng hay Content-Type. */
function sniff(buf: Buffer): "jpg" | "png" | "webp" | "avif" | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return "png";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP")
    return "webp";
  if (buf.toString("ascii", 4, 12) === "ftypavif") return "avif";
  return null;
}

/**
 * Tải ảnh lên cho CMS.
 * - Có BLOB_READ_WRITE_TOKEN (Vercel) → lưu Vercel Blob, trả URL công khai.
 * - Không có (máy cá nhân) → ghi vào public/uploads/ (chỉ dùng khi phát triển).
 * Chỉ nhận JPG/PNG/WebP/AVIF ≤ 4 MB; tên tệp do server tự đặt.
 */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const session = await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Chưa chọn tệp." };
  if (file.size > MAX_BYTES) return { ok: false, message: "Ảnh lớn hơn 4 MB. Hãy nén ảnh trước." };

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = sniff(buf);
  if (!ext) return { ok: false, message: "Chỉ nhận ảnh JPG, PNG, WebP hoặc AVIF." };
  const name = `${new Date().toISOString().slice(0, 10)}-${randomUUID().slice(0, 8)}.${ext}`;

  try {
    let url: string;
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`cms/${name}`, buf, {
        access: "public",
        contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
      });
      url = blob.url;
    } else {
      if (process.env.VERCEL) {
        return { ok: false, message: "Chưa cấu hình Vercel Blob (BLOB_READ_WRITE_TOKEN)." };
      }
      const dir = path.join(process.cwd(), "public", "uploads");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, name), buf);
      url = `/uploads/${name}`;
    }
    await audit(session.email, "image_upload", url);
    return { ok: true, url };
  } catch (err) {
    console.error("[upload] Lỗi:", err);
    return { ok: false, message: "Không tải được ảnh. Vui lòng thử lại." };
  }
}
