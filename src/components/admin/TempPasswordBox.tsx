"use client";

import { useState } from "react";

/**
 * Hiện mật khẩu tạm MỘT lần sau khi tạo tài khoản/đặt lại mật khẩu, kèm nút chép.
 * Rời trang là mất: hệ thống chỉ lưu bản băm.
 */
export function TempPasswordBox({ email, password }: { email: string; password: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <div role="status" className="bg-green/10 text-ink mt-3 rounded-lg px-4 py-3 text-sm">
      <p>
        Mật khẩu tạm của <strong>{email}</strong> (chỉ hiện một lần — gửi cho người dùng, họ sẽ phải
        đổi ở lần đăng nhập đầu):
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <code
          data-testid="temp-password"
          className="text-navy rounded-md bg-white px-3 py-2 font-mono text-base select-all"
        >
          {password}
        </code>
        <button
          type="button"
          onClick={copy}
          className="text-navy border-line min-h-11 rounded-md border bg-white px-3 hover:bg-sky-50"
        >
          {copied ? "Đã chép ✓" : "Chép"}
        </button>
      </div>
    </div>
  );
}
