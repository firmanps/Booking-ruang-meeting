"use client";

import { BadgeCheck, CalendarClock, CalendarDays, CalendarRange, Clock, LoaderCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMyBookingsDashboard } from "@/lib/services/bookings.service";
import type { MyBooking, MyBookingsSummary } from "@repo/shared/schemas/bookings.schema";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  day: "2-digit",
  month: "short",
});
const scheduleDateFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  weekday: "long",
  day: "numeric",
  month: "long",
});
const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function getDateParts(value: string) {
  const parts = dateFormatter.formatToParts(new Date(value));
  return {
    day: parts.find((part) => part.type === "day")?.value ?? "",
    month: parts.find((part) => part.type === "month")?.value ?? "",
  };
}

function formatSchedule(booking: MyBooking) {
  const date = scheduleDateFormatter.format(new Date(booking.startAt));
  const start = timeFormatter.format(new Date(booking.startAt));
  const end = timeFormatter.format(new Date(booking.endAt));
  return `${date}, ${start}–${end} WIB`;
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [summary, setSummary] = useState<MyBookingsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState<number | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getMyBookingsDashboard();
      setBookings(result.bookings);
      setSummary(result.summary);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Data dashboard gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    setNow(Date.now());
    const intervalId = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const upcomingBookings = useMemo(() => {
    if (now === null) return [];
    return bookings.filter((booking) => booking.status === "CONFIRMED" && Date.parse(booking.startAt) > now).slice(0, 5);
  }, [bookings, now]);

  return (
    <div className="min-h-svh bg-[#f7f9ff] text-[#121a33]">
      <PageHeader />
      <main className="px-5 py-8 md:px-8 xl:px-10">
        <section>
          <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Selamat datang</h1>
          <p className="mt-2 text-base text-[#6683b8] sm:text-lg">Ringkasan reservasi ruang meeting Anda.</p>
        </section>

        {error && (
          <div role="alert" className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => void loadDashboard()}>
              Coba lagi
            </Button>
          </div>
        )}

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <SummaryCard icon={<CalendarClock className="size-6" />} iconClassName="bg-[#edf3ff] text-[#2864d7]" value={loading ? "–" : (summary?.UpcomingBookings ?? 0)} label="Reservasi Mendatang" />
          <SummaryCard icon={<CalendarRange className="size-6" />} iconClassName="bg-[#ecf8ef] text-[#2d7b46]" value={loading ? "–" : (summary?.totalBookings ?? 0)} label="Total Reservasi" />
          <SummaryCard icon={<BadgeCheck className="size-6" />} iconClassName="bg-[#edf3ff] text-[#2864d7]" value={loading ? "–" : (summary?.BookingsSelesai ?? 0)} label="Reservasi Selesai" />
        </section>

        <Card className="mt-8 overflow-hidden rounded-2xl border-slate-200 py-0">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
            <div>
              <h2 className="text-xl font-bold">Jadwal Rapat Terdekat Anda</h2>
              <p className="mt-1 text-sm text-slate-500">Reservasi mendatang yang sudah dikonfirmasi.</p>
            </div>
            <Link href="/bookings" className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#2864d7] transition-colors hover:bg-[#edf3ff]">
              Lihat Semua
              <CalendarDays className="size-4" />
            </Link>
          </div>

          {loading || now === null ? (
            <div className="flex min-h-56 items-center justify-center px-6 py-12 text-center text-slate-500">
              <LoaderCircle className="mr-2 size-4 animate-spin" />
              Memuat jadwal…
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center px-6 py-12 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-[#edf3ff] text-[#2864d7]">
                <CalendarDays className="size-7" />
              </span>
              <p className="mt-4 font-semibold">Belum ada jadwal rapat</p>
              <p className="mt-1 text-sm text-slate-500">Booking mendatang akan muncul di sini.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 px-6 sm:px-8">
              {upcomingBookings.map((booking) => {
                const date = getDateParts(booking.startAt);
                return (
                  <article key={booking.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
                        <span className="text-lg font-bold text-slate-900">{date.day}</span>
                        <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">{date.month}</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-slate-900" title={booking.title}>
                          {booking.title}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-slate-500" title={`${booking.rooms.name} · ${booking.rooms.locations}`}>
                          <MapPin className="size-3.5 shrink-0" />
                          {booking.rooms.name} · {booking.rooms.locations}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                          <Clock className="size-3.5 shrink-0" />
                          {formatSchedule(booking)}
                        </p>
                      </div>
                    </div>
                    <Badge className="h-8 w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 text-emerald-700">
                      <BadgeCheck className="mr-1.5 size-4" />
                      Dikonfirmasi
                    </Badge>
                  </article>
                );
              })}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

function SummaryCard({ icon, iconClassName, value, label }: { icon: ReactNode; iconClassName: string; value: number | string; label: string }) {
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
