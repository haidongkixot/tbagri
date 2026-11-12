import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminSkeleton } from "@/components/admin/AdminSkeleton";
import { UserCreateForm } from "@/components/admin/UserCreateForm";
import { UserRowActions } from "@/components/admin/UserRowActions";
import { requireAdmin } from "@/server/auth/session";
import { listAdminUsers } from "@/server/users";
import { dateTime, ROLE_LABEL } from "../../labels";

export const metadata: Metadata = { title: "Tài khoản quản trị" };

export default function UsersPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Users />
    </Suspense>
  );
}

async function Users() {
  const session = await requireAdmin({ role: "admin" });
  const users = await listAdminUsers();

  return (
    <div className="max-w-[72rem]">
      <h1 className="text-navy text-2xl font-semibold">Tài khoản quản trị</h1>
      <p className="text-ink/70 mt-1">
        Thêm người dùng, đổi vai trò, tắt tài khoản không còn dùng và đặt lại mật khẩu.
      </p>

      <section
        aria-labelledby="tao-tai-khoan"
        className="ring-ink/5 mt-6 rounded-[1rem] bg-white p-5 shadow-sm ring-1"
      >
        <h2 id="tao-tai-khoan" className="text-navy mb-4 font-semibold">
          Thêm tài khoản
        </h2>
        <UserCreateForm />
      </section>

      {/* relative: giữ nhãn sr-only (position: absolute) trong khung cuộn, không làm tràn trang ở mobile */}
      <div className="ring-ink/5 relative mt-6 overflow-x-auto rounded-[1rem] bg-white shadow-sm ring-1">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <caption className="sr-only">Danh sách tài khoản quản trị</caption>
          <thead className="text-navy bg-sky-50">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Tài khoản
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Vai trò · Trạng thái
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Đăng nhập gần nhất
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-ink/5 divide-y align-top">
            {users.map((u) => {
              const isSelf = u.id === session.userId;
              return (
                <tr key={u.id} className={u.active ? undefined : "bg-ink/[0.03]"}>
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {u.name}
                      {isSelf && <span className="text-ink/60 font-normal"> (bạn)</span>}
                    </p>
                    <p className="text-ink/70">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{ROLE_LABEL[u.role]}</p>
                    <p className={u.active ? "text-green-600" : "text-ink/60"}>
                      {u.active ? "Đang hoạt động" : "Đã tắt"}
                      {u.active && u.mustChangePassword && " · chờ đổi mật khẩu tạm"}
                    </p>
                  </td>
                  <td className="text-ink/70 px-4 py-3 whitespace-nowrap">
                    {u.lastLoginAt ? dateTime.format(u.lastLoginAt) : "Chưa đăng nhập"}
                  </td>
                  <td className="px-4 py-3">
                    <UserRowActions
                      user={{
                        id: u.id,
                        email: u.email,
                        name: u.name,
                        role: u.role,
                        active: u.active,
                      }}
                      isSelf={isSelf}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
