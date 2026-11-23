"use client";

import { CheckCircle2, Clock, LoaderCircle, MapPin, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";

import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MyBooking } from "@repo/shared/schemas/bookings.schema";
import { cancelBooking, getMyBookings } from "@/lib/services/bookings.service";

type BookingTab = "upcoming" | "history" | "cancelled";

const datePartsFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  day: "2-digit",
  month: "short",
});
const fullDateFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function subscribeToClock(onStoreChange: () => void) {
  const intervalId = window.setInterval(onStoreChange, 60_000);
  return () => window.clearInterval(intervalId);
}

function getCurrentTime() {
  return Math.floor(Date.now() / 60_000) * 60_000;
}

function getDateParts(value: string) {
  const parts = datePartsFormatter.formatToParts(new Date(value));
  return {
    day: parts.find((part) => part.type === "day")?.value ?? "",
    month: parts.find((part) => part.type === "month")?.value ?? "",
  };
}

function formatSchedule(startAt: string, endAt: string) {
  const date = fullDateFormatter.format(new Date(startAt));
  const start = timeFormatter.format(new Date(startAt));
  const end = timeFormatter.format(new Date(endAt));
  return `${date}, ${start}–${end} WIB`;
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming");
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyBookingId, setBusyBookingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const now = useSyncExternalStore(subscribeToClock, getCurrentTime, () => 0);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setBookings(await getMyBookings());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Daftar booking gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getMyBookings()
      .then((result) => {
        if (active) setBookings(result);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Daftar booking gagal dimuat.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visibleBookings = useMemo(() => bookings.filter((booking) => {
    if (activeTab === "cancelled") return booking.status === "CANCELLED";
    if (activeTab === "history") return booking.status === "CONFIRMED" && new Date(booking.endAt).getTime() <= now;
    return booking.status === "CONFIRMED" && new Date(booking.endAt).getTime() > now;
  }), [activeTab, bookings, now]);

  async function cancelMyBooking(booking: MyBooking) {
    setBusyBookingId(booking.id);
    setError("");
    setBookings((current) => current.map((item) => item.id === booking.id ? { ...item, status: "CANCELLED" } : item));
    try {
      await cancelBooking(booking.id);
    } catch (err) {
      setBookings((current) => current.map((item) => item.id === booking.id ? { ...item, status: booking.status } : item));
      setError(err instanceof Error ? err.message : "Booking gagal dibatalkan.");
    } finally {
      setBusyBookingId(null);
    }
  }

  const emptyState = {
    upcoming: ["Belum ada jadwal mendatang", "Booking yang akan berlangsung akan muncul di sini."],
    history: ["Belum ada riwayat selesai", "Jadwal rapat yang sudah selesai akan muncul di sini."],
    cancelled: ["Belum ada pemesanan dibatalkan", "Riwayat pembatalan rapat Anda akan muncul di sini."],
  }[activeTab];

  return (
    <div className="min-h-svh w-full min-w-0 overflow-x-hidden bg-[#f7f9ff] text-[#121a33]">
      <PageHeader />
      <main className="w-full min-w-0 px-5 py-8 md:px-8 xl:px-10">
        <section>
          <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Pemesanan Saya</h1>
          <p className="mt-2 text-base text-[#6683b8] sm:text-lg">Kelola jadwal rapat mendatang dan tinjau riwayat reservasi Anda.</p>
        </section>

        <div className="mt-8 flex w-full items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
          {(["upcoming", "history", "cancelled"] as const).map((tab) => {
            const labels = { upcoming: "Mendatang", history: "Selesai", cancelled: "Dibatalkan" };
            return <button key={tab} type="button" onClick={() => setActiveTab(tab)} aria-pressed={activeTab === tab} className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${activeTab === tab ? "border border-slate-200/60 bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{labels[tab]}</button>;
          })}
        </div>

        {error && <div role="alert" className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><Button type="button" variant="outline" size="sm" onClick={() => void loadBookings()}>Coba lagi</Button></div>}

        <div className="mt-6 space-y-4">
          {loading ? <Card className="flex min-h-50 items-center justify-center rounded-2xl border-slate-200 text-slate-500"><LoaderCircle className="mr-2 size-4 animate-spin" />Memuat booking…</Card>
            : visibleBookings.length === 0 ? <Card className="flex min-h-50 flex-col items-center justify-center rounded-2xl border-slate-200 p-6 text-center"><p className="font-semibold text-slate-700">{emptyState[0]}</p><p className="mt-1 text-sm text-slate-500">{emptyState[1]}</p></Card>
              : visibleBookings.map((booking) => {
                const date = getDateParts(booking.startAt);
                const isCancelled = booking.status === "CANCELLED";
                const isHistory = activeTab === "history";
                return <Card key={booking.id} className="flex flex-col gap-4 rounded-2xl border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                    <div className="flex h-17 w-17 shrink-0 flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
                      <span className="text-xl font-bold text-slate-900">{date.day}</span>
                      <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{date.month}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold text-slate-900" title={booking.title}>{booking.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                        <span className="flex min-w-0 items-center gap-1.5"><MapPin className="size-3.5 shrink-0" /><span className="truncate" title={`${booking.rooms.name} · ${booking.rooms.locations}`}>{booking.rooms.name} · {booking.rooms.locations}</span></span>
                        <span className="flex items-center gap-1.5"><Clock className="size-3.5 shrink-0" /><span className="truncate" title={formatSchedule(booking.startAt, booking.endAt)}>{formatSchedule(booking.startAt, booking.endAt)}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:self-center">
                    {isCancelled ? <Badge className="h-8 rounded-full border border-red-200 bg-red-50 px-3 text-red-700"><XCircle className="mr-1.5 size-4" />Dibatalkan</Badge>
                      : isHistory ? <Badge className="h-8 rounded-full border border-slate-200 bg-slate-100 px-3 text-slate-700"><CheckCircle2 className="mr-1.5 size-4" />Selesai</Badge>
                        : <><Badge className="h-8 rounded-full border border-emerald-200 bg-emerald-50/50 px-3 text-emerald-700 shadow-none"><CheckCircle2 className="mr-1.5 size-4" />Dikonfirmasi</Badge><Button type="button" variant="outline" disabled={busyBookingId === booking.id} onClick={() => void cancelMyBooking(booking)} className="h-8 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">{busyBookingId === booking.id && <LoaderCircle className="size-4 animate-spin" />}Batalkan</Button></>}
                  </div>
                </Card>;
              })}
        </div>
      </main>
    </div>
  );
}
