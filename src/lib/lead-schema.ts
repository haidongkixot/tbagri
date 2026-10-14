import { z } from "zod";
import { locales } from "@/content/types";
import { INTERESTS, SEGMENTS, type LeadErrorCode, type LeadField } from "./lead";

const PHONE_RE = /^[+()\d\s-]{6,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Lược đồ Zod của form liên hệ. Thông báo lỗi là MÃ (LeadErrorCode), không phải câu chữ:
 * giao diện tự đổi mã sang tiếng Tây Ban Nha/Anh.
 */
export const leadSchema = z.object({
  name: z.string().trim().min(1, { error: "required" }).max(120, { error: "tooLong" }),
  organization: z.string().trim().max(160, { error: "tooLong" }),
  email: z
    .string()
    .trim()
    .min(1, { error: "required" })
    .max(160, { error: "tooLong" })
    .regex(EMAIL_RE, { error: "email" }),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || PHONE_RE.test(v), { error: "phone" }),
  segment: z.enum(SEGMENTS, { error: "required" }),
  interest: z.union([z.enum(INTERESTS), z.literal("")], { error: "required" }),
  message: z.string().trim().min(10, { error: "tooShort" }).max(2000, { error: "tooLong" }),
  consent: z.literal("on", { error: "consent" }),
  locale: z.enum(locales).catch("es"),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Đọc FormData thành đối tượng thô (ô trống → ""), để Zod kiểm tra. */
export function leadFromFormData(fd: FormData) {
  const get = (k: string) => {
    const v = fd.get(k);
    return typeof v === "string" ? v : "";
  };
  return {
    name: get("name"),
    organization: get("organization"),
    email: get("email"),
    phone: get("phone"),
    segment: get("segment"),
    interest: get("interest"),
    message: get("message"),
    consent: get("consent"),
    locale: get("locale"),
  };
}

/** Lỗi Zod → mỗi trường một mã lỗi (lấy lỗi đầu tiên của trường đó). */
export function fieldErrorsFrom(error: z.ZodError): Partial<Record<LeadField, LeadErrorCode>> {
  const out: Partial<Record<LeadField, LeadErrorCode>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as LeadField;
    if (field && !out[field]) out[field] = (issue.message as LeadErrorCode) || "required";
  }
  return out;
}
