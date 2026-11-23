"use client";

import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { postAuth, type LoginResponse } from "@/lib/services/auth.service";
import { loginSchema } from "@repo/shared/schemas/auth.schema";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const validation = loginSchema.safeParse({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

    if (!validation.success) {
      setError(validation.error.issues.map((issue) => issue.message).join(" "));
      return;
    }

    setIsLoading(true);
    try {
      const result = await postAuth<LoginResponse>("login", validation.data);
      const destination = result.user.role.toUpperCase() === "ADMIN" ? "/admin/dashboard" : "/dashboard";
      router.replace(destination);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
      <CardHeader className="items-center pb-0 text-center">
        <Link href="/" aria-label="MeetSpace, kembali ke beranda" className="mx-auto mb-2 grid size-16 place-items-center overflow-hidden rounded-xl bg-[#edf3ff] lg:hidden">
          <Image src="/logo.webp" alt="MeetSpace" width={64} height={64} className="size-full object-contain" />
        </Link>
        <CardTitle className="text-2xl">Selamat datang kembali</CardTitle>
        <CardDescription>Masuk untuk mengelola pemesanan ruang meeting Anda.</CardDescription>
      </CardHeader>

      <CardContent className="mt-1">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" name="email" type="email" placeholder="nama@perusahaan.com" autoComplete="email" maxLength={100} required disabled={isLoading} />
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <span className="text-xs text-muted-foreground">Gunakan password akun Anda</span>
              </div>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Masukkan password" autoComplete="current-password" maxLength={255} required disabled={isLoading} className="pr-11" />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>

            {error && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full bg-[#17386f] text-white hover:bg-[#102a56]" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </FieldGroup>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-foreground underline underline-offset-4">
            Daftar sekarang
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
