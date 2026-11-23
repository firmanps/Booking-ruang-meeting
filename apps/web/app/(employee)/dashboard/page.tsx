import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BadgeCheck, CalendarClock, CalendarDays, CalendarRange } from "lucide-react";
import type { ReactNode } from "react";

export default function Dashboard() {
  return (
    <div className="min-h-svh bg-[#f7f9ff] text-[#121a33]">
      <PageHeader />

      <main className="px-5 py-8 md:px-8 xl:px-10">
        <section>
          <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Selamat datang, Dimas</h1>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <SummaryCard icon={<CalendarClock className="size-6" />} iconClassName="bg-[#edf3ff] text-[#2864d7]" value="0" label="Reservasi Mendatang" />
          <SummaryCard icon={<CalendarRange className="size-6" />} iconClassName="bg-[#ecf8ef] text-[#2d7b46]" value="5" label="Total Reservasi" />
          <SummaryCard icon={<BadgeCheck className="size-6" />} iconClassName="bg-[#edf3ff] text-[#2864d7]" value="5" label="Reservasi Selesai" />
        </section>
        <Card className="mt-8 overflow-hidden rounded-2xl border-slate-200 py-0">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
            <div>
              <h2 className="text-xl font-bold">Jadwal Rapat Terdekat Anda</h2>
              <p className="mt-1 text-sm text-slate-500">Reservasi yang akan segera berlangsung.</p>
            </div>
            <Button variant="ghost" className="shrink-0 rounded-xl text-[#2864d7]">
              Lihat Semua
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="flex min-h-56 flex-col items-center justify-center px-6 py-12 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-[#edf3ff] text-[#2864d7]">
              <CalendarDays className="size-7" />
            </span>
            <p className="mt-4 font-semibold">Belum ada jadwal rapat</p>
          </div>
        </Card>
      </main>
    </div>
  );
}

function SummaryCard({ icon, iconClassName, value, label }: { icon: ReactNode; iconClassName: string; value: string; label: string }) {
  return (
    <Card className="flex-row items-center gap-5 rounded-2xl border-slate-200 px-6 py-7">
      <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${iconClassName}`}>{icon}</span>
      <div>
        <p className="text-4xl font-bold leading-none">{value}</p>
        <p className="mt-3 text-sm font-medium text-[#6683b8]">{label}</p>
      </div>
    </Card>
  );
}
