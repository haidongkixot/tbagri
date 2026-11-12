"use client";

import { useActionState } from "react";
import { changeOwnPassword, type ChangePasswordState } from "@/server/actions/account";
import { FIELD, FIELD_ERROR, LABEL } from "./styles";

const FIELDS = [
  { name: "current", label: "Mật khẩu hiện tại", autoComplete: "current-password" },
  {
    name: "next",
    label: "Mật khẩu mới",
    autoComplete: "new-password",
    help: "Từ 12 ký tự, có cả chữ và số.",
  },
  { name: "confirm", label: "Nhập lại mật khẩu mới", autoComplete: "new-password" },
] as const;

export function ChangePasswordForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState<ChangePasswordState, FormData>(
    changeOwnPassword,
    { status: "idle" },
  );
  const errors = state.status === "error" ? state.errors : {};

  return (
    <form action={action} noValidate className="max-w-[24rem] space-y-4">
      {/* Ô ẩn để trình quản lý mật khẩu biết mật khẩu mới thuộc tài khoản nào */}
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      {errors.form && (
        <p role="alert" className="bg-danger-50 text-danger rounded-lg px-3 py-2 text-sm">
          {errors.form}
        </p>
      )}
      {state.status === "done" && (
        <p role="status" className="bg-green/10 rounded-lg px-3 py-2 text-sm text-green-600">
          Đã đổi mật khẩu.
        </p>
      )}
      {FIELDS.map((f) => {
        const err = errors[f.name];
        const help = "help" in f ? f.help : undefined;
        const describedBy = [help && `${f.name}-help`, err && `${f.name}-err`]
          .filter(Boolean)
          .join(" ");
        return (
          <div key={f.name}>
            <label htmlFor={`pw-${f.name}`} className={LABEL}>
              {f.label}
            </label>
            <input
              id={`pw-${f.name}`}
              name={f.name}
              type="password"
              autoComplete={f.autoComplete}
              required
              aria-invalid={err ? true : undefined}
              aria-describedby={describedBy || undefined}
              className={FIELD}
            />
            {help && (
              <p id={`${f.name}-help`} className="text-ink/60 mt-1 text-sm">
                {help}
              </p>
            )}
            {err && (
              <p id={`${f.name}-err`} className={FIELD_ERROR}>
                {err}
              </p>
            )}
          </div>
        );
      })}
      <button type="submit" disabled={pending} className="btn-green disabled:opacity-70">
        {pending ? "Đang lưu…" : "Đổi mật khẩu"}
      </button>
    </form>
  );
}
