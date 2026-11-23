import axios from "axios";
import {
  bookingsDashboardResponseSchema,
  bookingsResponseSchema,
  cancelBookingResponseSchema,
  createBookingResponseSchema,
  createBookingSchema,
  roomAvailabilityResponseSchema,
  type Booking,
  type BookingsDashboardSummary,
  type CreateBookingInput,
  myBookingsResponseSchema,
  type MyBooking,
} from "@repo/shared/schemas/bookings.schema";

import axiosInstance from "@/lib/axios";
import { getCachedApiRequest, invalidateApiCache } from "@/lib/api-cache";

type ApiError = { message?: string | string[] };

export type BookingsDashboardData = { bookings: Booking[]; summary: BookingsDashboardSummary };

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

export async function getAllBookings(): Promise<Booking[]> {
  try {
    const data = await getCachedApiRequest(
      "bookings:list",
      async () => (await axiosInstance.get<unknown>("/bookings")).data,
      3_000,
    );
    const validation = bookingsResponseSchema.safeParse(data);
    if (!validation.success) {
      invalidateApiCache("bookings:list");
      throw new Error("Data booking dari server tidak sesuai format.");
    }
    return validation.data.bookings;
  } catch (error) {
    throw normalizeError(error, "Daftar booking gagal dimuat. Silakan coba lagi.");
  }
}

export async function getBookingsDashboard(): Promise<BookingsDashboardData> {
  try {
    const data = await getCachedApiRequest(
      "bookings:list",
      async () => (await axiosInstance.get<unknown>("/bookings")).data,
      3_000,
    );
    const validation = bookingsDashboardResponseSchema.safeParse(data);
    if (!validation.success) {
      invalidateApiCache("bookings:list");
      throw new Error("Data ringkasan booking dari server tidak sesuai format.");
    }
    return validation.data;
  } catch (error) {
    throw normalizeError(error, "Ringkasan booking gagal dimuat. Silakan coba lagi.");
  }
}

export async function getMyBookings(): Promise<MyBooking[]> {
  try {
    const data = await getCachedApiRequest(
      "bookings:me",
      async () => (await axiosInstance.get<unknown>("/bookings/me")).data,
      3_000,
    );
    const validation = myBookingsResponseSchema.safeParse(data);
    if (!validation.success) {
      invalidateApiCache("bookings:me");
      throw new Error("Data booking dari server tidak sesuai format.");
    }
    return validation.data.bookings;
  } catch (error) {
    throw normalizeError(error, "Daftar booking gagal dimuat. Silakan coba lagi.");
  }
}

export async function cancelBooking(id: string): Promise<string> {
  try {
    const response = await axiosInstance.delete<unknown>(`/bookings/${id}`);
    const validation = cancelBookingResponseSchema.safeParse(response.data);
    if (!validation.success) throw new Error("Respons pembatalan booking tidak sesuai format.");
    invalidateApiCache("bookings:");
    invalidateApiCache("rooms:availability:");
    return validation.data.message;
  } catch (error) {
    throw normalizeError(error, "Booking gagal dibatalkan. Silakan coba lagi.");
  }
}

export async function getRoomAvailability(roomId: string, date: string) {
  try {
    const data = await getCachedApiRequest(
      `rooms:availability:${roomId}:${date}`,
      async () => (await axiosInstance.get<unknown>(`/rooms/${roomId}/availability`, { params: { date } })).data,
      1_000,
    );
    const validation = roomAvailabilityResponseSchema.safeParse(data);
    if (!validation.success) {
      invalidateApiCache(`rooms:availability:${roomId}:${date}`);
      throw new Error("Data jadwal ruangan dari server tidak sesuai format.");
    }
    return validation.data;
  } catch (error) {
    throw normalizeError(error, "Jadwal ruangan gagal dimuat. Silakan coba lagi.");
  }
}

export async function createBooking(data: CreateBookingInput) {
  try {
    const input = createBookingSchema.safeParse(data);
    if (!input.success) throw new Error("Data booking tidak valid.");
    const response = await axiosInstance.post<unknown>("/bookings", input.data);
    const validation = createBookingResponseSchema.safeParse(response.data);
    if (!validation.success) throw new Error("Data booking dari server tidak sesuai format.");
    invalidateApiCache("bookings:");
    invalidateApiCache("rooms:availability:");
    return validation.data;
  } catch (error) {
    throw normalizeError(error, "Booking gagal dibuat. Silakan coba lagi.");
  }
}
