"use client";

import AdminSidebar from "@/components/sidebar/AdminSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, CheckCircle2, Ellipsis, XCircle } from "lucide-react";

const bookings = [
  {
    initials: "BS",
    employee: "Budi Santoso",
    email: "budi@kantor.id",
    room: "Ruang Rapat Garuda",
    location: "Lantai 5 · Sayap Barat",
    date: "Jumat, 20 Nov",
    time: "10.00-11.00 WIB",
    agenda: "Retro Sprint Sebelumnya",
    status: "confirmed",
  },
  {
    initials: "BS",
    employee: "Budi Santoso",
    email: "budi@kantor.id",
    room: "Ruang Kolaborasi Merapi",
    location: "Lantai 3 · Creative Hub",
    date: "Sabtu, 21 Nov",
    time: "13.00-14.00 WIB",
    agenda: "Design Review Aplikasi Mobile",
    status: "cancelled",
  },
  {
    initials: "SR",
    employee: "Siti Rahmawati",
    email: "siti@kantor.id",
    room: "Ruang Rapat Garuda",
    location: "Lantai 5 · Sayap Barat",
    date: "Minggu, 22 Nov",
    time: "09.00-10.30 WIB",
    agenda: "Sinkronisasi Sprint Tim Produk",
    status: "confirmed",
  },
  {
    initials: "RK",
    employee: "Ratu Kusuma",
    email: "ratu@kantor.id",
    room: "Ruang Rapat Nusantara",
    location: "Lantai 8 · Sayap Timur",
    date: "Minggu, 22 Nov",
    time: "13.00-14.00 WIB",
    agenda: "Review Kampanye Pemasaran",
    status: "confirmed",
  },
];

export default function ManageBookingsPage() {
  return (
    <AdminSidebar>
      <div className="min-h-svh w-full min-w-0 overflow-x-hidden bg-[#f7f9ff] text-[#121a33]">
        <header className="flex h-20 items-center justify-between border-b border-slate-200/80 bg-white px-5 md:px-8 xl:px-10">
          <p className="text-sm font-medium text-[#6683b8] sm:text-base">Minggu, 22 November 2026</p>
          <Avatar size="lg" className="relative z-10 size-11 bg-[#17386f] ring-2 ring-white">
            <AvatarFallback className="bg-[#17386f] text-sm font-bold text-white">DA</AvatarFallback>
          </Avatar>
        </header>

        <main className="w-full min-w-0 px-5 py-8 md:px-8 xl:px-10">
          <section>
            <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Manajemen Seluruh Reservasi</h1>
            <p className="mt-2 text-base text-[#6683b8] sm:text-lg">Pantau, kelola, dan batalkan seluruh reservasi rapat di gedung.</p>
          </section>

          <Card className="mt-7 grid gap-4 rounded-2xl border-slate-200 px-5 py-5 md:grid-cols-[220px_220px] lg:w-fit">
            <div className="space-y-2">
              <label htmlFor="status-filter" className="text-sm font-medium">
                Status
              </label>
              <Select defaultValue="all">
                <SelectTrigger id="status-filter" className="h-11 w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="date-filter" className="text-sm font-medium">
                Tanggal
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
                <input id="date-filter" type="date" className="h-11 w-full rounded-lg border border-input bg-white pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
              </div>
            </div>
          </Card>

          <Card className="mt-6 max-w-full overflow-hidden rounded-2xl border-slate-200 py-0">
            <Table className="min-w-[880px]">
              <TableHeader className="bg-[#fafbfc]">
                <TableRow className="border-slate-200">
                  <TableHead className="h-14 min-w-56 px-6">Karyawan / Email</TableHead>
                  <TableHead className="h-14 min-w-52">Ruangan</TableHead>
                  <TableHead className="h-14 min-w-44">Tanggal & Jam</TableHead>
                  <TableHead className="h-14 min-w-52">Title</TableHead>
                  <TableHead className="h-14 min-w-36">Status</TableHead>
                  <TableHead className="h-14 w-20 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking, index) => (
                  <TableRow key={`${booking.email}-${index}`} className="h-20 border-slate-200">
                    <TableCell className="px-6">
                      <div className="flex items-center gap-3">
                        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[#17386f] text-xs font-bold text-white">{booking.initials}</div>
                        <div>
                          <p className="font-semibold">{booking.employee}</p>
                          <p className="mt-1 text-sm text-[#6683b8]">{booking.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{booking.room}</p>
                      <p className="mt-1 text-sm text-[#6683b8]">{booking.location}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{booking.date}</p>
                      <p className="mt-1 text-sm text-[#6683b8]">{booking.time}</p>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-56 truncate font-medium" title={booking.agenda}>
                        {booking.agenda}
                      </p>
                    </TableCell>
                    <TableCell>
                      {booking.status === "confirmed" ? (
                        <Badge className="h-7 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-emerald-700">
                          <CheckCircle2 />
                          Dikonfirmasi
                        </Badge>
                      ) : (
                        <Badge className="h-7 rounded-full border border-red-200 bg-red-50 px-3 text-red-700">
                          <XCircle />
                          Dibatalkan
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Button type="button" variant="ghost" size="icon" aria-label={`Aksi reservasi ${booking.agenda}`} className="text-slate-500">
                        <Ellipsis />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </main>
      </div>
    </AdminSidebar>
  );
}
