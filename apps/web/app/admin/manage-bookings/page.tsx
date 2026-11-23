"use client";

import { CalendarDays, CheckCircle2, LoaderCircle, Search, X, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cancelBooking as cancelBookingRequest, getAllBookings } from "@/lib/services/bookings.service";
import type { Booking } from "@repo/shared/schemas/bookings.schema";

function getJakartaDate(value: string) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", weekday: "short", day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function formatTime(value: string) {
  return `${new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(value))} WIB`;
}

export default function ManageBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyBookingId, setBusyBookingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [now, setNow] = useState<number | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setBookings(await getAllBookings());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Daftar booking gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getAllBookings()
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

  useEffect(() => {
    const updateNow = () => setNow(Date.now());
    updateNow();
    const intervalId = window.setInterval(updateNow, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const query = search.trim().toLowerCase();
        const matchesSearch = !query || [booking.title, booking.user.name, booking.user.email, booking.rooms.name, booking.rooms.locations].some((value) => value.toLowerCase().includes(query));
        const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
        const matchesDate = !dateFilter || getJakartaDate(booking.startAt) === dateFilter;
        return matchesSearch && matchesStatus && matchesDate;
      }),
    [bookings, dateFilter, search, statusFilter],
  );

  async function cancelBooking(booking: Booking) {
    setBusyBookingId(booking.id);
    setError("");
    setBookings((current) => current.map((item) => (item.id === booking.id ? { ...item, status: "CANCELLED" } : item)));
    try {
      await cancelBookingRequest(booking.id);
    } catch (err) {
      setBookings((current) => current.map((item) => (item.id === booking.id ? { ...item, status: booking.status } : item)));
      setError(err instanceof Error ? err.message : "Booking gagal dibatalkan.");
    } finally {
      setBusyBookingId(null);
    }
  }

  return (
    <div className="min-h-svh w-full min-w-0 overflow-x-hidden bg-[#f7f9ff] text-[#121a33]">
      <PageHeader />
      <main className="w-full min-w-0 px-5 py-8 md:px-8 xl:px-10">
        <section>
          <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Manajemen Seluruh Reservasi</h1>
          <p className="mt-2 text-base text-[#6683b8] sm:text-lg">Pantau, kelola, dan batalkan seluruh reservasi rapat di gedung.</p>
        </section>

        <Card className="mt-7 grid gap-4 rounded-2xl border-slate-200 px-5 py-5 sm:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_220px_280px]">
          <div className="space-y-2 sm:col-span-2 xl:col-span-1">
            <label htmlFor="booking-search" className="text-sm font-medium">
              Cari Reservasi
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
              <Input id="booking-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Judul, karyawan, email, atau ruangan..." className="h-12 bg-white pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="status-filter" className="text-sm font-medium">
              Status
            </label>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "all")}>
              <SelectTrigger id="status-filter" className="h-12 w-full bg-white data-[size=default]:h-12">
                <span className="flex-1 truncate text-left">{statusFilter === "CONFIRMED" ? "Dikonfirmasi" : statusFilter === "CANCELLED" ? "Dibatalkan" : "Semua Status"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="CONFIRMED">Dikonfirmasi</SelectItem>
                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="date-filter" className="text-sm font-medium">
              Tanggal
            </label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="date-filter"
                  type="date"
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                  className="h-12 w-full rounded-lg border border-input bg-white pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>
              <Button type="button" variant="outline" size="icon" className="size-12 shrink-0" aria-label="Hapus filter tanggal" title="Hapus filter tanggal" disabled={!dateFilter} onClick={() => setDateFilter("")}>
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </Card>

        {error && (
          <div role="alert" className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => void loadBookings()}>
              Coba lagi
            </Button>
          </div>
        )}

        <Card className="mt-6 max-w-full overflow-hidden rounded-2xl border-slate-200 py-0">
          <Table className="min-w-220">
            <TableHeader className="bg-[#fafbfc]">
              <TableRow className="border-slate-200">
                <TableHead className="h-14 min-w-56 px-6">Karyawan / Email</TableHead>
                <TableHead className="h-14 min-w-48">Ruangan</TableHead>
                <TableHead className="h-14 min-w-40">Tanggal & Jam</TableHead>
                <TableHead className="h-14 min-w-44">Title</TableHead>
                <TableHead className="h-14 min-w-36">Status</TableHead>
                <TableHead className="h-14 min-w-32 pr-6 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-36 text-center text-slate-500">
                    <LoaderCircle className="mr-2 inline size-4 animate-spin" />
                    Memuat booking…
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-36 text-center text-slate-500">
                    Tidak ada booking yang cocok dengan pencarian dan filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id} className="h-20 border-slate-200">
                    <TableCell className="max-w-56 px-6">
                      <p className="truncate font-semibold" title={booking.user.name}>
                        {booking.user.name}
                      </p>
                      <p className="mt-1 truncate text-sm text-[#6683b8]" title={booking.user.email}>
                        {booking.user.email}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-48">
                      <p className="truncate font-medium" title={booking.rooms.name}>
                        {booking.rooms.name}
                      </p>
                      <p className="mt-1 truncate text-sm text-[#6683b8]" title={booking.rooms.locations}>
                        {booking.rooms.locations}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-40">
                      <p className="truncate font-medium" title={formatDate(booking.startAt)}>
                        {formatDate(booking.startAt)}
                      </p>
                      <p className="mt-1 truncate text-sm text-[#6683b8]" title={`${formatTime(booking.startAt)} – ${formatTime(booking.endAt)}`}>
                        {formatTime(booking.startAt)} – {formatTime(booking.endAt)}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-44">
                      <p className="truncate font-medium" title={booking.title}>
                        {booking.title}
                      </p>
                    </TableCell>
                    <TableCell>
                      {booking.status === "CANCELLED" ? (
                        <Badge className="h-7 rounded-full border border-red-200 bg-red-50 px-3 text-red-700">
                          <XCircle />
                          Dibatalkan
                        </Badge>
                      ) : now !== null && Date.parse(booking.endAt) <= now ? (
                        <Badge className="h-7 rounded-full border border-slate-200 bg-slate-100 px-3 text-slate-700">
                          <CheckCircle2 />
                          Selesai
                        </Badge>
                      ) : (
                        <Badge className="h-7 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-emerald-700">
                          <CheckCircle2 />
                          Dikonfirmasi
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      {booking.status === "CONFIRMED" && now !== null && Date.parse(booking.endAt) > now ? (
                        <Button type="button" variant="outline" size="sm" disabled={busyBookingId === booking.id} onClick={() => void cancelBooking(booking)} className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800">
                          {busyBookingId === booking.id && <LoaderCircle className="size-4 animate-spin" />}Batalkan
                        </Button>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
