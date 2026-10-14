import { describe, expect, it } from "vitest";
import { CMS_DOCS, getDocConfig } from "@/cms/config";
import { docSchema, emptyItem, IMAGE_SRC_RE, issuesToList } from "@/cms/schema";
import { defaultContent } from "@/content/defaults";

describe("CMS config", () => {
  it("mỗi khóa của SiteContent có đúng một cấu hình", () => {
    const keys = Object.keys(defaultContent).sort();
    const configured = CMS_DOCS.map((d) => d.key).sort();
    expect(configured).toEqual(keys);
  });
  it("nội dung mặc định hợp lệ với lược đồ sinh từ cấu hình", () => {
    for (const doc of CMS_DOCS) {
      const r = docSchema(doc).safeParse(defaultContent[doc.key]);
      expect(r.success, `${doc.key}: ${!r.success && JSON.stringify(issuesToList(r.error))}`).toBe(
        true,
      );
    }
  });
  it("es trống bị từ chối, en trống được chấp nhận", () => {
    const hero = getDocConfig("hero")!;
    const bad = { ...defaultContent.hero, title: { es: "", en: "x" } };
    const ok = { ...defaultContent.hero, title: { es: "Hola", en: "" } };
    expect(docSchema(hero).safeParse(bad).success).toBe(false);
    expect(docSchema(hero).safeParse(ok).success).toBe(true);
  });
  it("danh sách tôn trọng min/max", () => {
    const steps = getDocConfig("postHarvestSteps")!;
    const seven = defaultContent.postHarvestSteps.slice(0, 7);
    expect(docSchema(steps).safeParse(seven).success).toBe(false);
  });
  it("emptyItem tạo mục có đủ trường nhưng không qua được kiểm tra", () => {
    const doc = getDocConfig("productSlides")!;
    const item = emptyItem(doc.fields);
    expect(Object.keys(item)).toEqual(["title", "description", "image", "fit"]);
    expect(docSchema(doc).safeParse([item]).success).toBe(false);
  });
});

describe("IMAGE_SRC_RE", () => {
  it.each([
    ["/images/hero-bg.webp", true],
    ["/uploads/2026-10-13-ab12cd34.jpg", true],
    ["https://abc123.public.blob.vercel-storage.com/cms/x-1.png", true],
    ["https://evil.example/x.png", false],
    ["javascript:alert(1)", false],
    ["/images/../secret.txt", false],
  ])("%s → %s", (src, ok) => {
    expect(IMAGE_SRC_RE.test(src)).toBe(ok);
  });
});
