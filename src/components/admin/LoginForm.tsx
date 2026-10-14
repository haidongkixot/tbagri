"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/server/actions/auth";

const MESSAGES: Record<NonNullable<LoginState["error"]>, string> = {
  invalid: "Email hoặc mật khẩu không đúng.",
  rateLimited: "Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.",
  generic: "Không đăng nhập được do lỗi hệ thống. Vui lòng thử lại.",
};

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      {state.error && (
        <p role="alert" className="bg-danger-50 text-danger rounded-lg px-3 py-2 text-sm">
          {MESSAGES[state.error]}
        </p>
      )}
      <div>
        <label htmlFor="email" className="text-navy mb-1 block text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state.email}
          className="border-line focus:border-green focus:ring-green/30 h-11 w-full rounded-lg border bg-white px-3 outline-none focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="password" className="text-navy mb-1 block text-sm font-semibold">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="border-line focus:border-green focus:ring-green/30 h-11 w-full rounded-lg border bg-white px-3 outline-none focus:ring-2"
        />
      </div>
      <button type="submit" disabled={pending} className="btn-green w-full disabled:opacity-70">
        {pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </button>
    </form>
  );
}
