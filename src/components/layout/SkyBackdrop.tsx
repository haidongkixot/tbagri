import Image from "next/image";

/**
 * Nền chung cho s12 + s13: trời mây → ruộng lúa, nửa trái đã có sẵn tấm kính mờ bo góc
 * (`benefit-invite-bg.webp`, 1250 × 811 ở @1x). Mobile chỉ lấy phần trời/ruộng bên phải.
 */
export function SkyBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate overflow-hidden bg-sky-100">
      <Image
        src="/images/benefit-invite-bg.webp"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-[80%_50%] lg:object-top-left"
      />
      {children}
    </div>
  );
}
