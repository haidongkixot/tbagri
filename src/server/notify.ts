import "server-only";
import type { Lead } from "@/db";

/**
 * Gửi email báo có lead mới qua Resend (REST API, không cần SDK).
 * Chỉ chạy khi có RESEND_API_KEY và LEAD_NOTIFY_TO; lỗi gửi mail chỉ ghi log, không ảnh hưởng
 * người dùng (lead đã được lưu trước đó).
 */
export async function notifyNewLead(lead: Lead): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  if (!key || !to) return;
  const from = process.env.LEAD_NOTIFY_FROM ?? "TB Agri <onboarding@resend.dev>";
  const lines = [
    `Nombre: ${lead.name}`,
    `Organización: ${lead.organization ?? "-"}`,
    `Segmento: ${lead.segment}`,
    `Interés: ${lead.interest ?? "-"}`,
    `Correo: ${lead.email}`,
    `Teléfono: ${lead.phone ?? "-"}`,
    `Idioma: ${lead.locale}`,
    "",
    lead.message,
  ];
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: lead.email,
        subject: `Nueva solicitud: ${lead.name} (${lead.segment})`,
        text: lines.join("\n"),
      }),
    });
    if (!res.ok) console.error("[notify] Resend trả lỗi", res.status, await res.text());
  } catch (err) {
    console.error("[notify] Không gửi được email:", err);
  }
}
