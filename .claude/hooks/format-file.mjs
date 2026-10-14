// Hook PostToolUse: sau khi Claude sửa/tạo tệp, tự định dạng tệp đó bằng Prettier.
// Claude Code gửi JSON mô tả lần gọi công cụ qua stdin; ta lấy tool_input.file_path.
import { execFileSync } from "node:child_process";
import { extname } from "node:path";

let raw = "";
for await (const chunk of process.stdin) raw += chunk;
let file = "";
try {
  file = JSON.parse(raw)?.tool_input?.file_path ?? "";
} catch {
  process.exit(0);
}
const exts = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".json"]);
if (!file || !exts.has(extname(file)) || file.includes("node_modules")) process.exit(0);
try {
  execFileSync("npx", ["prettier", "--write", "--log-level", "warn", file], {
    stdio: "ignore",
    shell: process.platform === "win32",
  });
} catch {
  // Không chặn công việc nếu Prettier lỗi (ví dụ tệp đang dở dang).
}
process.exit(0);
