import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, BadgeCheck, Building2, CalendarClock, CalendarDays, Search } from "lucide-react";
import type { ReactNode } from "react";

export default function Dashboard() {
  return (
    <main>
      <div className="min-h-svh bg-[#f7f9ff] text-[#121a33]">
        <PageHeader />

        <main className="px-5 py-8 md:px-8 xl:px-10">
          <section>
            <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Selamat datang, Dimas</h1>
            <p className="mt-2 text-base text-[#6683b8] sm:text-lg">Berikut ringkasan aktivitas reservasi ruang rapat Anda hari ini.</p>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <SummaryCard icon={<CalendarClock className="size-6" />} iconClassName="bg-[#edf3ff] text-[#2864d7]" value="0" label="Reservasi Menunggu" />
            <SummaryCard icon={<Building2 className="size-6" />} iconClassName="bg-[#ecf8ef] text-[#2d7b46]" value="5" label="Ruangan Tersedia Saat Ini" />
            <SummaryCard icon={<BadgeCheck className="size-6" />} iconClassName="bg-[#edf3ff] text-[#2864d7]" value="5" label="Total Ruangan Aktif" />
          </section>

          <Card className="mt-8 overflow-hidden rounded-3xl border-0 bg-[#17386f] py-0 text-white shadow-[0_20px_45px_rgba(23,56,111,0.12)]">
            <div className="px-6 py-8 sm:px-10 sm:py-9">
              <h2 className="text-2xl font-bold tracking-tight">Butuh ruangan untuk rapat berikutnya?</h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-[#c0cee8] sm:text-lg">Lihat ketersediaan semua ruangan secara real-time dan pesan dalam beberapa klik.</p>
              <div className="mt-7 flex max-w-2xl gap-3">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
                  <Input aria-label="Cari ruangan" placeholder="Cari ruangan..." className="h-12 rounded-xl border-0 bg-white pl-12 text-slate-900" />
                </div>
                <Button type="button" size="lg" className="hidden h-12 rounded-xl bg-white px-5 text-[#17386f] hover:bg-slate-100 sm:inline-flex">
                  Cari
                </Button>
              </div>
            </div>
          </Card>

          <Card className="mt-8 overflow-hidden rounded-2xl border-slate-200 py-0">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
              <div>
                <h2 className="text-xl font-bold">Jadwal Rapat Terdekat Anda</h2>
                <p className="mt-1 text-sm text-slate-500">Reservasi terkonfirmasi yang akan segera berlangsung.</p>
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
              <p className="mt-1 max-w-md text-sm text-slate-500">Reservasi ruangan yang telah dikonfirmasi akan tampil di sini.</p>
            </div>
          </Card>
        </main>
      </div>
    </main>
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
