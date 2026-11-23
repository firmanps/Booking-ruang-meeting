import axios from "axios";
import {
  deleteRoomResponseSchema,
  roomResponseSchema,
  roomsResponseSchema,
  type CreateRoomInput,
  type Room,
  type UpdateRoomInput,
} from "@repo/shared/schemas/rooms.schema";

import axiosInstance from "@/lib/axios";

type ApiError = { message?: string | string[] };

function normalizeError(error: unknown, fallback: string): Error {
  if (axios.isAxiosError<ApiError>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return new Error(message.join(" "));
    if (message) return new Error(message);
    if (!error.response) return new Error("Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.");
    return new Error(fallback);
  }
  return error instanceof Error ? error : new Error(fallback);
}

export async function getRooms(): Promise<Room[]> {
  try {
    const response = await axiosInstance.get<unknown>("/rooms");
    const validation = roomsResponseSchema.safeParse(response.data);
    if (!validation.success) throw new Error("Data ruangan dari server tidak sesuai format.");
    return validation.data.rooms;
  } catch (error) {
    throw normalizeError(error, "Daftar ruangan gagal dimuat. Silakan coba lagi.");
  }
}

export async function createRoom(data: CreateRoomInput): Promise<Room> {
  try {
    const response = await axiosInstance.post<unknown>("/rooms", data);
    const validation = roomResponseSchema.safeParse(response.data);
    if (!validation.success) throw new Error("Data ruangan dari server tidak sesuai format.");
    return validation.data.room;
  } catch (error) {
    throw normalizeError(error, "Ruangan gagal ditambahkan. Silakan coba lagi.");
  }
}

export async function updateRoom(id: string, data: UpdateRoomInput): Promise<Room> {
  try {
    const response = await axiosInstance.patch<unknown>(`/rooms/${id}`, data);
    const validation = roomResponseSchema.safeParse(response.data);
    if (!validation.success) throw new Error("Data ruangan dari server tidak sesuai format.");
    return validation.data.room;
  } catch (error) {
    throw normalizeError(error, "Ruangan gagal diperbarui. Silakan coba lagi.");
  }
}

export async function deleteRoom(id: string): Promise<string> {
  try {
    const response = await axiosInstance.delete<unknown>(`/rooms/${id}`);
    const validation = deleteRoomResponseSchema.safeParse(response.data);
    if (!validation.success) throw new Error("Respons penghapusan ruangan tidak sesuai format.");
    return validation.data.message;
  } catch (error) {
    throw normalizeError(error, "Ruangan gagal dihapus. Silakan coba lagi.");
  }
}
