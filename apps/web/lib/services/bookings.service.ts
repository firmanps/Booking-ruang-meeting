import axios from "axios";
import {
  bookingsDashboardResponseSchema,
  bookingsResponseSchema,
  cancelBookingResponseSchema,
  type Booking,
  type BookingsDashboardSummary,
  myBookingsResponseSchema,
  type MyBooking,
} from "@repo/shared/schemas/bookings.schema";

import axiosInstance from "@/lib/axios";

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
    const response = await axiosInstance.get<unknown>("/bookings");
    const validation = bookingsResponseSchema.safeParse(response.data);
    if (!validation.success) throw new Error("Data booking dari server tidak sesuai format.");
    return validation.data.bookings;
  } catch (error) {
    throw normalizeError(error, "Daftar booking gagal dimuat. Silakan coba lagi.");
  }
}

export async function getBookingsDashboard(): Promise<BookingsDashboardData> {
  try {
    const response = await axiosInstance.get<unknown>("/bookings");
    const validation = bookingsDashboardResponseSchema.safeParse(response.data);
    if (!validation.success) throw new Error("Data ringkasan booking dari server tidak sesuai format.");
    return validation.data;
  } catch (error) {
    throw normalizeError(error, "Ringkasan booking gagal dimuat. Silakan coba lagi.");
  }
}

export async function getMyBookings(): Promise<MyBooking[]> {
  try {
    const response = await axiosInstance.get<unknown>("/bookings/me");
    const validation = myBookingsResponseSchema.safeParse(response.data);
    if (!validation.success) throw new Error("Data booking dari server tidak sesuai format.");
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
    return validation.data.message;
  } catch (error) {
    throw normalizeError(error, "Booking gagal dibatalkan. Silakan coba lagi.");
  }
}
