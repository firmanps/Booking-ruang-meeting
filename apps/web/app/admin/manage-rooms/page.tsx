"use client";

import { CheckCircle2, LoaderCircle, Pencil, Plus, RefreshCw, Trash2, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
import type { CreateRoomInput, Room } from "@repo/shared/schemas/rooms.schema";
import { createRoom as createRoomRequest, deleteRoom as deleteRoomRequest, getRooms, updateRoom as updateRoomRequest } from "@/lib/services/rooms.service";

export default function ManageRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyRoomId, setBusyRoomId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);

  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRooms(await getRooms());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Daftar ruangan gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getRooms()
      .then((result) => {
        if (active) setRooms(result);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Daftar ruangan gagal dimuat.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function addRoom(formData: FormData) {
    const data = roomFormData(formData);
    setSaving(true);
    setError("");
    try {
      await createRoomRequest(data);
      setAddOpen(false);
      setNotice("Ruangan berhasil ditambahkan.");
      await loadRooms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ruangan gagal ditambahkan.");
    } finally {
      setSaving(false);
    }
  }

  async function updateRoom(formData: FormData) {
    if (!editingRoom) return;
    const data = roomFormData(formData, editingRoom.isActive);
    setSaving(true);
    setError("");
    try {
      await updateRoomRequest(editingRoom.id, data);
      setEditingRoom(null);
      setNotice("Ruangan berhasil diperbarui.");
      await loadRooms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ruangan gagal diperbarui.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleRoom(room: Room, isActive: boolean) {
    setBusyRoomId(room.id);
    setError("");
    setRooms((current) => current.map((item) => (item.id === room.id ? { ...item, isActive } : item)));
    try {
      const updatedRoom = await updateRoomRequest(room.id, { isActive });
      setRooms((current) => current.map((item) => (item.id === room.id ? { ...item, isActive: updatedRoom.isActive } : item)));
    } catch (err) {
      setRooms((current) => current.map((item) => (item.id === room.id ? { ...item, isActive: room.isActive } : item)));
      setError(err instanceof Error ? err.message : "Status ruangan gagal diperbarui.");
    } finally {
      setBusyRoomId(null);
    }
  }

  async function deleteRoom() {
    if (!deletingRoom) return;
    const room = deletingRoom;
    setBusyRoomId(room.id);
    setError("");
    try {
      const message = await deleteRoomRequest(room.id);
      setRooms((current) => current.filter((item) => item.id !== room.id));
      setDeletingRoom(null);
      setNotice(message || "Ruangan berhasil dihapus.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ruangan gagal dihapus.");
    } finally {
      setBusyRoomId(null);
    }
  }

  function clearMessages() {
    setError("");
    setNotice("");
  }

  return (
    <div className="min-h-svh bg-[#f7f9ff] text-[#121a33]">
      <PageHeader />
      <main className="w-full min-w-0 px-5 py-8 md:px-8 xl:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <section>
            <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Manajemen Data Ruang Rapat</h1>
            <p className="mt-2 text-base text-[#6683b8] sm:text-lg">Tambah, ubah, aktifkan, atau nonaktifkan ruangan gedung.</p>
          </section>
          <Dialog
            open={addOpen}
            onOpenChange={(open) => {
              setAddOpen(open);
              if (open) clearMessages();
            }}
          >
            <DialogTrigger render={<Button className="h-11 rounded-xl bg-[#17386f] px-5" />}>
              <Plus />
              Tambah Ruangan
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Tambah Ruangan Baru</DialogTitle>
                <DialogDescription>Masukkan informasi ruangan yang akan digunakan untuk reservasi.</DialogDescription>
              </DialogHeader>
              <RoomForm onSubmit={addRoom} submitLabel="Tambah Ruangan" submitting={saving} error={error} />
            </DialogContent>
          </Dialog>
        </div>

        {(error || notice) && (
          <div
            role={error ? "alert" : "status"}
            className={`mt-5 flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}
          >
            <span>{error || notice}</span>
            {error && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearMessages();
                  void loadRooms();
                }}
              >
                <RefreshCw className="size-4" />
                Coba lagi
              </Button>
            )}
          </div>
        )}

        <Card className="mt-7 max-w-full overflow-hidden rounded-2xl border-slate-200 py-0">
          <Table className="min-w-220">
            <TableHeader className="bg-[#fafbfc]">
              <TableRow className="border-slate-200">
                <TableHead className="h-14 min-w-64 px-6">Ruangan</TableHead>
                <TableHead className="h-14 min-w-28">Kapasitas</TableHead>
                <TableHead className="h-14 min-w-72">Fasilitas</TableHead>
                <TableHead className="h-14 min-w-44 text-center">Status Aktif</TableHead>
                <TableHead className="h-14 w-40 pr-12 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-36 text-center text-slate-500">
                    <LoaderCircle className="mr-2 inline size-4 animate-spin" />
                    Memuat data ruangan…
                  </TableCell>
                </TableRow>
              ) : rooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-36 text-center text-slate-500">
                    Belum ada data ruangan.
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room) => (
                  <TableRow key={room.id} className="min-h-24 border-slate-200">
                    <TableCell className="px-6 py-5">
                      <p className="font-semibold">{room.name}</p>
                      <p className="mt-1 text-sm text-[#6683b8]">{room.locations}</p>
                    </TableCell>
                    <TableCell className="font-medium">{room.capacity} Orang</TableCell>
                    <TableCell>
                      <p className="block max-w-md truncate text-sm leading-6 text-slate-600" title={room.facilities}>
                        {room.facilities}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-3">
                        {room.isActive ? (
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
                        <Switch
                          checked={room.isActive}
                          disabled={busyRoomId === room.id || loading}
                          aria-label={`Status ${room.name}`}
                          onCheckedChange={(checked) => {
                            clearMessages();
                            void toggleRoom(room, checked);
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={`Ubah ${room.name}`}
                          disabled={busyRoomId === room.id}
                          onClick={() => {
                            clearMessages();
                            setEditingRoom(room);
                          }}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={`Hapus ${room.name}`}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          disabled={busyRoomId === room.id}
                          onClick={() => {
                            clearMessages();
                            setDeletingRoom(room);
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </main>

      <Dialog
        open={editingRoom !== null}
        onOpenChange={(open) => {
          if (!open && !saving) setEditingRoom(null);
        }}
      >
        {editingRoom && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Ubah Ruangan</DialogTitle>
              <DialogDescription>Perbarui informasi dan fasilitas ruangan.</DialogDescription>
            </DialogHeader>
            <RoomForm room={editingRoom} onSubmit={updateRoom} submitLabel="Simpan Perubahan" submitting={saving} error={error} />
          </DialogContent>
        )}
      </Dialog>
      <AlertDialog
        open={deletingRoom !== null}
        onOpenChange={(open) => {
          if (!open && busyRoomId === null) setDeletingRoom(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus ruangan?</AlertDialogTitle>
            <AlertDialogDescription>{deletingRoom ? `${deletingRoom.name} akan dihapus beserta booking terkait. Tindakan ini tidak dapat dibatalkan.` : ""}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busyRoomId !== null}>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={busyRoomId !== null}
              onClick={(event) => {
                event.preventDefault();
                void deleteRoom();
              }}
            >
              {busyRoomId ? <LoaderCircle className="animate-spin" /> : null}Hapus Ruangan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function roomFormData(formData: FormData, isActive = true): CreateRoomInput {
  return {
    name: String(formData.get("name") ?? "").trim(),
    locations: String(formData.get("locations") ?? "").trim(),
    capacity: Number(formData.get("capacity")),
    facilities: String(formData.get("facilities") ?? "").trim(),
    isActive,
  };
}

function RoomForm({ room, onSubmit, submitLabel, submitting, error }: { room?: Room; onSubmit: (formData: FormData) => Promise<void>; submitLabel: string; submitting: boolean; error: string }) {
  return (
    <form action={onSubmit} className="grid gap-4">
      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="grid gap-2">
        <label htmlFor="room-name" className="text-sm font-medium">
          Nama Ruangan
        </label>
        <Input id="room-name" name="name" defaultValue={room?.name} placeholder="Contoh: Ruang Rapat Nusantara" maxLength={100} required />
      </div>
      <div className="grid gap-2">
        <label htmlFor="room-locations" className="text-sm font-medium">
          Lokasi
        </label>
        <Input id="room-locations" name="locations" defaultValue={room?.locations} placeholder="Contoh: Gedung A lantai 2" maxLength={1000} required />
      </div>
      <div className="grid gap-2">
        <label htmlFor="room-capacity" className="text-sm font-medium">
          Kapasitas
        </label>
        <Input id="room-capacity" name="capacity" type="number" min={1} max={1000} step={1} defaultValue={room?.capacity} placeholder="20" required />
      </div>
      <div className="grid gap-2">
        <label htmlFor="room-facilities" className="text-sm font-medium">
          Fasilitas
        </label>
        <Textarea id="room-facilities" name="facilities" defaultValue={room?.facilities} placeholder="Proyektor, Papan Tulis, AC" maxLength={1000} className="min-h-20" required />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={submitting} className="bg-[#17386f]">
          {submitting && <LoaderCircle className="animate-spin" />}
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
