"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getBookingsDashboard } from "@/lib/services/bookings.service";
import { getCurrentProfile } from "@/lib/services/profile.service";
import type { Booking } from "@repo/shared/schemas/bookings.schema";
import { ArrowRight, BadgeCheck, Building2, CalendarClock, CalendarDays, CheckCircle2, Clock, LoaderCircle, XCircle } from "lucide-react";
import type { ReactNode } from "react";

const createdAtFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [summary, setSummary] = useState<{ totalUpcomingBookings: number; totalRooms: number; totalActiveRooms: number } | null>(null);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState("");

  const loadRecentBookings = useCallback(async () => {
    setLoadingBookings(true);
    setBookingsError("");
    try {
      const result = await getBookingsDashboard();
      setSummary(result.summary);
      setRecentBookings([...result.bookings].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5));
    } catch (error) {
      setBookingsError(error instanceof Error ? error.message : "Reservasi terbaru gagal dimuat.");
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getBookingsDashboard()
      .then((result) => {
        if (active) {
          setSummary(result.summary);
          setRecentBookings([...result.bookings].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5));
        }
      })
      .catch((error: unknown) => {
        if (active) setBookingsError(error instanceof Error ? error.message : "Reservasi terbaru gagal dimuat.");
      })
      .finally(() => {
        if (active) setLoadingBookings(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    getCurrentProfile()
      .then((profile) => {
        if (active) setUserName(profile.name);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <main>
      <div className="min-h-svh bg-[#f7f9ff] text-[#121a33]">
        <PageHeader />

        <main className="px-5 py-8 md:px-8 xl:px-10">
          <section>
            <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Selamat datang{userName ? `, ${userName}` : ""}</h1>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <SummaryCard icon={<CalendarClock className="size-6" />} iconClassName="bg-[#edf3ff] text-[#2864d7]" value={summary?.totalUpcomingBookings ?? "–"} label="Reservasi Mendatang" />
            <SummaryCard icon={<Building2 className="size-6" />} iconClassName="bg-[#ecf8ef] text-[#2d7b46]" value={summary?.totalRooms ?? "–"} label="Total Ruangan" />
            <SummaryCard icon={<BadgeCheck className="size-6" />} iconClassName="bg-[#edf3ff] text-[#2864d7]" value={summary?.totalActiveRooms ?? "–"} label="Total Ruangan Aktif" />
          </section>

          <Card className="mt-8 overflow-hidden rounded-2xl border-slate-200 py-0">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
              <div>
                <h2 className="text-xl font-bold">Reservasi Terbaru</h2>
              </div>
              <Button nativeButton={false} render={<Link href="/admin/manage-bookings" />} variant="ghost" className="shrink-0 rounded-xl text-[#2864d7]">
                Lihat Semua
                <ArrowRight className="size-4" />
              </Button>
            </div>

            {loadingBookings ? (
              <div className="flex min-h-56 items-center justify-center text-sm text-slate-500">
                <LoaderCircle className="mr-2 size-4 animate-spin" />
                Memuat reservasi…
              </div>
            ) : bookingsError ? (
              <div role="alert" className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                <p className="text-sm text-red-700">{bookingsError}</p>
                <Button type="button" variant="outline" size="sm" onClick={() => void loadRecentBookings()}>
                  Coba lagi
                </Button>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="flex min-h-56 flex-col items-center justify-center px-6 py-12 text-center">
                <span className="grid size-14 place-items-center rounded-2xl bg-[#edf3ff] text-[#2864d7]">
                  <CalendarDays className="size-7" />
                </span>
                <p className="mt-4 font-semibold">Belum ada reservasi ruangan</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex min-w-0 flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900" title={booking.title}>
                        {booking.title}
                      </p>
                      <p className="mt-1 truncate text-sm text-slate-600" title={`${booking.rooms.name} · ${booking.user.name} (${booking.user.email})`}>
                        {booking.rooms.name} · {booking.user.name}
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="size-3.5" />
                        Dibuat {createdAtFormatter.format(new Date(booking.createdAt))} WIB
                      </p>
                    </div>
                    {booking.status === "CONFIRMED" ? (
                      <Badge className="h-7 w-fit shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-emerald-700">
                        <CheckCircle2 />
                        Dikonfirmasi
                      </Badge>
                    ) : (
                      <Badge className="h-7 w-fit shrink-0 rounded-full border border-red-200 bg-red-50 px-3 text-red-700">
                        <XCircle />
                        Dibatalkan
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </main>
      </div>
    </main>
  );
}

function SummaryCard({ icon, iconClassName, value, label }: { icon: ReactNode; iconClassName: string; value: string | number; label: string }) {
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
