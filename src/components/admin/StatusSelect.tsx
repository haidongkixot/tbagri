"use client";

import { useRef } from "react";
import { LEAD_STATUSES, type LeadStatus } from "@/db/schema";
import { STATUS_LABEL } from "@/app/admin/labels";
import { updateLeadStatus } from "@/server/actions/leads";

/** Chọn trạng thái lead — đổi là lưu ngay (gửi form bằng Server Action). */
export function StatusSelect({
  id,
  status,
  name,
}: {
  id: string;
  status: LeadStatus;
  name: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef} action={updateLeadStatus}>
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`st-${id}`}>
        Trạng thái của {name}
      </label>
      <select
        id={`st-${id}`}
        name="status"
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
        className="border-line h-9 rounded-md border bg-white px-2 text-sm"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <noscript>
        <button type="submit" className="ml-2 text-sm underline">
          Lưu
        </button>
      </noscript>
    </form>
  );
}
