/**
 * Hợp đồng dữ liệu của form liên hệ — dùng chung cho giao diện (client) và Server Action.
 * Không import mã chỉ chạy ở server vào đây.
 */
export const SEGMENTS = ["agricultor", "cooperativa", "autoridad", "empresa", "otro"] as const;
export type Segment = (typeof SEGMENTS)[number];

export const INTERESTS = [
  "insumos",
  "maquinaria",
  "poscosecha",
  "digitalizacion",
  "asistencia",
  "paquete",
] as const;
export type Interest = (typeof INTERESTS)[number];

export const LEAD_FIELDS = [
  "name",
  "organization",
  "segment",
  "email",
  "phone",
  "interest",
  "message",
  "consent",
] as const;
export type LeadField = (typeof LEAD_FIELDS)[number];

/** Mã lỗi — giao diện đổi mã thành câu chữ theo ngôn ngữ (src/i18n/dictionaries.ts → form.errors). */
export type LeadErrorCode =
  "required" | "email" | "phone" | "tooShort" | "tooLong" | "consent" | "generic" | "rateLimited";

export type LeadState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      formError?: LeadErrorCode;
      fieldErrors: Partial<Record<LeadField, LeadErrorCode>>;
      /** Giá trị đã nhập, để điền lại form khi có lỗi (React reset form sau mỗi lần gửi). */
      values: Partial<Record<LeadField, string>>;
      /** Mốc thời gian lần gửi — làm `key` để form dựng lại với giá trị vừa nhập. */
      submittedAt: number;
    };

export const initialLeadState: LeadState = { status: "idle" };
