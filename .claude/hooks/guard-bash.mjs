// Hook PreToolUse cho Bash: chặn những lệnh nguy hiểm hoặc làm lộ bí mật.
// Thoát mã 2 = chặn lệnh; nội dung stderr được gửi lại cho Claude để giải thích.
let raw = "";
for await (const chunk of process.stdin) raw += chunk;
let cmd = "";
try {
  cmd = JSON.parse(raw)?.tool_input?.command ?? "";
} catch {
  process.exit(0);
}
const rules = [
  [
    /\b(cat|less|more|head|tail|type|bat)\b[^|;&]*\.env(\.local|\.production)?\b(?!\.example)/i,
    "Không in nội dung tệp .env — chứa bí mật.",
  ],
  [/\b(printenv|env)\b\s*($|\|)/i, "Không in toàn bộ biến môi trường."],
  [
    /drizzle-kit\s+drop|DROP\s+(TABLE|DATABASE|SCHEMA)/i,
    "Lệnh xóa bảng/cơ sở dữ liệu cần người dùng tự chạy.",
  ],
  [/git\s+push\s+.*(--force|-f\b)/i, "Không push --force."],
  [/git\s+reset\s+--hard/i, "git reset --hard làm mất thay đổi — hỏi người dùng trước."],
  [/rm\s+-rf\s+(\/|~|\.|\*)/i, "Lệnh xóa hàng loạt bị chặn."],
];
for (const [re, why] of rules) {
  if (re.test(cmd)) {
    console.error(`Đã chặn: ${why}\nLệnh: ${cmd}`);
    process.exit(2);
  }
}
process.exit(0);
