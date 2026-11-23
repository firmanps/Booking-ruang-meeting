"use client";

import { CheckCircle2, LoaderCircle, MapPin, Search, Users, XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { getRooms } from "@/lib/services/rooms.service";
import type { Room } from "@repo/shared/schemas/rooms.schema";
import { getRoomSlug, roomImages } from "../../admin/rooms/room-utils";

export default function RoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [minCapacity, setMinCapacity] = useState("");

  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRooms(await getRooms());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Daftar ruangan gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  const filteredRooms = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rooms.filter((room) => {
      const matchesSearch = !query || room.name.toLowerCase().includes(query) || room.locations.toLowerCase().includes(query);
      const matchesStatus = status === "all" || room.isActive === (status === "active");
      const matchesCapacity = !minCapacity || room.capacity >= Number(minCapacity);
      return matchesSearch && matchesStatus && matchesCapacity;
    });
  }, [rooms, search, status, minCapacity]);

  return (
    <div className="min-h-svh w-full min-w-0 overflow-x-hidden bg-[#f7f9ff] text-[#121a33]">
      <PageHeader />
      <main className="w-full min-w-0 px-5 py-8 md:px-8 xl:px-10">
        <section>
          <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Daftar Ruangan</h1>
          <p className="mt-2 text-base text-[#6683b8] sm:text-lg">Temukan ruangan yang sesuai dengan kebutuhan rapat Anda.</p>
        </section>

        <Card className="mt-7 grid gap-4 rounded-2xl border-slate-200 px-5 py-5 md:grid-cols-[minmax(220px,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama atau lokasi ruangan..." className="h-11 bg-white pl-9" aria-label="Cari ruangan" />
          </div>
          <Input value={minCapacity} onChange={(event) => setMinCapacity(event.target.value)} type="number" min={1} placeholder="Kapasitas minimal" className="h-11 bg-white" aria-label="Kapasitas minimal" />
          <Select value={status} onValueChange={(value) => setStatus(value ?? "all")}>
            <SelectTrigger className="h-11 w-full bg-white data-[size=default]:h-11">
              <span className="flex-1 truncate text-left">{status === "active" ? "Hanya Aktif" : status === "inactive" ? "Hanya Nonaktif" : "Semua Status"}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Hanya Aktif</SelectItem>
              <SelectItem value="inactive">Hanya Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {error && (
          <div role="alert" className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => void loadRooms()}>
              Coba lagi
            </Button>
          </div>
        )}

        {loading ? (
          <Card className="mt-6 flex min-h-64 items-center justify-center rounded-2xl border-slate-200 text-slate-500">
            <LoaderCircle className="mr-2 size-4 animate-spin" />
            Memuat ruangan…
          </Card>
        ) : filteredRooms.length === 0 ? (
          <Card className="mt-6 flex min-h-64 items-center justify-center rounded-2xl border-slate-200 text-center">
            <div>
              <p className="font-semibold">Ruangan tidak ditemukan</p>
              <p className="mt-1 text-sm text-slate-500">Coba ubah kata kunci atau filter pencarian.</p>
            </div>
          </Card>
        ) : (
          <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredRooms.map((room) => {
              const index =
                Math.max(
                  0,
                  rooms.findIndex((item) => item.id === room.id),
                ) % roomImages.length;
              return (
                <Card key={room.id} className="gap-0 overflow-hidden rounded-2xl border-slate-200 py-0">
                  <div className="relative h-52 overflow-hidden">
                    <Image src={roomImages[index]} alt={room.name} fill className="object-cover transition-transform duration-500 hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                    <div className="absolute top-4 right-4">
                      <RoomStatusBadge isActive={room.isActive} />
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-bold">{room.name}</h2>
                    <p className="mt-3 flex items-center gap-2 text-sm text-[#6683b8]">
                      <MapPin className="size-4 shrink-0" />
                      {room.locations}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm font-medium">
                      <Users className="size-4 text-slate-500" />
                      {room.capacity} Orang
                    </p>
                    <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600" title={room.facilities}>
                      {room.facilities}
                    </p>
                    <Button type="button" className="mt-5 h-11 w-full rounded-xl bg-[#17386f]" disabled={!room.isActive} onClick={() => router.push(`/rooms/${getRoomSlug(room, rooms)}`)}>
                      Cek Jadwal & Pesan
                    </Button>
                  </div>
                </Card>
              );
            })}
          </section>
        )}
      </main>
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
