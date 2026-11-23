import axios from "axios";
import axiosInstance from "@/lib/axios";
import { invalidateApiCache } from "@/lib/api-cache";

type ApiError = {
  message?: string | string[];
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type LoginResponse = {
  message: string;
  user: AuthUser;
};

export type RegisterResponse = {
  message: string;
  user: AuthUser & {
    createdAt: string;
    updatedAt: string;
  };
};

export async function postAuth<TResponse>(endpoint: "login" | "register", body: Record<string, string>): Promise<TResponse> {
  try {
    const response = await axiosInstance.post<TResponse>(`/auth/${endpoint}`, body);
    invalidateApiCache();
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ApiError>(error)) {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) throw new Error(message.join(" "));
      if (message) throw new Error(message);
      if (!error.response) throw new Error("Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.");
      throw new Error("Permintaan gagal. Silakan coba lagi.");
    }
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    await axiosInstance.post("/auth/logout");
    invalidateApiCache();
  } catch (error) {
    if (axios.isAxiosError<ApiError>(error)) {
      const message = error.response?.data?.message;
      if (Array.isArray(message)) throw new Error(message.join(" "));
      if (message) throw new Error(message);
      if (!error.response) throw new Error("Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.");
      throw new Error("Logout gagal. Silakan coba lagi.");
    }
    throw error;
  }
}
