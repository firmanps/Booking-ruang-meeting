import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(320px,0.95fr)_minmax(480px,1.05fr)]">
      <aside className="relative hidden overflow-hidden bg-[#17386f] text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(91,183,244,0.22),transparent_34%),linear-gradient(145deg,rgba(32,61,112,0.25),transparent_58%)]" />
        <div className="relative z-10 px-12 pt-10">
          <Link href="/" aria-label="MeetSpace, kembali ke beranda" className="flex items-center gap-3 text-lg font-semibold">
            <span className="grid size-11 place-items-center overflow-hidden rounded-xl bg-white shadow-sm">
              <Image src="/logo.webp" alt="" width={44} height={44} className="size-full object-contain" />
            </span>
            MeetSpace
          </Link>
        </div>

        <div className="relative z-10 px-12 pb-14">
          <p className="max-w-md text-4xl font-semibold leading-tight tracking-tight">Ruang terbaik untuk setiap ide besar.</p>
          <p className="mt-5 max-w-md text-base leading-7 text-zinc-300">Cek ketersediaan dan pesan ruang meeting secara mandiri. Cepat, transparan, dan tanpa perlu koordinasi rumit.</p>
        </div>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">{children}</section>
    </main>
  );
}
