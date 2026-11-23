"use client";

import { CheckCircle2, Clock, MapPin } from "lucide-react";
import { useState } from "react";

import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type BookingItem = {
  id: string;
  dateDay: string;
  dateMonth: string;
  title: string;
  roomName: string;
  location: string;
  time: string;
  status: "Dikonfirmasi" | "Menunggu";
};

const mockBookings: BookingItem[] = [
  {
    id: "1",
    dateDay: "23",
    dateMonth: "NOV",
    title: "asdad",
    roomName: "Ruang Rapat Nusantara",
    location: "Lantai 8 · Sayap Timur",
    time: "Senin, 12:00–12:30 WIB",
    status: "Dikonfirmasi",
  },
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history" | "cancelled">("upcoming");

  return (
    <div className="min-h-svh w-full min-w-0 overflow-x-hidden bg-[#f7f9ff] text-[#121a33]">
        {/* Header Utama */}
        <PageHeader date="Senin, 23 November 2026" />

        <main className="w-full min-w-0 px-5 py-8 md:px-8 xl:px-10">
          {/* Judul Halaman */}
          <section>
            <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Pemesanan Saya</h1>
            <p className="mt-2 text-base text-[#6683b8] sm:text-lg">Kelola jadwal rapat mendatang dan tinjau riwayat reservasi Anda.</p>
          </section>

          {/* Navigasi Tab */}
          <div className="mt-8 flex w-full items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${activeTab === "upcoming" ? "bg-white text-slate-900 shadow-sm border border-slate-200/60" : "text-slate-500 hover:text-slate-700"}`}
            >
              Mendatang
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${activeTab === "history" ? "bg-white text-slate-900 shadow-sm border border-slate-200/60" : "text-slate-500 hover:text-slate-700"}`}
            >
              Selesai
            </button>
            <button
              onClick={() => setActiveTab("cancelled")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${activeTab === "cancelled" ? "bg-white text-slate-900 shadow-sm border border-slate-200/60" : "text-slate-500 hover:text-slate-700"}`}
            >
              Dibatalkan
            </button>
          </div>

          {/* Konten Tab */}
          <div className="mt-6">
            {activeTab === "upcoming" && (
              <div className="space-y-4">
                {mockBookings.map((booking) => (
                  <Card key={booking.id} className="flex flex-col gap-4 rounded-2xl border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    {/* Info Kiri & Tengah */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                      {/* Box Tanggal */}
                      <div className="flex h-[68px] w-[68px] shrink-0 flex-col items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-xl font-bold text-slate-900">{booking.dateDay}</span>
                        <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">{booking.dateMonth}</span>
                      </div>

                      {/* Detail Pemesanan */}
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{booking.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="size-3.5" />
                            {booking.roomName} · {booking.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="size-3.5" />
                            {booking.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tombol Aksi & Status Kanan */}
                    <div className="flex items-center gap-3 sm:self-center">
                      <Badge className="h-8 rounded-full border border-emerald-200 bg-emerald-50/50 px-3 text-emerald-700 shadow-none hover:bg-emerald-50">
                        <CheckCircle2 className="mr-1.5 size-4" />
                        {booking.status}
                      </Badge>
                      <Button variant="outline" className="h-8 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                        Batalkan
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "history" && (
              <Card className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border-slate-200 text-center">
                <p className="font-semibold text-slate-700">Belum ada riwayat selesai</p>
                <p className="mt-1 text-sm text-slate-500">Jadwal rapat yang sudah selesai akan muncul di sini.</p>
              </Card>
            )}

            {activeTab === "cancelled" && (
              <Card className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border-slate-200 text-center">
                <p className="font-semibold text-slate-700">Belum ada pemesanan dibatalkan</p>
                <p className="mt-1 text-sm text-slate-500">Riwayat pembatalan rapat Anda akan muncul di sini.</p>
              </Card>
            )}
          </div>
        </main>
    </div>
  );
}
