"use server";

import { after } from "next/server";
import { getDb, leads } from "@/db";
import type { LeadState } from "@/lib/lead";
import { fieldErrorsFrom, leadFromFormData, leadSchema } from "@/lib/lead-schema";
import { notifyNewLead } from "@/server/notify";
import { rateLimit } from "@/server/rate-limit";
import { clientIp, hashIp } from "@/server/request-info";

const LIMIT = 5; // tối đa 5 lần gửi…
const WINDOW_MS = 60 * 60 * 1000; // …mỗi giờ cho một IP

/**
 * Server Action nhận form liên hệ (s12) — công khai, không cần đăng nhập.
 * 1. Bẫy bot  2. Kiểm tra Zod  3. Giới hạn tần suất  4. Lưu `leads`  5. Email báo (sau phản hồi)
 * Không bao giờ trả lỗi kỹ thuật ra trình duyệt.
 */
export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const raw = leadFromFormData(formData);
  const values = { ...raw };
  delete (values as Partial<typeof raw>).consent;
  delete (values as Partial<typeof raw>).locale;

  // 1. Bẫy bot: ô "website" bị ẩn với người thật. Có giá trị → giả vờ thành công, không lưu.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "success" };
  }

  // 2. Kiểm tra dữ liệu
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      formError: "generic",
      fieldErrors: fieldErrorsFrom(parsed.error),
      values,
      submittedAt: Date.now(),
    };
  }
  const data = parsed.data;

  try {
    // 3. Giới hạn tần suất theo IP đã băm
    const ipHash = hashIp(await clientIp());
    const limit = await rateLimit(`lead:${ipHash}`, LIMIT, WINDOW_MS);
    if (!limit.ok) {
      return {
        status: "error",
        formError: "rateLimited",
        fieldErrors: {},
        values,
        submittedAt: Date.now(),
      };
    }

    // 4. Lưu
    const db = await getDb();
    const [lead] = await db
      .insert(leads)
      .values({
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone || null,
        organization: data.organization || null,
        segment: data.segment,
        interest: data.interest || null,
        message: data.message,
        locale: data.locale,
        ipHash,
      })
      .returning();

    // 5. Email báo chạy SAU khi phản hồi người dùng (không làm chậm form)
    after(() => notifyNewLead(lead));
    return { status: "success" };
  } catch (err) {
    console.error("[lead] Lưu yêu cầu lỗi:", err);
    return {
      status: "error",
      formError: "generic",
      fieldErrors: {},
      values,
      submittedAt: Date.now(),
    };
  }
}
