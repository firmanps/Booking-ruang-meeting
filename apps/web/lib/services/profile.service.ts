import axios from "axios";
import { authUserSchema, type AuthUser } from "@repo/shared/schemas/auth.schema";

import axiosInstance from "@/lib/axios";

type ApiError = {
  message?: string | string[];
};

export class UnauthorizedProfileError extends Error {
  constructor() {
    super("Sesi login tidak ditemukan atau sudah kedaluwarsa.");
    this.name = "UnauthorizedProfileError";
  }
}

export async function getCurrentProfile(): Promise<AuthUser> {
  try {
    const response = await axiosInstance.get<{ user: unknown }>("/auth/me");
    const validation = authUserSchema.safeParse(response.data.user);

    if (!validation.success) {
      throw new Error("Data profil dari server tidak sesuai format.");
    }

    return validation.data;
  } catch (error) {
    if (axios.isAxiosError<ApiError>(error)) {
      if (error.response?.status === 401) throw new UnauthorizedProfileError();

      const message = error.response?.data?.message;
      if (Array.isArray(message)) throw new Error(message.join(" "));
      if (message) throw new Error(message);
      if (!error.response) throw new Error("Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.");
      throw new Error("Profil gagal dimuat. Silakan coba lagi.");
    }

    throw error;
  }
}
