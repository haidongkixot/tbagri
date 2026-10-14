import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Đăng nhập" };

export default function LoginPage() {
  return (
    <main className="bg-sky-soft grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-[24rem] rounded-[1.5rem] bg-white p-8 shadow-[0_0.5rem_2rem_rgb(0_55_123/0.12)]">
        <Image
          src="/images/logo-tbagri.png"
          alt="TBAgri"
          width={240}
          loading="eager"
          height={100}
          className="h-12 w-auto"
        />
        <h1 className="text-navy mt-6 text-xl font-semibold">Đăng nhập quản trị</h1>
        <p className="text-ink/70 mt-1 text-sm">
          Dành cho đội Marcomdi — quản lý nội dung và yêu cầu liên hệ.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
