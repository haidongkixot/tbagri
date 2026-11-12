"use client";

import { useActionState, useRef } from "react";
import { ADMIN_ROLES, type AdminRole } from "@/db/schema";
import { ROLE_LABEL } from "@/app/admin/labels";
import {
  resetUserPassword,
  setUserActive,
  setUserRole,
  type RowActionState,
} from "@/server/actions/users";
import { TempPasswordBox } from "./TempPasswordBox";

type User = { id: number; email: string; name: string; role: AdminRole; active: boolean };

const IDLE: RowActionState = { status: "idle" };
const BUTTON =
  "border-line text-navy min-h-11 rounded-md border bg-white px-3 text-sm hover:bg-sky-50 disabled:opacity-60";

/** Thao tác trên một dòng tài khoản: đổi vai trò, bật/tắt, đặt lại mật khẩu. */
export function UserRowActions({ user, isSelf }: { user: User; isSelf: boolean }) {
  const [roleState, roleAction] = useActionState(setUserRole, IDLE);
  const [activeState, activeAction, activePending] = useActionState(setUserActive, IDLE);
  const [resetState, resetAction, resetPending] = useActionState(resetUserPassword, IDLE);
  const roleForm = useRef<HTMLFormElement>(null);

  // Hiện thông báo của thao tác vừa làm (mỗi thao tác một state riêng)
  const latest = [resetState, activeState, roleState].find((s) => s.status !== "idle");

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <form ref={roleForm} action={roleAction}>
          <input type="hidden" name="id" value={user.id} />
          <label className="sr-only" htmlFor={`role-${user.id}`}>
            Vai trò của {user.name}
          </label>
          <select
            id={`role-${user.id}`}
            name="role"
            defaultValue={user.role}
            disabled={isSelf}
            title={isSelf ? "Không thể tự đổi vai trò của chính mình" : undefined}
            onChange={() => roleForm.current?.requestSubmit()}
            className="border-line h-11 rounded-md border bg-white px-2 text-sm disabled:opacity-60"
          >
            {ADMIN_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </form>
        <form action={activeAction}>
          <input type="hidden" name="id" value={user.id} />
          <input type="hidden" name="active" value={String(!user.active)} />
          <button
            type="submit"
            disabled={isSelf || activePending}
            aria-label={`${user.active ? "Tắt" : "Bật"} tài khoản ${user.email}`}
            className={BUTTON}
          >
            {user.active ? "Tắt" : "Bật"}
          </button>
        </form>
        <form
          action={resetAction}
          onSubmit={(e) => {
            if (!confirm(`Đặt lại mật khẩu cho ${user.email}? Mật khẩu cũ sẽ hết hiệu lực.`)) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={user.id} />
          <button
            type="submit"
            disabled={isSelf || resetPending}
            aria-label={`Đặt lại mật khẩu cho ${user.email}`}
            className={BUTTON}
          >
            Đặt lại mật khẩu
          </button>
        </form>
      </div>
      {latest?.status === "error" && (
        <p role="alert" className="text-danger text-sm">
          {latest.message}
        </p>
      )}
      {latest?.status === "done" &&
        (latest.tempPassword ? (
          <TempPasswordBox email={user.email} password={latest.tempPassword} />
        ) : (
          <p role="status" className="text-sm text-green-600">
            {latest.message}
          </p>
        ))}
    </div>
  );
}
