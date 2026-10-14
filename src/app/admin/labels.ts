import type { LeadStatus } from "@/db/schema";
import type { Interest, Segment } from "@/lib/lead";

/** Nhãn tiếng Việt cho giao diện quản trị (đội Marcomdi). */
export const STATUS_LABEL: Record<LeadStatus, string> = {
  nuevo: "Mới",
  contactado: "Đã liên hệ",
  cerrado: "Đã đóng",
};
export const STATUS_STYLE: Record<LeadStatus, string> = {
  nuevo: "bg-green/15 text-green-600",
  contactado: "bg-sky-100 text-navy",
  cerrado: "bg-ink/5 text-ink/60",
};
export const SEGMENT_LABEL: Record<Segment, string> = {
  agricultor: "Nông dân",
  cooperativa: "Hợp tác xã",
  autoridad: "Cơ quan nhà nước",
  empresa: "Doanh nghiệp/đối tác",
  otro: "Khác",
};
export const INTEREST_LABEL: Record<Interest, string> = {
  insumos: "Vật tư",
  maquinaria: "Máy móc",
  poscosecha: "Sau thu hoạch",
  digitalizacion: "Số hóa",
  asistencia: "Hỗ trợ kỹ thuật",
  paquete: "Gói trọn vụ",
};

export function label<T extends string>(map: Record<T, string>, v: string | null | undefined) {
  return v ? (map[v as T] ?? v) : "—";
}

export const dateTime = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Havana",
});
