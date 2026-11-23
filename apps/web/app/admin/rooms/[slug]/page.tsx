"use client";

import { ArrowLeft, CheckCircle2, Clock3, LoaderCircle, MapPin, Users, XCircle } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { createBooking, getRoomAvailability } from "@/lib/services/bookings.service";
import { getRooms } from "@/lib/services/rooms.service";
import type { RoomAvailabilityBooking } from "@repo/shared/schemas/bookings.schema";
import type { Room } from "@repo/shared/schemas/rooms.schema";
import { getRoomSlug, roomImages } from "../room-utils";

const START_WORK_MINUTES = 8 * 60;
const END_WORK_MINUTES = 18 * 60;
const WORKDAY_MINUTES = END_WORK_MINUTES - START_WORK_MINUTES;
const timeFormatter = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

function formatTime(value: string) {
  return timeFormatter.format(new Date(value));
}
function getJakartaToday() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}
function toMinutes(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getUTCHours() * 60 + date.getUTCMinutes() + 7 * 60;
}
function parseTime(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return hour * 60 + minute;
}
function toLocalDateTime(date: string, time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+07:00`;
}
function formatTimeInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export default function RoomDetailPage() {
  return (
    <Suspense fallback={<RoomPageShell><Card className="mt-7 flex min-h-64 items-center justify-center rounded-2xl border-slate-200 text-slate-500"><LoaderCircle className="mr-2 size-4 animate-spin" />Memuat detail ruangan…</Card></RoomPageShell>}>
      <RoomDetailContent />
    </Suspense>
  );
}

function RoomDetailContent() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTitle, setBookingTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availabilityState, setAvailabilityState] = useState<{ key: string; bookings: RoomAvailabilityBooking[]; error: string } | null>(null);
  const [savingBooking, setSavingBooking] = useState(false);

  const room = useMemo(() => rooms.find((item) => getRoomSlug(item, rooms) === slug) ?? null, [rooms, slug]);
  const roomIndex = room
    ? Math.max(
        0,
        rooms.findIndex((item) => item.id === room.id),
      )
    : 0;
  const availabilityKey = room && bookingDate ? `${room.id}:${bookingDate}` : null;
  const currentAvailability = availabilityKey && availabilityState?.key === availabilityKey ? availabilityState : null;
  const sortedAvailability = useMemo(() => [...(currentAvailability?.bookings ?? [])].sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt)), [currentAvailability]);

  useEffect(() => {
    let active = true;
    getRooms()
      .then((result) => {
        if (active) setRooms(result);
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : "Daftar ruangan gagal dimuat.");
      })
      .finally(() => {
        if (active) setLoadingRoom(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loadingRoom || loadError || !slug || rooms.length === 0) return;
    if (!rooms.some((item) => getRoomSlug(item, rooms) === slug)) router.replace("/admin/rooms");
  }, [loadingRoom, loadError, slug, rooms, router]);

  useEffect(() => {
    if (!room || !bookingDate) return;
    let active = true;
    const key = `${room.id}:${bookingDate}`;
    getRoomAvailability(room.id, bookingDate)
      .then((result) => {
        if (active) setAvailabilityState({ key, bookings: result.bookings, error: "" });
      })
      .catch((error: unknown) => {
        if (active) setAvailabilityState({ key, bookings: [], error: error instanceof Error ? error.message : "Jadwal ruangan gagal dimuat." });
      });
    return () => {
      active = false;
    };
  }, [room, bookingDate]);

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!room) return;
    if (bookingDate < getJakartaToday()) {
      toast.error("tidak bisa booking tanggal dimasa lalu");
      return;
    }
    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);
    if (startMinutes === null || endMinutes === null) {
      toast.error("Masukkan waktu mulai dan selesai dengan format 24 jam.");
      return;
    }
    if (startMinutes < START_WORK_MINUTES || endMinutes > END_WORK_MINUTES) {
      toast.error("hanya bisa booking di jam kerja 08:00-18:00");
      return;
    }
    const duration = endMinutes - startMinutes;
    if (duration < 30 || duration > 240) {
      toast.error("durasi booking harus 30 menit-4 jam");
      return;
    }

    setSavingBooking(true);
    try {
      await createBooking({
        roomId: room.id,
        title: bookingTitle.trim(),
        startAt: toLocalDateTime(bookingDate, startTime),
        endAt: toLocalDateTime(bookingDate, endTime),
      });
      toast.success("Booking berhasil dibuat.");
      setBookingTitle("");
      setStartTime("");
      setEndTime("");
      const availability = await getRoomAvailability(room.id, bookingDate);
      setAvailabilityState({ key: `${room.id}:${bookingDate}`, bookings: availability.bookings, error: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking gagal dibuat.");
    } finally {
      setSavingBooking(false);
    }
  }

  if (loadingRoom)
    return (
      <RoomPageShell>
        <Card className="mt-7 flex min-h-64 items-center justify-center rounded-2xl border-slate-200 text-slate-500">
          <LoaderCircle className="mr-2 size-4 animate-spin" />
          Memuat detail ruangan…
        </Card>
      </RoomPageShell>
    );
  if (loadError)
    return (
      <RoomPageShell>
        <Card className="mt-7 flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border-slate-200 text-center">
          <p role="alert" className="text-sm text-red-700">
            {loadError}
          </p>
          <Button variant="outline" onClick={() => router.push("/admin/rooms")}>
            Kembali ke daftar
          </Button>
        </Card>
      </RoomPageShell>
    );
  if (!room)
    return (
      <RoomPageShell>
        <Card className="mt-7 flex min-h-64 items-center justify-center rounded-2xl border-slate-200 text-slate-500">
          <LoaderCircle className="mr-2 size-4 animate-spin" />
          Menyiapkan halaman…
        </Card>
      </RoomPageShell>
    );

  return (
    <RoomPageShell>
      <section className="mt-7">
        <Button type="button" variant="ghost" className="-ml-3 mb-5 rounded-xl px-3 text-slate-600" onClick={() => router.push("/admin/rooms")}>
          <ArrowLeft />
          Kembali ke Daftar Ruangan
        </Button>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <Card className="gap-0 overflow-hidden rounded-2xl border-slate-200 py-0">
            <div className="relative h-64 overflow-hidden sm:h-72">
              <Image src={roomImages[roomIndex % roomImages.length]} alt={room.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <h2 className="text-2xl font-bold">{room.name}</h2>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                    <span className="flex items-center gap-2">
                      <MapPin className="size-4" />
                      {room.locations}
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="size-4" />
                      Kapasitas {room.capacity} Orang
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock3 className="size-4" />
                      08.00–18.00 WIB
                    </span>
                  </div>
                </div>
                <RoomStatusBadge isActive={room.isActive} />
              </div>
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-slate-800">Deskripsi fasilitas</h3>
                <p className="mt-2 break-words text-sm leading-7 text-slate-600 [overflow-wrap:anywhere]">{room.facilities}</p>
              </div>
            </div>
          </Card>

          <Card className="h-fit rounded-2xl border-slate-200 px-6 py-6 lg:sticky lg:top-6">
            <h3 className="text-xl font-bold">Formulir Reservasi</h3>
            <p className="mt-1 text-sm text-slate-500">Pilih tanggal, lalu tentukan waktu rapat Anda.</p>
            <form className="mt-6 space-y-5" onSubmit={submitBooking}>
              <div className="space-y-2">
                <label htmlFor="booking-date" className="text-sm font-medium">
                  Tanggal Rapat
                </label>
                <Input
                  id="booking-date"
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(event) => {
                    setBookingDate(event.target.value);
                    setAvailabilityState(null);
                  }}
                  className="h-11 bg-white"
                />
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h4 className="mb-4 flex items-center gap-2 text-sm font-bold">
                  <Clock3 className="size-4" />
                  Jadwal pada Tanggal Ini
                </h4>
                {currentAvailability?.error && (
                  <p role="alert" className="mb-3 text-xs text-red-600">
                    {currentAvailability.error}
                  </p>
                )}
                {!bookingDate ? (
                  <p className="py-4 text-center text-xs text-slate-400">Pilih tanggal untuk melihat jadwal.</p>
                ) : !currentAvailability ? (
                  <p className="py-4 text-center text-xs text-slate-500">
                    <LoaderCircle className="mr-2 inline size-4 animate-spin" />
                    Memuat jadwal…
                  </p>
                ) : (
                  <>
                    <div className="w-full overflow-x-auto pb-2">
                      <div className="relative min-w-200">
                        <div className="relative h-16 w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                          {Array.from({ length: 11 }).map((_, index) => (
                            <div key={index} className="absolute top-0 bottom-0 border-l border-dashed border-slate-200" style={{ left: `${(index / 10) * 100}%` }} />
                          ))}
                          {sortedAvailability.map((booking) => {
                            const start = Math.max(toMinutes(booking.startAt), START_WORK_MINUTES);
                            const end = Math.min(toMinutes(booking.endAt), END_WORK_MINUTES);
                            if (end <= start) return null;
                            const left = ((start - START_WORK_MINUTES) / WORKDAY_MINUTES) * 100;
                            const width = ((end - start) / WORKDAY_MINUTES) * 100;
                            return (
                              <div
                                key={booking.id}
                                title={`${booking.title} (${formatTime(booking.startAt)}–${formatTime(booking.endAt)})`}
                                className="absolute top-2 bottom-2 z-10 flex flex-col justify-center overflow-hidden rounded-lg border border-[#b3d4ff] bg-[#f0f7ff] px-2 py-1 shadow-sm"
                                style={{ left: `${left}%`, width: `${width}%` }}
                              >
                                <span className="whitespace-nowrap text-xs font-bold text-[#1e5eb8]">
                                  {formatTime(booking.startAt)}–{formatTime(booking.endAt)}
                                </span>
                                <span className="mt-0.5 truncate text-[11px] text-[#4b82cc]">{booking.title}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="relative mt-3 h-6 w-full">
                          {Array.from({ length: 11 }).map((_, index) => (
                            <span
                              key={index}
                              className={`absolute whitespace-nowrap text-[11px] font-semibold text-slate-500 ${index === 0 ? "translate-x-0" : index === 10 ? "-translate-x-full" : "-translate-x-1/2"}`}
                              style={{ left: `${(index / 10) * 100}%` }}
                            >
                              {String(8 + index).padStart(2, "0")}:00
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {sortedAvailability.length === 0 && <p className="mt-3 text-center text-xs text-slate-400">Belum ada booking pada tanggal ini.</p>}
                  </>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="booking-title" className="text-sm font-medium">
                  Judul Rapat
                </label>
                <Input id="booking-title" value={bookingTitle} onChange={(event) => setBookingTitle(event.target.value)} maxLength={50} placeholder="Contoh: Sprint Planning Q4" className="h-11 bg-white" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label htmlFor="start-time" className="text-sm font-medium">
                    Waktu Mulai
                  </label>
                  <Input
                    id="start-time"
                    type="text"
                    inputMode="numeric"
                    placeholder="08:00"
                    maxLength={5}
                    value={startTime}
                    onChange={(event) => setStartTime(formatTimeInput(event.target.value))}
                    className="h-11 w-full bg-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="end-time" className="text-sm font-medium">
                    Waktu Selesai
                  </label>
                  <Input id="end-time" type="text" inputMode="numeric" placeholder="09:00" maxLength={5} value={endTime} onChange={(event) => setEndTime(formatTimeInput(event.target.value))} className="h-11 w-full bg-white" required />
                </div>
              </div>
              <p className="text-xs leading-5 text-slate-500">Durasi 30 menit sampai 4 jam, pada jam kerja 08.00–18.00 WIB.</p>
              <Button type="submit" disabled={savingBooking || !bookingDate || !room.isActive} className="h-11 w-full rounded-xl bg-[#17386f]">
                {savingBooking && <LoaderCircle className="animate-spin" />}Konfirmasi & Pesan Ruangan
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </RoomPageShell>
  );
}

function RoomPageShell({ children }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="min-h-svh w-full min-w-0 overflow-x-hidden bg-[#f7f9ff] text-[#121a33]">
      <PageHeader />
      <main className="w-full min-w-0 px-5 mb-5 md:px-8 xl:px-10">{children}</main>
    </div>
  );
}

function RoomStatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <Badge className="h-7 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-emerald-700">
      <CheckCircle2 />
      Aktif
    </Badge>
  ) : (
    <Badge className="h-7 rounded-full border border-red-200 bg-red-50 px-3 text-red-700">
      <XCircle />
      Nonaktif
    </Badge>
  );
}
