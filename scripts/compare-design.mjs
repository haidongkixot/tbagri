// So bản dựng của một section với ảnh thiết kế gốc.
// Dùng: npm run compare -- s04   (dev server phải chạy; mặc định http://localhost:3000)
// Kết quả: .compare/<mã>.png = [thiết kế | bản dựng | điểm khác biệt (đỏ)] và tỉ lệ khác biệt.
import { chromium } from "@playwright/test";
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const id = process.argv[2];
if (!id) {
  console.error("Cách dùng: npm run compare -- <mã section, ví dụ s04>");
  process.exit(1);
}
const base = process.env.BASE_URL ?? "http://localhost:3000";
const locale = process.env.LOCALE ?? "es";
const refDir = "docs/design/ref";
const refFile = readdirSync(refDir).find((f) => f.startsWith(`${id}-`) || f === `${id}.jpg`);
if (!refFile) {
  console.error(`Không thấy ảnh thiết kế ${refDir}/${id}-*.jpg`);
  process.exit(1);
}

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
});
const page = await browser.newPage({
  viewport: { width: 1250, height: 900 },
  deviceScaleFactor: 1,
});
await page.goto(`${base}/${locale}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const el = page.locator(`[data-section="${id}"]`).first();
if ((await el.count()) === 0) {
  console.error(`Trang chưa có phần tử [data-section="${id}"]`);
  await browser.close();
  process.exit(1);
}
// Thanh menu dính và nút liên hệ nổi sẽ đè lên ảnh chụp các section phía dưới → tạm ẩn
// (giữ nguyên ở s01 header và s02 hero, nơi thiết kế có vẽ chúng).
if (!["s01", "s02"].includes(id)) {
  await page.addStyleTag({
    content: "header{position:relative!important}[data-floating]{display:none!important}",
  });
}
await el.scrollIntoViewIfNeeded();
// Chờ ảnh (lazy) trong vùng nhìn thấy tải xong — lần đầu chạy dev, tối ưu ảnh hơi chậm
await page
  .waitForFunction(
    () =>
      [...document.images]
        .filter((i) => {
          const r = i.getBoundingClientRect();
          return r.bottom > 0 && r.top < innerHeight && r.width > 0;
        })
        .every((i) => i.complete && i.naturalWidth > 0),
    null,
    { timeout: 10000 },
  )
  .catch(() => console.warn("Một số ảnh chưa tải xong sau 10 giây"));
await page.waitForTimeout(400);
const shot = await el.screenshot({ animations: "disabled" });

const toData = (buf, type) => `data:${type};base64,${buf.toString("base64")}`;
const ref = toData(readFileSync(join(refDir, refFile)), "image/jpeg");
const built = toData(shot, "image/png");

const tool = await browser.newPage();
const result = await tool.evaluate(
  async ({ ref, built }) => {
    const load = (src) =>
      new Promise((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = src;
      });
    const [a, b] = await Promise.all([load(ref), load(built)]);
    const w = 1250;
    const ha = Math.round((a.height * w) / a.width);
    const hb = Math.round((b.height * w) / b.width);
    const h = Math.max(ha, hb);
    const gap = 16;
    const c = document.createElement("canvas");
    c.width = w * 3 + gap * 2;
    c.height = h;
    const g = c.getContext("2d");
    g.fillStyle = "#fff";
    g.fillRect(0, 0, c.width, c.height);
    g.drawImage(a, 0, 0, w, ha);
    g.drawImage(b, w + gap, 0, w, hb);
    // điểm khác biệt trên vùng chồng nhau
    const hh = Math.min(ha, hb);
    const da = g.getImageData(0, 0, w, hh).data;
    const db = g.getImageData(w + gap, 0, w, hh).data;
    const out = g.createImageData(w, hh);
    let diff = 0;
    for (let i = 0; i < da.length; i += 4) {
      const d =
        Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]);
      const on = d > 90;
      if (on) diff++;
      const gray = (da[i] + da[i + 1] + da[i + 2]) / 3;
      out.data[i] = on ? 230 : gray * 0.35 + 165;
      out.data[i + 1] = on ? 30 : gray * 0.35 + 165;
      out.data[i + 2] = on ? 40 : gray * 0.35 + 165;
      out.data[i + 3] = 255;
    }
    g.putImageData(out, (w + gap) * 2, 0);
    return { png: c.toDataURL("image/png"), ratio: diff / (w * hh), ha, hb };
  },
  { ref, built },
);
await browser.close();

mkdirSync(".compare", { recursive: true });
const outFile = `.compare/${id}.png`;
writeFileSync(outFile, Buffer.from(result.png.split(",")[1], "base64"));
const pct = (result.ratio * 100).toFixed(1);
console.log(`Ảnh so sánh: ${outFile}`);
console.log(
  `Chiều cao: thiết kế ${result.ha}px · bản dựng ${result.hb}px (lệch ${result.hb - result.ha}px)`,
);
console.log(
  `Điểm ảnh khác biệt rõ: ${pct}% (ảnh thiết kế là JPEG nén — dùng để tham khảo, mắt người quyết định)`,
);
