"use client";

import { useActionState } from "react";
import { ADMIN_ROLES } from "@/db/schema";
import { ROLE_HELP, ROLE_LABEL } from "@/app/admin/labels";
import { createUser, type CreateUserState } from "@/server/actions/users";
import { FIELD, FIELD_ERROR, LABEL } from "./styles";
import { TempPasswordBox } from "./TempPasswordBox";

/** Form "Thêm tài khoản": hệ thống tự sinh mật khẩu tạm, người dùng mới phải đổi khi đăng nhập. */
export function UserCreateForm() {
  const [state, action, pending] = useActionState<CreateUserState, FormData>(createUser, {
    status: "idle",
  });
  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};
  // Đổi key sau mỗi lần tạo thành công → form trống lại
  const formKey = state.status === "created" ? state.email : "form";

  return (
    <div>
      <form key={formKey} action={action} noValidate className="grid gap-4 sm:grid-cols-3">
        {errors.form && (
          <p
            role="alert"
            className="bg-danger-50 text-danger rounded-lg px-3 py-2 text-sm sm:col-span-3"
          >
            {errors.form}
          </p>
        )}
        <div>
          <label htmlFor="new-email" className={LABEL}>
            Email đăng nhập
          </label>
          <input
            id="new-email"
            name="email"
            type="email"
            autoComplete="off"
            required
            defaultValue={values.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "new-email-err" : undefined}
            className={FIELD}
          />
          {errors.email && (
            <p id="new-email-err" className={FIELD_ERROR}>
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="new-name" className={LABEL}>
            Tên hiển thị
          </label>
          <input
            id="new-name"
            name="name"
            required
            defaultValue={values.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "new-name-err" : undefined}
            className={FIELD}
          />
          {errors.name && (
            <p id="new-name-err" className={FIELD_ERROR}>
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="new-role" className={LABEL}>
            Vai trò
          </label>
          <select
            id="new-role"
            name="role"
            defaultValue={values.role || "editor"}
            aria-describedby="new-role-help"
            className={FIELD}
          >
            {ADMIN_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
          <ul id="new-role-help" className="text-ink/60 mt-1 text-sm">
            {ADMIN_ROLES.map((r) => (
              <li key={r}>
                {ROLE_LABEL[r]}: {ROLE_HELP[r]}
              </li>
            ))}
          </ul>
        </div>
        <div className="sm:col-span-3">
          <button type="submit" disabled={pending} className="btn-green disabled:opacity-70">
            {pending ? "Đang tạo…" : "Tạo tài khoản"}
          </button>
        </div>
      </form>
      {state.status === "created" && (
        <TempPasswordBox email={state.email} password={state.tempPassword} />
      )}
    </div>
  );
}
