import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[minmax(320px,0.95fr)_minmax(480px,1.05fr)]">
      <aside className="relative hidden overflow-hidden bg-zinc-950 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_32%),linear-gradient(145deg,_rgba(39,39,42,0.35),_transparent_55%)]" />
        <div className="relative z-10 px-12 pt-10">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span className="grid size-9 place-items-center rounded-lg bg-white text-zinc-950">
              M
            </span>
            MeetSpace
          </div>
        </div>

        <div className="relative z-10 px-12 pb-14">
          <p className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
            Ruang terbaik untuk setiap ide besar.
          </p>
          <p className="mt-5 max-w-md text-base leading-7 text-zinc-300">
            Temukan, reservasi, dan kelola ruang meeting kantor dengan mudah.
          </p>
        </div>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        {children}
      </section>
    </main>
  );
}
