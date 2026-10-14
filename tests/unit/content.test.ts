import { describe, expect, it } from "vitest";
import { defaultContent } from "@/content/defaults";
import { mergeWithDefaults } from "@/content/merge";
import { isL10n, localize } from "@/content/types";

describe("localize", () => {
  it("chọn đúng ngôn ngữ và quay về es khi thiếu en", () => {
    const v = { title: { es: "Hola", en: "" }, n: 3, list: [{ es: "a", en: "b" }] };
    expect(localize(v, "en")).toEqual({ title: "Hola", n: 3, list: ["b"] });
    expect(localize(v, "es").title).toBe("Hola");
  });
  it("isL10n chỉ nhận đối tượng {es, en}", () => {
    expect(isL10n({ es: "x", en: "y" })).toBe(true);
    expect(isL10n({ es: "x" })).toBe(false);
    expect(isL10n(["es", "en"])).toBe(false);
  });
});

describe("mergeWithDefaults", () => {
  it("không có dòng nào → trả nội dung mặc định", () => {
    expect(mergeWithDefaults([], defaultContent)).toEqual(defaultContent);
  });
  it("khối object: trộn nông, trường thiếu lấy mặc định", () => {
    const out = mergeWithDefaults(
      [{ key: "hero", data: { title: { es: "Nuevo", en: "New" } } }],
      defaultContent,
    );
    expect(out.hero.title.es).toBe("Nuevo");
    expect(out.hero.subtitle).toEqual(defaultContent.hero.subtitle);
    expect(out.hero.background).toEqual(defaultContent.hero.background);
  });
  it("khối list: thay cả danh sách", () => {
    const one = [defaultContent.services[0]];
    const out = mergeWithDefaults([{ key: "services", data: one }], defaultContent);
    expect(out.services).toHaveLength(1);
  });
  it("khóa lạ bị bỏ qua, kiểu sai giữ mặc định", () => {
    const out = mergeWithDefaults(
      [
        { key: "khongCo", data: { x: 1 } },
        { key: "services", data: { not: "a list" } },
      ],
      defaultContent,
    );
    expect((out as Record<string, unknown>).khongCo).toBeUndefined();
    expect(out.services).toEqual(defaultContent.services);
  });
});
