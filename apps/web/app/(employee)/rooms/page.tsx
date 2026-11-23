"use client";

import { ArrowLeft, CheckCircle2, Clock3, MapPin, Search, Users, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Room = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  status: "Aktif" | "Nonaktif";
  image: string;
  facilities: string[];
  description: string;
  hours: string;
};

type Booking = {
  id: number;
  roomId: number;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  requester: string;
  status: "Dikonfirmasi" | "Menunggu" | "Ditolak";
};

const rooms: Room[] = [
  {
    id: 1,
    name: "Ruang Rapat Nusantara",
    location: "Lantai 8 · Sayap Timur",
    capacity: 20,
    status: "Aktif",
    image: "/room1.webp",
    facilities: ["Proyektor 4K", 'Smart TV 75"', "Video Conference", "AC"],
    description: "Ruang rapat eksekutif dengan pemandangan kota yang luas untuk presentasi dan rapat direksi.",
    hours: "08.00-18.00 WIB",
  },
  {
    id: 2,
    name: "Ruang Rapat Garuda",
    location: "Lantai 5 · Sayap Barat",
    capacity: 16,
    status: "Aktif",
    image: "/room2.webp",
    facilities: ["Proyektor 4K", "Papan Tulis", "Video Conference", "AC"],
    description: "Ruang konferensi luas untuk rapat divisi, workshop, dan presentasi antardepartemen.",
    hours: "08.00-18.00 WIB",
  },
  {
    id: 3,
    name: "Ruang Kolaborasi Merapi",
    location: "Lantai 3 · Creative Hub",
    capacity: 10,
    status: "Aktif",
    image: "/room3.webp",
    facilities: ['Smart TV 75"', "Papan Tulis", "Wi-Fi Dedicated"],
    description: "Ruang kolaborasi santai untuk brainstorming, sesi kreatif, dan rapat tim kecil.",
    hours: "08.00-18.00 WIB",
  },
  {
    id: 4,
    name: "Ruang Fokus Bromo",
    location: "Lantai 2 · Area Riset",
    capacity: 6,
    status: "Nonaktif",
    image: "/room4.webp",
    facilities: ['Smart TV 75"', "Wi-Fi Dedicated", "Papan Tulis"],
    description: "Ruang kedap suara untuk rapat fokus, diskusi kecil, dan sesi riset.",
    hours: "08.00-18.00 WIB",
  },
  {
    id: 5,
    name: "Ruang Hybrid Rinjani",
    location: "Lantai 4 · Tech Hub",
    capacity: 8,
    status: "Aktif",
    image: "/room1.webp",
    facilities: ["Video Conference Cam", 'Smart TV 75"', "Microphone"],
    description: "Ruang hybrid untuk rapat tatap muka dan konferensi virtual dengan stabil.",
    hours: "08.00-18.00 WIB",
  },
];

const mockBookings: Booking[] = [
  {
    id: 1,
    roomId: 1,
    date: "2026-11-23",
    startTime: "09.00",
    endTime: "10.30",
    title: "Sprint Planning",
    requester: "Siti Rahma",
    status: "Dikonfirmasi",
  },
  {
    id: 2,
    roomId: 1,
    date: "2026-11-23",
    startTime: "13.00",
    endTime: "14.30",
    title: "Review Desain UI",
    requester: "Budi Santoso",
    status: "Dikonfirmasi",
  },
  {
    id: 3,
    roomId: 1,
    date: "2026-11-23",
    startTime: "15.30",
    endTime: "17.00",
    title: "Evaluasi Bulanan",
    requester: "Andi",
    status: "Menunggu",
  },
];

// Helper konversi jam ke menit (cth: "08.30" -> 510)
const timeToMinutes = (timeStr: string) => {
  if (!timeStr || !timeStr.includes(".")) return 0;
  const [h, m] = timeStr.split(".").map(Number);
  return h * 60 + m;
};

const START_WORK_HOUR = 8; // 08.00
const END_WORK_HOUR = 18; // 18.00
const TOTAL_MINUTES = (END_WORK_HOUR - START_WORK_HOUR) * 60; // 600 menit

