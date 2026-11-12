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

// Đăng nhập luôn bị giới hạn 10 lần/15 phút cho mỗi IP: cả tệp này dùng tổng 8 lần.
test.describe("Quản lý tài khoản quản trị", () => {
  const editorEmail = `bientap.${Date.now()}@tbagri.test`;
  const editorPassword = "BienTapMoi2026ok";

  async function logout(page: Page) {
    await page.locator("form button:has-text('Đăng xuất'):visible").last().click({ force: true });
    await expect(page).toHaveURL(/\/admin\/login$/);
  }

  test("admin tạo tài khoản biên tập → người mới bắt buộc đổi mật khẩu tạm → không vào được quản lý tài khoản", async ({
    page,
  }) => {
    await login(page);
    await page.getByRole("link", { name: "Tài khoản quản trị" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Tài khoản quản trị" })).toBeVisible();

    // Chính mình: không tự tắt/đặt lại được
    const self = page.locator("tbody tr", { hasText: EMAIL });
    await expect(self.getByRole("button", { name: `Tắt tài khoản ${EMAIL}` })).toBeDisabled();

    // Email sai → lỗi đúng ô, không tạo
    await page.fill("#new-email", "khong-hop-le");
    await page.fill("#new-name", "Biên tập E2E");
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();
    await expect(page.locator("#new-email-err")).toContainText("không hợp lệ");

    await page.fill("#new-email", editorEmail);
    await page.selectOption("#new-role", "editor");
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();
    const temp = (await page.getByTestId("temp-password").textContent())?.trim() ?? "";
    expect(temp).toMatch(/^[A-Za-z2-9]{20}$/);
    await expect(page.locator("tbody tr", { hasText: editorEmail })).toContainText(
      "chờ đổi mật khẩu tạm",
    );

    // Email trùng → báo lỗi
    await page.fill("#new-email", editorEmail);
    await page.fill("#new-name", "Trùng");
    await page.getByRole("button", { name: "Tạo tài khoản" }).click();
    await expect(page.locator("#new-email-err")).toContainText("đã có tài khoản");
    await logout(page);

    // Người mới đăng nhập bằng mật khẩu tạm → bị giữ ở trang đổi mật khẩu
    await page.fill("#email", editorEmail);
    await page.fill("#password", temp);
    await page.click("button[type=submit]");
    await page.waitForURL(/\/admin\/account$/);
    await expect(page.getByRole("alert").filter({ hasText: "mật khẩu tạm" })).toBeVisible();
    await page.goto("/admin/leads");
    await expect(page).toHaveURL(/\/admin\/account$/);

    await page.fill("#pw-current", temp);
    await page.fill("#pw-next", editorPassword);
    await page.fill("#pw-confirm", editorPassword);
    await page.getByRole("button", { name: "Đổi mật khẩu" }).click();
    await page.waitForURL(/\/admin$/);
    await expect(page.getByRole("heading", { level: 1, name: /Xin chào/ })).toBeVisible();

    // Biên tập: không thấy menu và không vào được trang quản lý tài khoản
    await expect(page.getByRole("link", { name: "Tài khoản quản trị" })).toHaveCount(0);
    await page.goto("/admin/users");
    await expect(page).toHaveURL(/\/admin\?error=forbidden$/);
    await logout(page);
  });

  test("admin tắt tài khoản → người đó không đăng nhập được nữa", async ({ page }) => {
    await login(page);
    await page.goto("/admin/users");
    const row = page.locator("tbody tr", { hasText: editorEmail });
    await row.getByRole("button", { name: `Tắt tài khoản ${editorEmail}` }).click();
    await expect(row).toContainText("Đã tắt");
    await logout(page);

    await page.fill("#email", editorEmail);
    await page.fill("#password", editorPassword);
    await page.click("button[type=submit]");
    await expect(page.locator("p[role=alert]")).toContainText("không đúng");
  });
});
