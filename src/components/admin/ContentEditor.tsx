"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { DocConfig, Field } from "@/cms/config";
import { emptyItem } from "@/cms/schema";
import { resetContent, saveContent, type SaveResult } from "@/server/actions/content";
import { uploadImage } from "@/server/actions/upload";

type L10n = { es: string; en: string };
type Obj = Record<string, unknown>;
type Errors = Record<string, string>;

/**
 * Trình sửa nội dung sinh tự động từ cấu hình CMS (src/cms/config.ts).
 * Giữ toàn bộ khối nội dung trong state, bấm "Lưu" thì gửi JSON cho Server Action `saveContent`
 * (server kiểm tra lại bằng Zod — không tin dữ liệu từ trình duyệt).
 */
export function ContentEditor({ doc, initial }: { doc: DocConfig; initial: unknown }) {
  const [value, setValue] = useState<unknown>(initial);
  const [saved, setSaved] = useState<string>(JSON.stringify(initial));
  const [result, setResult] = useState<SaveResult | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(value) !== saved;

  const errors: Errors = useMemo(() => {
    if (!result || result.ok || !result.issues) return {};
    return Object.fromEntries(result.issues.map((i) => [i.path, i.message]));
  }, [result]);

  // Cảnh báo khi rời trang mà chưa lưu
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function save() {
    startTransition(async () => {
      const json = JSON.stringify(value);
      const r = await saveContent(doc.key, json);
      setResult(r);
      if (r.ok) setSaved(json);
    });
  }

  function reset() {
    startTransition(async () => {
      const r = await resetContent(doc.key);
      setResult(r);
      setConfirmReset(false);
      if (r.ok) window.location.reload();
    });
  }

  return (
    <div className="max-w-[56rem]">
      <div className="border-ink/10 sticky top-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-b bg-sky-50/95 px-4 py-3 backdrop-blur lg:-mx-10 lg:px-10">
        <p role="status" className="text-ink/70 mr-auto text-sm">
          {pending
            ? "Đang xử lý…"
            : dirty
              ? "Có thay đổi chưa lưu"
              : result?.ok
                ? `Đã lưu lúc ${new Date(result.savedAt).toLocaleTimeString("vi-VN")}`
                : "Không có thay đổi"}
        </p>
        {confirmReset ? (
          <span className="flex items-center gap-2 text-sm">
            Xóa bản đã sửa, dùng lại nội dung mặc định?
            <button
              type="button"
              onClick={reset}
              className="bg-danger rounded-md px-3 py-2 font-semibold text-white"
            >
              Đồng ý
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="rounded-md px-3 py-2 underline"
            >
              Hủy
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="text-navy rounded-lg px-3 py-2 text-sm underline-offset-2 hover:underline"
          >
            Khôi phục mặc định
          </button>
        )}
        <button
          type="button"
          onClick={save}
          disabled={pending || !dirty}
          className="btn-green disabled:cursor-not-allowed disabled:opacity-50"
        >
          Lưu và đăng
        </button>
      </div>

      {result && !result.ok && (
        <div role="alert" className="bg-danger-50 text-danger mt-4 rounded-lg p-3 text-sm">
          <p className="font-semibold">{result.message}</p>
          {result.issues && (
            <ul className="mt-1 list-disc pl-5">
              {result.issues.slice(0, 8).map((i) => (
                <li key={i.path + i.message}>
                  <code>{i.path || "(toàn khối)"}</code>: {i.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-6">
        {doc.type === "object" ? (
          <FieldsGroup
            fields={doc.fields}
            value={value as Obj}
            onChange={setValue}
            path=""
            errors={errors}
          />
        ) : (
          <ListEditor doc={doc} items={value as Obj[]} onChange={setValue} errors={errors} />
        )}
      </div>
    </div>
  );
}

function ListEditor({
  doc,
  items,
  onChange,
  errors,
}: {
  doc: Extract<DocConfig, { type: "list" }>;
  items: Obj[];
  onChange: (v: Obj[]) => void;
  errors: Errors;
}) {
  const min = doc.min ?? 0;
  const max = doc.max ?? 50;
  const move = (i: number, d: -1 | 1) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <div>
      <ol className="space-y-4">
        {items.map((item, i) => {
          const t = item[doc.itemTitle] as L10n | string | undefined;
          const title = (typeof t === "string" ? t : t?.es) || "(chưa có tiêu đề)";
          return (
            <li key={i} className="ring-ink/5 rounded-[1rem] bg-white shadow-sm ring-1">
              <details open={items.length <= 4}>
                <summary className="flex cursor-pointer items-center gap-3 px-4 py-3">
                  <span className="bg-navy grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-navy mr-auto font-semibold whitespace-pre-line">
                    {title}
                  </span>
                  <IconButton label="Đưa lên" disabled={i === 0} onClick={() => move(i, -1)}>
                    ↑
                  </IconButton>
                  <IconButton
                    label="Đưa xuống"
                    disabled={i === items.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    ↓
                  </IconButton>
                  <IconButton
                    label="Xóa mục"
                    disabled={items.length <= min}
                    onClick={() => onChange(items.filter((_, j) => j !== i))}
                  >
                    ✕
                  </IconButton>
                </summary>
                <div className="border-ink/5 border-t px-4 pt-3 pb-4">
                  <FieldsGroup
                    fields={doc.fields}
                    value={item}
                    onChange={(v) => onChange(items.map((it, j) => (j === i ? v : it)))}
                    path={`${i}`}
                    errors={errors}
                  />
                </div>
              </details>
            </li>
          );
        })}
      </ol>
      <button
        type="button"
        disabled={items.length >= max}
        onClick={() => onChange([...items, emptyItem(doc.fields)])}
        className="border-line text-navy hover:border-green mt-4 rounded-lg border-2 border-dashed px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
      >
        + Thêm mục ({items.length}/{max})
      </button>
    </div>
  );
}

function FieldsGroup({
  fields,
  value,
  onChange,
  path,
  errors,
}: {
  fields: Field[];
  value: Obj;
  onChange: (v: Obj) => void;
  path: string;
  errors: Errors;
}) {
  return (
    <div className="space-y-5">
      {fields.map((f) => {
        const p = path ? `${path}.${f.name}` : f.name;
        const set = (v: unknown) => onChange({ ...value, [f.name]: v });
        return (
          <FieldEditor
            key={f.name}
            field={f}
            value={value?.[f.name]}
            onChange={set}
            path={p}
            errors={errors}
          />
        );
      })}
    </div>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
  path,
  errors,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  path: string;
  errors: Errors;
}) {
  const id = `f-${path}`;
  const err = (sub?: string) => errors[sub ? `${path}.${sub}` : path];
  const help = "help" in field ? field.help : undefined;

  switch (field.kind) {
    case "text":
    case "textarea":
      return (
        <Wrapper label={field.label} help={help}>
          <L10nInput
            id={id}
            value={(value as L10n) ?? { es: "", en: "" }}
            onChange={onChange}
            multiline={field.kind === "textarea"}
            max={field.max}
            errors={{ es: err("es"), en: err("en") }}
          />
        </Wrapper>
      );
    case "textList": {
      const list = (value as L10n[]) ?? [];
      return (
        <Wrapper label={field.label} error={err()}>
          <div className="space-y-3">
            {list.map((v, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1">
                  <L10nInput
                    id={`${id}-${i}`}
                    value={v}
                    multiline
                    onChange={(nv) => onChange(list.map((x, j) => (j === i ? nv : x)))}
                    errors={{ es: err(`${i}.es`), en: err(`${i}.en`) }}
                  />
                </div>
                <IconButton
                  label="Xóa đoạn"
                  disabled={list.length <= (field.min ?? 0)}
                  onClick={() => onChange(list.filter((_, j) => j !== i))}
                >
                  ✕
                </IconButton>
              </div>
            ))}
            <button
              type="button"
              disabled={list.length >= (field.max ?? 10)}
              onClick={() => onChange([...list, { es: "", en: "" }])}
              className="text-navy text-sm font-semibold underline disabled:opacity-50"
            >
              + Thêm đoạn
            </button>
          </div>
        </Wrapper>
      );
    }
    case "plain":
      return (
        <Wrapper label={field.label} htmlFor={id} help={help} error={err()}>
          <input
            id={id}
            type={field.format === "email" ? "email" : field.format === "url" ? "url" : "text"}
            inputMode={
              field.format === "phone" ? "tel" : field.format === "digits" ? "numeric" : undefined
            }
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          />
        </Wrapper>
      );
    case "select":
      return (
        <Wrapper label={field.label} htmlFor={id}>
          <select
            id={id}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          >
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Wrapper>
      );
    case "icon":
      return (
        <Wrapper label={field.label} help={help} error={err()}>
          <ImagePicker src={(value as string) ?? ""} onChange={onChange} small />
        </Wrapper>
      );
    case "image": {
      const img = (value as { src: string; alt: L10n }) ?? { src: "", alt: { es: "", en: "" } };
      return (
        <Wrapper label={field.label} help={help} error={err("src")}>
          <ImagePicker src={img.src} onChange={(src) => onChange({ ...img, src })} />
          <p className="text-navy mt-3 mb-1 text-xs font-semibold">
            Mô tả ảnh (alt) — cho người khiếm thị và Google
          </p>
          <L10nInput
            id={`${id}-alt`}
            value={img.alt}
            onChange={(alt) => onChange({ ...img, alt })}
            max={160}
            errors={{ es: err("alt.es"), en: err("alt.en") }}
          />
        </Wrapper>
      );
    }
  }
}

function L10nInput({
  id,
  value,
  onChange,
  multiline,
  max,
  errors,
}: {
  id: string;
  value: L10n;
  onChange: (v: L10n) => void;
  multiline?: boolean;
  max?: number;
  errors?: { es?: string; en?: string };
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {(["es", "en"] as const).map((lang) => {
        const v = value?.[lang] ?? "";
        const props = {
          id: `${id}-${lang}`,
          value: v,
          maxLength: max,
          placeholder: lang === "en" ? "Để trống = dùng bản tiếng Tây Ban Nha" : undefined,
          "aria-invalid": errors?.[lang] ? true : undefined,
          className: `${inputCls} ${multiline ? "h-auto min-h-24 py-2" : ""}`,
        };
        return (
          <div key={lang}>
            <label
              htmlFor={`${id}-${lang}`}
              className="text-ink/70 mb-1 flex justify-between text-xs font-semibold"
            >
              <span>{lang === "es" ? "Tiếng Tây Ban Nha (bắt buộc)" : "Tiếng Anh"}</span>
              {max && (
                <span className={v.length > max * 0.9 ? "text-danger" : ""}>
                  {v.length}/{max}
                </span>
              )}
            </label>
            {multiline ? (
              <textarea
                {...props}
                rows={3}
                onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
              />
            ) : (
              <input {...props} onChange={(e) => onChange({ ...value, [lang]: e.target.value })} />
            )}
            {errors?.[lang] && <p className="text-danger mt-1 text-xs">{errors[lang]}</p>}
          </div>
        );
      })}
    </div>
  );
}

function ImagePicker({
  src,
  onChange,
  small,
}: {
  src: string;
  onChange: (src: string) => void;
  small?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();

  function onFile(file: File | undefined) {
    if (!file) return;
    const fd = new FormData();
    fd.set("file", file);
    setMsg(null);
    startTransition(async () => {
      const r = await uploadImage(fd);
      if (r.ok) onChange(r.url);
      else setMsg(r.message);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  const box = small ? "size-16" : "h-32 w-48";
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div
        className={`relative ${box} ring-ink/10 shrink-0 overflow-hidden rounded-lg bg-[repeating-conic-gradient(var(--color-sky-100)_0_25%,white_0_50%)] bg-[length:16px_16px] ring-1`}
      >
        {src ? (
          <Image src={src} alt="" fill sizes="12rem" className="object-contain" />
        ) : (
          <span className="text-ink/50 grid size-full place-items-center text-xs">Chưa có ảnh</span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-ink/60 truncate font-mono text-xs" title={src}>
          {src || "—"}
        </p>
        <label className="bg-navy focus-within:outline-green hover:bg-navy-700 inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white focus-within:outline-3">
          {busy ? "Đang tải…" : "Tải ảnh mới"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            disabled={busy}
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
        <p className="text-ink/50 text-xs">JPG, PNG, WebP, AVIF · tối đa 4 MB</p>
        {msg && (
          <p role="alert" className="text-danger text-xs">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}

function Wrapper({
  label,
  htmlFor,
  help,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  help?: string;
  error?: string;
  children: React.ReactNode;
}) {
  const Tag = htmlFor ? "label" : "p";
  return (
    <div>
      <Tag
        {...(htmlFor ? { htmlFor } : {})}
        className="text-navy mb-1.5 block text-sm font-semibold"
      >
        {label}
      </Tag>
      {help && <p className="text-ink/60 -mt-1 mb-2 text-xs">{help}</p>}
      {children}
      {error && <p className="text-danger mt-1 text-xs">{error}</p>}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="text-navy grid size-9 shrink-0 place-items-center rounded-md hover:bg-sky-100 disabled:opacity-30"
    >
      {children}
    </button>
  );
}

const inputCls =
  "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-green focus:ring-2 focus:ring-green/30 aria-[invalid=true]:border-danger";
