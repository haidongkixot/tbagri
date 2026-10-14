/** Khung chờ (fallback của <Suspense>) cho các trang quản trị. */
export function AdminSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="animate-pulse space-y-4">
      <span className="sr-only">Đang tải…</span>
      <div className="bg-ink/10 h-8 w-64 rounded" />
      <div className="bg-ink/10 h-4 w-96 max-w-full rounded" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-ink/5 h-24 rounded-[1rem]" />
        <div className="bg-ink/5 h-24 rounded-[1rem]" />
        <div className="bg-ink/5 h-24 rounded-[1rem]" />
      </div>
      <div className="bg-ink/5 h-64 rounded-[1rem]" />
    </div>
  );
}