export default function RoomsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [minCapacity, setMinCapacity] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingDate, setBookingDate] = useState("2026-11-23");
  const [bookingTitle, setBookingTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const filteredBookings = mockBookings.filter((booking) => booking.roomId === selectedRoom?.id && booking.date === bookingDate).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(search.toLowerCase()) || room.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || room.status === status;
    const matchesCapacity = !minCapacity || room.capacity >= Number(minCapacity);

    return matchesSearch && matchesStatus && matchesCapacity;
  });

  const formatTimeInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    return digits.length <= 2 ? digits : `${digits.slice(0, 2)}.${digits.slice(2)}`;
  };

  return (
    <div className="min-h-svh w-full min-w-0 overflow-x-hidden bg-[#f7f9ff] text-[#121a33]">
      <PageHeader />

      <main className="w-full min-w-0 px-5 py-8 md:px-8 xl:px-10">
        <section>
          <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Daftar Ruangan</h1>
          <p className="mt-2 text-base text-[#6683b8] sm:text-lg">Temukan ruangan yang sesuai dengan kebutuhan rapat Anda.</p>
        </section>

        {selectedRoom ? (
          <section className="mt-7">
            <Button type="button" variant="ghost" className="-ml-3 mb-5 rounded-xl px-3 text-slate-600" onClick={() => setSelectedRoom(null)}>
              <ArrowLeft />
              Kembali ke Daftar Ruangan
            </Button>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
              {/* KOLOM KIRI: Detail Ruangan */}
              <div className="space-y-6">
                <Card className="gap-0 overflow-hidden rounded-2xl border-slate-200 py-0">
                  <div className="relative h-64 overflow-hidden sm:h-72">
                    <Image src={selectedRoom.image} alt={selectedRoom.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" />
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedRoom.name}</h2>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                          <span className="flex items-center gap-2">
                            <MapPin className="size-4" />
                            {selectedRoom.location}
                          </span>
                          <span className="flex items-center gap-2">
                            <Users className="size-4" />
                            Kapasitas {selectedRoom.capacity} Orang
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock3 className="size-4" />
                            {selectedRoom.hours}
                          </span>
                        </div>
                      </div>
                      <Badge className="h-7 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-emerald-700">
                        <CheckCircle2 />
                        Aktif
                      </Badge>
                    </div>

                    <p className="mt-6 text-sm leading-7 text-slate-600">{selectedRoom.description}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {selectedRoom.facilities.map((facility) => (
                        <Badge key={facility} variant="secondary" className="h-7 rounded-md border border-slate-200 bg-slate-100 px-2.5 text-slate-600">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* KOLOM KANAN: Formulir & Timeline Jadwal */}
              <Card className="h-fit rounded-2xl border-slate-200 px-6 py-6 lg:sticky lg:top-6">
                <h3 className="text-xl font-bold">Formulir Reservasi</h3>
                <p className="mt-1 text-sm text-slate-500">Pilih tanggal, lalu tentukan waktu rapat Anda.</p>

                <form className="mt-6 space-y-5" onSubmit={(event) => event.preventDefault()}>
                  <div className="space-y-2">
                    <label htmlFor="booking-date" className="text-sm font-medium">
                      Tanggal Rapat
                    </label>
                    <Input id="booking-date" type="date" value={bookingDate} onChange={(event) => setBookingDate(event.target.value)} className="h-11 bg-white" />
                  </div>

                  {/* TIMELINE JADWAL DENGAN SCROLL */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h4 className="mb-4 text-sm font-bold flex items-center gap-2">
                      <Clock3 className="size-4" /> Jadwal pada Tanggal Ini
                    </h4>

                    {/* Wrapper Scrollable untuk geser kiri-kanan */}
                    <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                      {/* Timeline Content (min-width agar bisa di scroll) */}
                      <div className="relative min-w-200">
                        {/* Wadah Blok Jadwal */}
                        <div className="relative h-16 w-full rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
                          {/* Garis Grid Bantuan tiap jam */}
                          {Array.from({ length: 11 }).map((_, i) => {
                            const leftPercent = ((i * 60) / TOTAL_MINUTES) * 100;
                            return <div key={i} className="absolute top-0 bottom-0 border-l border-dashed border-slate-200" style={{ left: `${leftPercent}%` }} />;
                          })}

                          {/* Blok Jadwal Reservasi */}
                          {filteredBookings.map((booking) => {
                            const startM = Math.max(timeToMinutes(booking.startTime), START_WORK_HOUR * 60);
                            const endM = Math.min(timeToMinutes(booking.endTime), END_WORK_HOUR * 60);

                            const left = ((startM - START_WORK_HOUR * 60) / TOTAL_MINUTES) * 100;
                            const width = ((endM - startM) / TOTAL_MINUTES) * 100;

                            return (
                              <div
                                key={booking.id}
                                title={`${booking.title} (${booking.startTime} - ${booking.endTime})`}
                                className="absolute top-2 bottom-2 rounded-lg bg-[#f0f7ff] border border-[#b3d4ff] px-2 py-1 flex flex-col justify-center shadow-sm z-10 overflow-hidden hover:bg-[#e5f0ff] transition-colors cursor-pointer"
                                style={{ left: `${left}%`, width: `${width}%` }}
                              >
                                <span className="text-xs font-bold text-[#1e5eb8] whitespace-nowrap">
                                  {booking.startTime} - {booking.endTime}
                                </span>
                                <span className="text-[11px] text-[#4b82cc] truncate mt-0.5">{booking.title}</span>
                              </div>
                            );
                          })}

                          {/* Penunjuk Waktu Merah */}
                          {filteredBookings.length > 0 && (
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
                              style={{
                                left: `${((timeToMinutes(filteredBookings[0].startTime) - START_WORK_HOUR * 60) / TOTAL_MINUTES) * 100}%`,
                              }}
                            >
                              <div className="absolute -top-1 -translate-x-1/2 size-2.5 rounded-full bg-red-500" />
                            </div>
                          )}
                        </div>

                        {/* Label Jam di bawah (Setiap 1 Jam) */}
                        <div className="relative w-full h-6 mt-3">
                          {Array.from({ length: 11 }).map((_, i) => {
                            const hour = START_WORK_HOUR + i;
                            const leftPercent = ((i * 60) / TOTAL_MINUTES) * 100;
                            return (
                              <span key={hour} className="absolute text-[11px] font-semibold text-slate-500 -translate-x-1/2 whitespace-nowrap" style={{ left: `${leftPercent}%` }}>
                                {String(hour).padStart(2, "0")}:00
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {filteredBookings.length === 0 && <p className="text-xs text-center text-slate-400 mt-3">Belum ada jadwal di tanggal ini.</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="booking-title" className="text-sm font-medium">
                      Judul Rapat
                    </label>
                    <Input id="booking-title" value={bookingTitle} onChange={(event) => setBookingTitle(event.target.value)} placeholder="Contoh: Sprint Planning Q4" className="h-11 bg-white" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Waktu Mulai</label>
                      <Input type="text" inputMode="numeric" placeholder="08.00" maxLength={5} value={startTime} onChange={(e) => setStartTime(formatTimeInput(e.target.value))} className="h-11 w-full bg-white" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Waktu Selesai</label>
                      <Input type="text" inputMode="numeric" placeholder="09.00" maxLength={5} value={endTime} onChange={(e) => setEndTime(formatTimeInput(e.target.value))} className="h-11 w-full bg-white" />
                    </div>
                  </div>

                  <p className="text-xs leading-5 text-slate-500">Durasi reservasi 30 menit sampai 4 jam dan harus berada dalam jam kerja 08.00-18.00 WIB.</p>
                  <Button type="button" className="h-11 w-full rounded-xl bg-[#17386f]">
                    Konfirmasi & Pesan Ruangan
                  </Button>
                </form>
              </Card>
            </div>
          </section>
        ) : (
          <>
            <Card className="mt-7 grid gap-4 rounded-2xl border-slate-200 px-5 py-5 md:grid-cols-[minmax(220px,1fr)_220px_220px]">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama atau lokasi ruangan..." className="h-11 bg-white pl-9" aria-label="Cari ruangan" />
              </div>

              <Input value={minCapacity} onChange={(event) => setMinCapacity(event.target.value)} type="number" min={1} placeholder="Kapasitas minimal" className="h-11 bg-white" aria-label="Kapasitas minimal" />

              <Select value={status} onValueChange={(value) => setStatus(value ?? "All")}>
                <SelectTrigger className="h-11 w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Semua Status</SelectItem>
                  <SelectItem value="Aktif">Hanya Aktif</SelectItem>
                  <SelectItem value="Nonaktif">Hanya Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </Card>

            {filteredRooms.length === 0 ? (
              <Card className="mt-6 flex min-h-64 items-center justify-center rounded-2xl border-slate-200 text-center">
                <div>
                  <p className="font-semibold">Ruangan tidak ditemukan</p>
                  <p className="mt-1 text-sm text-slate-500">Coba ubah kata kunci atau filter pencarian.</p>
                </div>
              </Card>
            ) : (
              <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredRooms.map((room) => (
                  <Card key={room.id} className="gap-0 overflow-hidden rounded-2xl border-slate-200 py-0">
                    <div className="relative h-52 overflow-hidden">
                      <Image src={room.image} alt={room.name} fill className="object-cover transition-transform duration-500 hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                      <div className="absolute top-4 right-4">
                        {room.status === "Aktif" ? (
                          <Badge className="h-7 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-emerald-700">
                            <CheckCircle2 />
                            Aktif
                          </Badge>
                        ) : (
                          <Badge className="h-7 rounded-full border border-red-200 bg-red-50 px-3 text-red-700">
                            <XCircle />
                            Nonaktif
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="text-xl font-bold">{room.name}</h2>
                      <p className="mt-3 flex items-center gap-2 text-sm text-[#6683b8]">
                        <MapPin className="size-4" />
                        {room.location}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm font-medium">
                        <Users className="size-4 text-slate-500" />
                        {room.capacity} Orang
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {room.facilities.slice(0, 3).map((facility) => (
                          <Badge key={facility} variant="secondary" className="h-7 rounded-md border border-slate-200 bg-slate-100 px-2.5 text-slate-600">
                            {facility}
                          </Badge>
                        ))}
                      </div>

                      <Button type="button" className="mt-5 h-11 w-full rounded-xl bg-[#17386f]" disabled={room.status === "Nonaktif"} onClick={() => setSelectedRoom(room)}>
                        Cek Jadwal & Pesan
                      </Button>
                    </div>
                  </Card>
                ))}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
