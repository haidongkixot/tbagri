import { Suspense } from "react";
import Image from "next/image";
import { AdminNav } from "@/components/admin/AdminNav";
import { logout } from "@/server/actions/auth";
import { requireAdmin } from "@/server/auth/session";

/**
 * Khung khu quản trị: menu trái (navy) + nội dung. Phần đọc cookie/CSDL đặt trong <Suspense>
 * (bắt buộc khi bật Cache Components: dữ liệu theo yêu cầu không được nằm ngoài Suspense).
 */
export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="bg-navy px-4 py-4 lg:sticky lg:top-0 lg:h-dvh lg:py-6">
        <div className="flex items-center justify-between gap-4 lg:block">
          <Image
            src="/images/logo-tbagri-white.png"
            alt="TBAgri"
            width={280}
            height={114}
            loading="eager"
            className="h-9 w-auto lg:h-11"
          />
          <Suspense fallback={null}>
            <UserBox className="lg:hidden" />
          </Suspense>
        </div>
        <div className="mt-4 lg:mt-8">
          {/* usePathname() là dữ liệu theo yêu cầu (URL) → cần Suspense ở route động như /admin/content/[key] */}
          <Suspense fallback={null}>
            <AdminNav />
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <UserBox className="absolute bottom-6 hidden lg:block" />
        </Suspense>
      </aside>
      <main id="noi-dung" className="px-4 py-6 lg:px-10 lg:py-8">
        <Suspense fallback={<p className="text-ink/60">Đang tải…</p>}>{children}</Suspense>
      </main>
    </div>
  );
}

async function UserBox({ className = "" }: { className?: string }) {
  const s = await requireAdmin();
  return (
    <div className={`text-sm text-white ${className}`}>
      <p className="font-semibold">{s.name}</p>
      <p className="text-white/70">
        {s.email} · {s.role === "admin" ? "Admin" : "Biên tập"}
      </p>
      <form action={logout} className="mt-2">
        <button
          type="submit"
          className="rounded-md border border-white/40 px-3 py-1.5 hover:bg-white/10"
        >
          Đăng xuất
        </button>
      </form>
    </div>
  );
}
