import { expect, test, type Page } from "@playwright/test";

const EMAIL = "e2e@tbagri.test";
const PASSWORD = "E2eTbagri2026ok";

async function login(page: Page) {
  await page.goto("/admin/login");
  await page.fill("#email", EMAIL);
  await page.fill("#password", PASSWORD);
  await page.click("button[type=submit]");
  await page.waitForURL(/\/admin$/);
}

/** Gửi một yêu cầu qua form công khai để khu quản trị có dữ liệu (tệp admin chạy trước public). */
async function submitLead(page: Page, email: string) {
  await page.goto("/es#contacto");
  await page.fill("#lead-name", "Lead E2E");
  await page.fill("#lead-email", email);
  await page.selectOption("#lead-segment", "empresa");
  await page.fill("#lead-message", "Mensaje de prueba generado por la suite E2E.");
  await page.check('input[name="consent"]', { force: true });
  await page.locator("#contacto form").getByRole("button", { name: "Enviar solicitud" }).click();
  await expect(page.locator("#contacto [role=status]")).toContainText("Gracias");
}

test.describe("Khu quản trị", () => {
  test("chưa đăng nhập bị chuyển về trang đăng nhập; sai mật khẩu báo lỗi chung", async ({
    page,
  }) => {
    await page.goto("/admin/leads");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await page.fill("#email", EMAIL);
    await page.fill("#password", "sai-mat-khau-123");
    await page.click("button[type=submit]");
    await expect(page.locator("p[role=alert]")).toContainText("không đúng");
  });

  test("đăng nhập, xem lead vừa gửi, đổi trạng thái, xuất CSV, đăng xuất", async ({ page }) => {
    const email = `lead.${Date.now()}@example.com`;
    await submitLead(page, email);
    await login(page);
    // Next giữ trang trước (login) trong DOM với display:none → chỉ chọn phần tử hiển thị
    await expect(page.getByRole("heading", { level: 1, name: /Xin chào/ })).toBeVisible();
    await page.goto("/admin/leads");
    const row = page.locator("tbody tr", { hasText: email }).first();
    await expect(row).toBeVisible();
    await row.locator("select").selectOption("contactado");
    await page.goto("/admin/leads?status=contactado");
    await expect(page.locator("tbody tr", { hasText: email })).toHaveCount(1);

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("link", { name: "Xuất CSV" }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/tbagri-leads-.*\.csv/);

    await page.locator("form button:has-text('Đăng xuất'):visible").last().click({ force: true });
    await expect(page).toHaveURL(/\/admin\/login$/);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("CMS: sửa hero → trang công khai đổi ngay; khôi phục mặc định", async ({
    page,
    context,
  }) => {
    await login(page);
    await page.goto("/admin/content/hero");
    const es = page.locator("#f-title-es");
    await expect(es).toHaveValue("Del campo al mercado");
    await es.fill("Del campo al mercado · E2E");
    await page.getByRole("button", { name: "Lưu và đăng" }).click();
    await expect(page.locator("[role=status]").first()).toContainText("Đã lưu");

    const pub = await context.newPage();
    await pub.goto("/es");
    await expect(pub.locator("h1")).toContainText("E2E");

    await page.getByRole("button", { name: "Khôi phục mặc định" }).click();
    await page.getByRole("button", { name: "Đồng ý" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#f-title-es")).toHaveValue("Del campo al mercado");
    await pub.reload();
    await expect(pub.locator("h1")).not.toContainText("E2E");
  });

  test("CMS: es trống bị từ chối với lỗi đúng ô", async ({ page }) => {
    await login(page);
    await page.goto("/admin/content/invitation");
    await page.locator("#f-ctaLabel-es").fill("");
    await page.getByRole("button", { name: "Lưu và đăng" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "ctaLabel.es" })).toBeVisible();
  });
});
