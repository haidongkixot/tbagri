import type { Metadata } from "next";
import { Suspense } from "react";
import { eq } from "drizzle-orm";
import { AdminSkeleton } from "@/components/admin/AdminSkeleton";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { adminUsers, getDb } from "@/db";
import { requireAdmin } from "@/server/auth/session";

export const metadata: Metadata = { title: "Đổi mật khẩu" };

export default function AccountPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Account />
    </Suspense>
  );
}

async function Account() {
  const session = await requireAdmin({ allowPasswordChange: true });
  const db = await getDb();
  const [user] = await db
    .select({ forced: adminUsers.mustChangePassword })
    .from(adminUsers)
    .where(eq(adminUsers.id, session.userId));

  return (
    <div>
      <h1 className="text-navy text-2xl font-semibold">Đổi mật khẩu</h1>
      <p className="text-ink/70 mt-1">{session.email}</p>
      {user?.forced && (
        <p
          role="alert"
          className="bg-green/10 text-navy mt-4 max-w-[36rem] rounded-lg px-4 py-3 text-sm"
        >
          Bạn đang dùng mật khẩu tạm. Hãy đặt mật khẩu riêng để tiếp tục dùng khu quản trị.
        </p>
      )}
      <div className="mt-6">
        <ChangePasswordForm email={session.email} />
      </div>
    </div>
  );
}
