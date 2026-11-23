"use client";

import { CheckCircle2, Pencil, Plus, Trash2, XCircle } from "lucide-react";
import { useState } from "react";

import PageHeader from "@/components/PageHeader";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type Room = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  facilities: string[];
  status: boolean;
};

const initialRooms: Room[] = [
  {
    id: 1,
    name: "Ruang Rapat Nusantara",
    location: "Lantai 8 · Sayap Timur",
    capacity: 20,
    facilities: ["Proyektor 4K", 'Smart TV 75"', "Video Conference"],
    status: true,
  },
  {
    id: 2,
    name: "Ruang Rapat Garuda",
    location: "Lantai 5 · Sayap Barat",
    capacity: 16,
    facilities: ["Proyektor 4K", "Papan Tulis", "AC"],
    status: true,
  },
  {
    id: 3,
    name: "Ruang Kolaborasi Merapi",
    location: "Lantai 3 · Creative Hub",
    capacity: 10,
    facilities: ['Smart TV 75"', "Papan Tulis"],
    status: true,
  },
  {
    id: 4,
    name: "Ruang Fokus Bromo",
    location: "Lantai 2 · Area Riset",
    capacity: 6,
    facilities: ['Smart TV 75"', "Wi-Fi Dedicated"],
    status: true,
  },
  {
    id: 5,
    name: "Ruang Hybrid Rinjani",
    location: "Lantai 4 · Tech Hub",
    capacity: 8,
    facilities: ["Video Conference Cam", 'Smart TV 75"'],
    status: false,
  },
];

export default function ManageRoomsPage() {
  const [rooms, setRooms] = useState(initialRooms);
  const [addOpen, setAddOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);

  function toggleRoom(id: number, status: boolean) {
    setRooms((current) => current.map((room) => (room.id === id ? { ...room, status } : room)));
  }

  function deleteRoom() {
    if (!deletingRoom) return;
    setRooms((current) => current.filter((room) => room.id !== deletingRoom.id));
    setDeletingRoom(null);
  }

  function addRoom(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const capacity = Number(formData.get("capacity"));
    const facilities = String(formData.get("facilities") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!name || !location || !capacity) return;

    setRooms((current) => [
      ...current,
      {
        id: Date.now(),
        name,
        location,
        capacity,
        facilities,
        status: true,
      },
    ]);
    setAddOpen(false);
  }

  function updateRoom(formData: FormData) {
    if (!editingRoom) return;
    const name = String(formData.get("name") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const capacity = Number(formData.get("capacity"));
    const facilities = String(formData.get("facilities") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!name || !location || !capacity) return;

    setRooms((current) => current.map((room) => (room.id === editingRoom.id ? { ...room, name, location, capacity, facilities } : room)));
    setEditingRoom(null);
  }

  return (
    <main>
      <div className="min-h-svh bg-[#f7f9ff] text-[#121a33]">
        <PageHeader />

        <main className="px-5 py-8 md:px-8 xl:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <section>
              <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Manajemen Data Ruang Rapat</h1>
              <p className="mt-2 text-base text-[#6683b8] sm:text-lg">Tambah, ubah, aktifkan, atau nonaktifkan ruangan gedung.</p>
            </section>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger render={<Button className="h-11 rounded-xl bg-[#17386f] px-5" />}>
                <Plus />
                Tambah Ruangan
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Tambah Ruangan Baru</DialogTitle>
                  <DialogDescription>Masukkan informasi ruangan yang akan digunakan untuk reservasi.</DialogDescription>
                </DialogHeader>
                <RoomForm onSubmit={addRoom} submitLabel="Tambah Ruangan" />
              </DialogContent>
            </Dialog>
          </div>

          <Card className="mt-7 overflow-hidden rounded-2xl border-slate-200 py-0">
            <Table>
              <TableHeader className="bg-[#fafbfc]">
                <TableRow className="border-slate-200">
                  <TableHead className="h-14 min-w-64 px-6">Ruangan</TableHead>
                  <TableHead className="h-14 min-w-28">Kapasitas</TableHead>
                  <TableHead className="h-14 min-w-72">Fasilitas</TableHead>
                  <TableHead className="h-14 min-w-36 text-center">Status Aktif</TableHead>
                  <TableHead className="h-14 w-40 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id} className="h-24 border-slate-200">
                    <TableCell className="px-6">
                      <div>
                        <div>
                          <p className="font-semibold">{room.name}</p>
                          <p className="mt-1 text-sm text-[#6683b8]">{room.location}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{room.capacity} Orang</TableCell>
                    <TableCell>
                      <div className="flex max-w-md flex-wrap gap-2">
                        {room.facilities.slice(0, 3).map((facility) => (
                          <Badge key={facility} variant="secondary" className="h-7 rounded-md border border-slate-200 bg-slate-100 px-2.5 text-slate-600">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-3">
                        {room.status ? (
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
                        <Switch checked={room.status} aria-label={`Status ${room.name}`} onCheckedChange={(status) => toggleRoom(room.id, status)} />
                      </div>
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="icon" aria-label={`Ubah ${room.name}`} onClick={() => setEditingRoom(room)}>
                          <Pencil />
                        </Button>
                        <Button type="button" variant="outline" size="icon" aria-label={`Hapus ${room.name}`} className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setDeletingRoom(room)}>
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </main>
      </div>

      <Dialog
        open={editingRoom !== null}
        onOpenChange={(open) => {
          if (!open) setEditingRoom(null);
        }}
      >
        {editingRoom && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Ubah Ruangan</DialogTitle>
              <DialogDescription>Perbarui informasi dan fasilitas ruangan.</DialogDescription>
            </DialogHeader>
            <RoomForm room={editingRoom} onSubmit={updateRoom} submitLabel="Simpan Perubahan" />
          </DialogContent>
        )}
      </Dialog>

      <AlertDialog
        open={deletingRoom !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingRoom(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus ruangan?</AlertDialogTitle>
            <AlertDialogDescription>{deletingRoom ? `${deletingRoom.name} akan dihapus beserta reservasi yang terkait. Tindakan ini tidak dapat dibatalkan.` : ""}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={deleteRoom}>
              Hapus Ruangan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

function RoomForm({ room, onSubmit, submitLabel }: { room?: Room; onSubmit: (formData: FormData) => void; submitLabel: string }) {
  return (
    <form action={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="room-name" className="text-sm font-medium">
          Nama Ruangan
        </label>
        <Input id="room-name" name="name" defaultValue={room?.name} placeholder="Contoh: Ruang Rapat Nusantara" required />
      </div>

      <div className="grid gap-2">
        <label htmlFor="room-location" className="text-sm font-medium">
          Lokasi
        </label>
        <Input id="room-location" name="location" defaultValue={room?.location} placeholder="Contoh: Lantai 8 · Sayap Timur" required />
      </div>

      <div className="grid gap-2">
        <label htmlFor="room-capacity" className="text-sm font-medium">
          Kapasitas
        </label>
        <Input id="room-capacity" name="capacity" type="number" min={1} max={1000} defaultValue={room?.capacity} placeholder="20" required />
      </div>

      <div className="grid gap-2">
        <label htmlFor="room-facilities" className="text-sm font-medium">
          Fasilitas
        </label>
        <Textarea id="room-facilities" name="facilities" defaultValue={room?.facilities.join(", ")} placeholder="Proyektor, Papan Tulis, AC" className="min-h-20" />
      </div>

      <DialogFooter>
        <Button type="submit" className="bg-[#17386f]">
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
