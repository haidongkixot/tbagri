import { describe, expect, it } from "vitest";
import type { LeadField } from "@/lib/lead";
import { fieldErrorsFrom, leadFromFormData, leadSchema } from "@/lib/lead-schema";

const valid = {
  name: "Ana Pérez",
  organization: "",
  email: "ana@example.com",
  phone: "+53 5050 9999",
  segment: "cooperativa",
  interest: "",
  message: "Queremos un paquete para 200 ha.",
  consent: "on",
  locale: "es",
};

describe("leadSchema", () => {
  it("chấp nhận dữ liệu hợp lệ và cắt khoảng trắng", () => {
    const r = leadSchema.safeParse({ ...valid, name: "  Ana  " });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.name).toBe("Ana");
  });
  it.each([
    ["name", "", "required"],
    ["email", "ana@", "email"],
    ["phone", "abc", "phone"],
    ["segment", "alien", "required"],
    ["interest", "alien", "required"],
    ["message", "corto", "tooShort"],
    ["consent", "", "consent"],
  ])("trường %s = %j → mã lỗi %s", (field, value, code) => {
    const r = leadSchema.safeParse({ ...valid, [field]: value });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrorsFrom(r.error)[field as LeadField]).toBe(code);
  });
  it("locale lạ → es", () => {
    const r = leadSchema.safeParse({ ...valid, locale: "fr" });
    expect(r.success && r.data.locale).toBe("es");
  });
  it("leadFromFormData đọc FormData, ô thiếu → chuỗi rỗng", () => {
    const fd = new FormData();
    fd.set("name", "Ana");
    expect(leadFromFormData(fd)).toMatchObject({ name: "Ana", email: "", consent: "" });
  });
});
