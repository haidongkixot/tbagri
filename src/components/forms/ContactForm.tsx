"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/content/types";
import { INTERESTS, SEGMENTS, initialLeadState, type LeadField, type LeadState } from "@/lib/lead";
import { submitLead } from "@/server/actions/submit-lead";

type Props = {
  t: Dictionary["form"];
  locale: Locale;
  title: string;
  intro: string;
};

/**
 * Form liên hệ (s12, id="contacto"). Gửi bằng Server Action `submitLead`;
 * lỗi trả về theo mã và được đổi thành câu chữ theo ngôn ngữ ở đây.
 * Nút nào trên trang có `data-interest="maquinaria"`… thì bấm vào sẽ điền sẵn "Interés principal".
 */
export function ContactForm({ t, locale, title, intro }: Props) {
  const [state, formAction] = useActionState<LeadState, FormData>(submitLead, initialLeadState);
  const formRef = useRef<HTMLFormElement>(null);
  const interestRef = useRef<HTMLSelectElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Điền sẵn mối quan tâm theo nút CTA đã bấm
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest<HTMLElement>("[data-interest]");
      const value = a?.dataset.interest;
      if (value && interestRef.current) interestRef.current.value = value;
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Sau khi gửi: lỗi → focus ô sai đầu tiên; thành công → focus thông báo
  useEffect(() => {
    if (state.status === "error") {
      const first = Object.keys(state.fieldErrors)[0];
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
    if (state.status === "success") statusRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="flex min-h-[16rem] flex-col items-center justify-center gap-3 text-center"
      >
        <svg viewBox="0 0 24 24" className="text-green size-12" aria-hidden>
          <circle cx="12" cy="12" r="11" fill="currentColor" />
          <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.2" />
        </svg>
        <p className="text-navy max-w-[18rem] text-[0.9375rem] font-medium">{t.success}</p>
      </div>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors : {};
  const values = state.status === "error" ? state.values : {};
  const err = (f: LeadField) => (errors[f] ? t.errors[errors[f]] : undefined);

  return (
    <form
      key={state.status === "error" ? state.submittedAt : "new"}
      ref={formRef}
      action={formAction}
      noValidate
      className="flex flex-col"
    >
      <h3 className="title-caps lg:text-[1.03125rem] lg:leading-[1.25rem]">{title}</h3>
      <p className="text-ink mt-1.5 text-[0.875rem] leading-snug lg:text-[0.78125rem] lg:leading-4">
        {intro}
      </p>

      {state.status === "error" && state.formError && (
        <p
          role="alert"
          className="bg-danger-50 text-danger mt-3 rounded-lg px-3 py-2 text-[0.8125rem]"
        >
          {t.errors[state.formError]}
        </p>
      )}

      <input type="hidden" name="locale" value={locale} />
      {/* Bẫy bot: người dùng không thấy ô này; bot điền vào sẽ bị bỏ qua (lab 12) */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-4 grid gap-x-3 gap-y-3 sm:grid-cols-2 lg:mt-[0.625rem] lg:gap-y-[0.5rem]">
        <Field label={t.name} name="name" error={err("name")} required>
          <input
            id="lead-name"
            name="name"
            autoComplete="name"
            defaultValue={values.name}
            required
            {...inputA11y("name", err("name"))}
            className={inputClass}
          />
        </Field>
        <Field label={t.organization} name="organization" optional={t.optional}>
          <input
            id="lead-organization"
            name="organization"
            autoComplete="organization"
            defaultValue={values.organization}
            className={inputClass}
          />
        </Field>
        <Field label={t.email} name="email" error={err("email")} required>
          <input
            id="lead-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            defaultValue={values.email}
            required
            {...inputA11y("email", err("email"))}
            className={inputClass}
          />
        </Field>
        <Field label={t.phone} name="phone" error={err("phone")} optional={t.optional}>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            defaultValue={values.phone}
            {...inputA11y("phone", err("phone"))}
            className={inputClass}
          />
        </Field>
        <Field label={t.segment} name="segment" error={err("segment")} required>
          <select
            id="lead-segment"
            name="segment"
            defaultValue={values.segment ?? ""}
            required
            {...inputA11y("segment", err("segment"))}
            className={selectClass}
          >
            <option value="" disabled>
              —
            </option>
            {SEGMENTS.map((s) => (
              <option key={s} value={s}>
                {t.segments[s]}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.interest} name="interest" optional={t.optional}>
          <select
            id="lead-interest"
            ref={interestRef}
            name="interest"
            defaultValue={values.interest ?? ""}
            className={selectClass}
          >
            <option value="">—</option>
            {INTERESTS.map((s) => (
              <option key={s} value={s}>
                {t.interests[s]}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label={t.message}
          name="message"
          error={err("message")}
          required
          className="sm:col-span-2"
        >
          <textarea
            id="lead-message"
            name="message"
            rows={3}
            maxLength={2000}
            defaultValue={values.message}
            required
            {...inputA11y("message", err("message"))}
            className={`${inputClass} h-auto resize-y py-2 lg:h-[3rem]`}
          />
        </Field>
      </div>

      <div className="mt-3 lg:mt-[0.55rem]">
        <label className="text-ink flex items-start gap-2 text-[0.8125rem] leading-snug lg:text-[0.71875rem]">
          <input
            type="checkbox"
            name="consent"
            required
            className="accent-green mt-0.5 size-4 shrink-0"
            {...inputA11y("consent", err("consent"))}
          />
          <span>{t.consent}</span>
        </label>
        {err("consent") && (
          <p id="lead-consent-error" className="text-danger mt-1 text-[0.75rem]">
            {err("consent")}
          </p>
        )}
      </div>

      <SubmitButton label={t.submit} pending={t.sending} />
    </form>
  );
}

const inputClass =
  "h-11 w-full rounded-lg border border-line bg-white px-3 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-green focus:ring-2 focus:ring-green/30 aria-[invalid=true]:border-danger lg:h-[2.125rem] lg:text-[0.8125rem]";
const selectClass = `${inputClass} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 8'%3E%3Cpath d='M1 1l6 6 6-6' fill='none' stroke='%2362bb46' stroke-width='1.8'/%3E%3C/svg%3E")] bg-[length:0.75rem] bg-[position:right_0.75rem_center] bg-no-repeat pr-8`;

function inputA11y(name: string, error?: string) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `lead-${name}-error` : undefined,
  };
}

function Field({
  label,
  name,
  error,
  required,
  optional,
  className = "",
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  optional?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={`lead-${name}`}
        className="text-navy mb-1 block text-[0.8125rem] font-semibold lg:text-[0.71875rem]"
      >
        {label}
        {required && (
          <span aria-hidden className="text-green-600">
            {" "}
            *
          </span>
        )}
        {optional && <span className="text-ink/60 font-normal"> ({optional})</span>}
      </label>
      {children}
      {error && (
        <p id={`lead-${name}-error`} className="text-danger mt-1 text-[0.75rem]">
          {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton({ label, pending }: { label: string; pending: string }) {
  const { pending: isPending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={isPending}
      className="btn-green mt-4 w-full disabled:cursor-wait disabled:opacity-70 lg:mt-[0.625rem] lg:h-[2.375rem]"
    >
      {isPending ? pending : label}
    </button>
  );
}
