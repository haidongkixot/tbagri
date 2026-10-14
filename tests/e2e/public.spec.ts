import { expect, test } from "@playwright/test";

test.describe("Trang công khai", () => {
  // Trình duyệt tiếng Tây Ban Nha (khách Cuba) → /es ; xem playwright.config.ts (locale es-CU)
  test("/ chuyển sang /es, có đủ 14 section và đổi được sang /en", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/es$/);
    await expect(page.locator("h1")).toContainText(/del campo al mercado/i);
    for (const id of ["inicio", "introduccion", "productos", "contacto"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await expect(page.locator("footer")).toContainText("Contáctenos");
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toContainText(/from field to market/i);
  });

  test.describe("trình duyệt tiếng Anh", () => {
    test.use({ locale: "en-US" });
    test("/ chuyển sang /en theo Accept-Language", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/en$/);
    });
  });

  test("không tràn ngang ở bề rộng hiện tại", async ({ page }) => {
    await page.goto("/es");
    const { sw, cw } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    expect(sw).toBeLessThanOrEqual(cw);
  });

  test("stepper sản phẩm đổi nội dung bằng chuột và bàn phím", async ({ page }) => {
    await page.goto("/es");
    const sec = page.locator("#productos");
    await sec.getByRole("tab", { name: /^3\./ }).click();
    await expect(sec.getByRole("tabpanel")).toContainText("Protección de cultivos");
    await page.keyboard.press("ArrowRight");
    await expect(sec.getByRole("tabpanel")).toContainText("Maquinaria agrícola");
  });

  test("form liên hệ: lỗi theo ô, rồi gửi thành công", async ({ page }) => {
    await page.goto("/es#contacto");
    const form = page.locator("#contacto form");
    await form.getByRole("button", { name: "Enviar solicitud" }).click();
    await expect(page.locator("#lead-name-error")).toContainText("obligatorio");
    await expect(page.locator("#lead-name")).toBeFocused();

    await page.fill("#lead-name", "Ana Pérez");
    await page.fill("#lead-email", "ana.e2e@example.com");
    await page.selectOption("#lead-segment", "cooperativa");
    await page.fill("#lead-message", "Queremos un paquete integral para 200 ha de arroz.");
    await page.check('input[name="consent"]', { force: true });
    await form.getByRole("button", { name: "Enviar solicitud" }).click();
    await expect(page.locator("#contacto [role=status]")).toContainText("Gracias");
  });

  test("404 song ngữ cho đường dẫn lạ", async ({ page }) => {
    const res = await page.goto("/es/khong-ton-tai");
    expect(res?.status()).toBe(404);
    await expect(page.locator("h1")).toContainText("Página no encontrada");
  });

  test("sitemap và robots", async ({ request }) => {
    const sm = await request.get("/sitemap.xml");
    expect(sm.ok()).toBeTruthy();
    expect(await sm.text()).toContain("/en/tiendas");
    const rb = await request.get("/robots.txt");
    expect(await rb.text()).toContain("Disallow: /admin");
  });
});
